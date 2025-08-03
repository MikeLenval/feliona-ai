import { NextRequest, NextResponse } from 'next/server';
import type { ResponseCookie } from 'next/dist/compiled/@edge-runtime/cookies';
import { createServerClient } from '@supabase/ssr';
import { Redis } from '@upstash/redis';
import pino from 'pino';
import { LRUCache } from 'lru-cache';
import { track } from '@vercel/analytics';
import { pathToRegexp } from 'path-to-regexp';

// Internal imports
import { validateEnvironment, type Environment } from './src/lib/env';
import { 
  generateUUID, 
  generateRequestId, 
  getClientIP, 
  getLocale, 
  isPublicRoute, 
  calculateCacheTTL, 
  validateCorsOrigin 
} from './src/lib/validation';
import { ROUTE_CONFIG, PUBLIC_ROUTES, RATE_LIMITED_ROUTES } from './src/config/routes';
import { SECURITY_CONSTANTS, SECURITY_HEADERS, CACHE_CONFIG } from './src/config/security';
import { CSP_CONFIG, CORS_CONFIG } from './src/config/csp';
import { LOCALIZATION_CONFIG } from './src/config/localization';
import { RecaptchaValidator } from './src/lib/security/recaptcha-validator';
import type { 
  SessionUser, 
  CachedSession, 
  RouteConfig, 
  RoutePattern, 
  RateLimitConfig, 
  SecurityMetrics, 
  CorsValidationResult,
  AccessValidationResult
} from './src/types/platform/auth';
import { RouteType } from './src/types/platform/auth';

// =====================================================
// ENVIRONMENT VALIDATION WITH SAFE DEFAULTS
// =====================================================

const env = validateEnvironment();

// =====================================================
// LOGGING SETUP
// =====================================================

const logger = pino({
  level: env.DEBUG_LOGGING === 'true' ? 'debug' : 'info',
  ...(env.NODE_ENV === 'production' && {
    redact: ['req.headers.authorization', 'req.headers.cookie'],
  }),
});

// =====================================================
// PRODUCTION-SAFE CORS CONFIGURATION
// =====================================================

function validateAndInitializeCors(): CorsValidationResult {
  const result: CorsValidationResult = {
    isValid: true,
    validOrigins: [],
    errors: [],
    fallbackUsed: false
  };

  try {
    const origins = env.NODE_ENV === 'development'
      ? ['http://localhost:3000', ...env.CORS_ALLOWED_ORIGINS.split(',').map(o => o.trim())]
      : env.CORS_ALLOWED_ORIGINS.split(',').map(o => o.trim());
    
    // Validate each origin URL with detailed error reporting
    for (const origin of origins) {
      try {
        const url = new URL(origin);
        // Additional validation for production security
        if (env.NODE_ENV === 'production' && url.protocol !== 'https:') {
          result.errors.push(`Insecure origin in production: ${origin}`);
          result.isValid = false;
          continue;
        }
        result.validOrigins.push(origin);
      } catch (error) {
        result.errors.push(`Invalid CORS origin URL: ${origin} - ${error}`);
        result.isValid = false;
      }
    }

    // Safety check: ensure we have at least one valid origin
    if (result.validOrigins.length === 0) {
      logger.error('No valid CORS origins found, using safe fallback');
      result.validOrigins = env.NODE_ENV === 'development' 
        ? ['http://localhost:3000', 'https://feliona.ai']
        : ['https://feliona.ai', 'https://feliona.app'];
      result.fallbackUsed = true;
      result.isValid = false;
    }

    if (result.isValid) {
      logger.info('CORS origins validated successfully', { 
        origins: result.validOrigins,
        environment: env.NODE_ENV 
      });
    } else {
      logger.warn('CORS validation issues detected', { 
        errors: result.errors,
        fallbackUsed: result.fallbackUsed,
        validOrigins: result.validOrigins
      });
    }

    return result;
  } catch (error) {
    logger.error('Critical CORS configuration failure, using emergency fallback', { error });
    // Emergency fallback - absolute minimum for operation
    result.validOrigins = ['https://feliona.ai'];
    result.fallbackUsed = true;
    result.isValid = false;
    result.errors.push(`Critical configuration error: ${error}`);
    return result;
  }
}

// Initialize CORS with validation
const corsValidation = validateAndInitializeCors();
const ALLOWED_ORIGINS = corsValidation.validOrigins;

// Health check endpoint exposure for CORS validation
if (!corsValidation.isValid && env.NODE_ENV === 'production') {
  logger.error('CORS configuration failed validation in production', {
    errors: corsValidation.errors,
    fallbackUsed: corsValidation.fallbackUsed
  });
  // In production, we could choose to fail fast here
  // process.exit(1); // Uncomment for fail-fast behavior
}

// =====================================================
// CONFIGURATION
// =====================================================

const ROUTE_PATTERNS: RoutePattern[] = Object.entries(ROUTE_CONFIG).map(([path, config]) => {
  const { regexp } = pathToRegexp(path);
  return { regexp, config, originalPath: path };
});

const SUPPORTED_LOCALES = LOCALIZATION_CONFIG.SUPPORTED_LOCALES;
const DEFAULT_LOCALE = LOCALIZATION_CONFIG.DEFAULT_LOCALE;

// =====================================================
// ENHANCED CACHING LAYER WITH BOUNDS
// =====================================================

import { SessionCache } from './src/lib/security/session-cache';
const sessionCache = new SessionCache(env);

// =====================================================
// UTILITY FUNCTIONS
// =====================================================

function getRouteConfig(pathname: string): RouteConfig | null {
  // Сначала проверяем точные совпадения
  if (ROUTE_CONFIG[pathname]) {
    return ROUTE_CONFIG[pathname];
  }

  // Затем проверяем паттерны
  for (const { regexp, config } of ROUTE_PATTERNS) {
    if (regexp.test(pathname)) {
      return config;
    }
  }
  return null;
}

/**
 * 🔧 VALIDATED CORS: Проверка разрешенных origins с improved safety
 */
function isAllowedOrigin(origin: string | null): boolean {
  if (!origin) return false;
  return ALLOWED_ORIGINS.includes(origin);
}

/**
 * 🔧 SAFE CORS HEADERS: Secure CORS header management
 */
function handleCorsHeaders(response: NextResponse, origin: string | null): void {
  if (origin && isAllowedOrigin(origin)) {
    response.headers.set('Access-Control-Allow-Origin', origin);
    response.headers.set('Access-Control-Allow-Credentials', 'true');
    response.headers.set('Access-Control-Allow-Methods', CORS_CONFIG.ALLOWED_METHODS);
    response.headers.set('Access-Control-Allow-Headers', CORS_CONFIG.ALLOWED_HEADERS);
    logger.debug('CORS allowed', { origin });
  } else if (origin) {
    logger.warn('CORS rejected', { origin, allowedOrigins: ALLOWED_ORIGINS });
  }
}

// =====================================================
// SECURITY MODULES
// =====================================================

class RateLimiter {
  private redis: Redis | null = null;
  // 🔧 BOUNDED CACHE: Controlled cache size с reasonable limits
  private memoryCache = new LRUCache<string, { count: number; resetTime: number }>({
    max: env.RATE_LIMIT_CACHE_SIZE, // Configurable bound instead of hardcoded 5000
    ttl: env.RATE_LIMIT_MAX_TTL,    // Bounded TTL instead of 900000
    updateAgeOnGet: true,
  });

  constructor() {
    if (env.UPSTASH_REDIS_REST_URL && env.UPSTASH_REDIS_REST_TOKEN) {
      this.redis = new Redis({
        url: env.UPSTASH_REDIS_REST_URL,
        token: env.UPSTASH_REDIS_REST_TOKEN,
      });
    }
    
    // Log cache configuration for monitoring
    logger.info('RateLimiter initialized', {
      cacheSize: env.RATE_LIMIT_CACHE_SIZE,
      maxTTL: env.RATE_LIMIT_MAX_TTL,
      multiplier: env.CACHE_TTL_MULTIPLIER,
      redisEnabled: !!this.redis
    });
  }

  async checkLimit(
    request: NextRequest,
    config: RateLimitConfig,
    user?: SessionUser
  ): Promise<{ allowed: boolean; remaining: number; resetTime: number }> {
    if (env.NODE_ENV === 'development') {
      return { allowed: true, remaining: config.maxRequests, resetTime: Date.now() + config.windowMs };
    }

    if (user && config.skipForRoles?.includes(user.role)) {
      return { allowed: true, remaining: config.maxRequests, resetTime: Date.now() + config.windowMs };
    }

    const ip = getClientIP(request);
    const identifier = user?.id || ip;
    const key = `rate_limit:${request.nextUrl.pathname}:${identifier}`;

    if (config.requireRecaptcha) {
      const token = request.headers.get('x-recaptcha-token');
      if (!token || !(await RecaptchaValidator.verify(token, ip, env))) {
        logger.warn(`reCAPTCHA verification failed for ${request.nextUrl.pathname}`, { ip, identifier });
        return { allowed: false, remaining: 0, resetTime: Date.now() + config.windowMs };
      }
    }

    if (!this.redis) {
      // 🔧 BOUNDED TTL: Use calculated TTL с maximum bounds
      const ttl = calculateCacheTTL(config.windowMs);
      const cached = this.memoryCache.get(key) || { count: 0, resetTime: Date.now() + ttl };
      
      if (cached.count >= config.maxRequests) {
        logger.warn('Rate limit exceeded (memory)', { 
          path: request.nextUrl.pathname, 
          ip, 
          identifier,
          count: cached.count,
          limit: config.maxRequests,
          ttl: ttl
        });
        return { allowed: false, remaining: 0, resetTime: cached.resetTime };
      }
      
      // Set TTL explicitly для этого ключа
      this.memoryCache.set(key, { count: cached.count + 1, resetTime: cached.resetTime }, { ttl });
      return { allowed: true, remaining: config.maxRequests - cached.count - 1, resetTime: cached.resetTime };
    }

    const luaScript = `
      local key = KEYS[1]
      local window = tonumber(ARGV[1])
      local limit = tonumber(ARGV[2])
      local burst_limit = tonumber(ARGV[3])
      local now = tonumber(ARGV[4])
      
      local current = redis.call('GET', key)
      if current == false then
        current = 0
      else
        current = tonumber(current)
      end
      
      local reset_time = now + (window * 1000)
      
      if current < limit then
        local new_count = redis.call('INCR', key)
        if new_count == 1 then
          redis.call('PEXPIRE', key, window * 1000)
        end
        return {1, limit - new_count, reset_time}
      else
        return {0, 0, reset_time}
      end
    `;

    const result = await this.redis.eval(
      luaScript,
      [key],
      [
        config.windowMs,
        config.maxRequests,
        config.burstLimit || config.maxRequests,
        Date.now(),
      ]
    ) as [number, number, number];

    const [allowed, remaining, resetTime] = result;

    if (!allowed) {
      logger.warn('Rate limit exceeded (Redis)', {
        path: request.nextUrl.pathname,
        ip,
        identifier,
        limit: config.maxRequests,
        window: config.windowMs,
      });
    }

    return {
      allowed: Boolean(allowed),
      remaining,
      resetTime,
    };
  }
}

class AuthenticationService {
  private getSupabaseClient(request: NextRequest, response: NextResponse) {
    return createServerClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY, {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: Partial<ResponseCookie>) {
          response.cookies.set(name, value, options);
        },
        remove(name: string, options: Partial<ResponseCookie>) {
          response.cookies.set(name, '', { ...options, maxAge: 0 });
        }
      }
    });
  }

  static generateCsrfToken(): string {
    return generateUUID().replace(/-/g, '').substring(0, env.CSRF_TOKEN_LENGTH);
  }

  static validateCsrfToken(request: NextRequest, token: string): boolean {
    const storedToken = request.cookies.get('csrf-token')?.value;
    return storedToken === token;
  }

  async getUser(request: NextRequest, response: NextResponse): Promise<SessionUser | null> {
    const startTime = Date.now();
    try {
      const sessionToken = request.cookies.get('sb-access-token')?.value;
      if (sessionToken) {
        const cached = sessionCache.get(sessionToken);
        if (cached) {
          logger.debug('Supabase auth check (cached)', { userId: cached.id });
          return cached;
        }
      }

      const supabase = this.getSupabaseClient(request, response);
      const { data: { user }, error } = await supabase.auth.getUser();

      if (error || !user) {
        if (sessionToken) {
          sessionCache.invalidate(sessionToken);
        }
        return null;
      }

      const sessionUser: SessionUser = {
        id: user.id,
        role: user.app_metadata?.role || 'user',
        email: user.email,
        user_metadata: user.user_metadata,
        app_metadata: user.app_metadata,
      };

      if (sessionToken) {
        sessionCache.set(sessionToken, sessionUser);
      }

      const duration = Date.now() - startTime;
      logger.debug('Supabase auth check', { duration, userId: sessionUser.id });
      return sessionUser;
    } catch (error) {
      logger.error('Authentication check failed:', { error, duration: Date.now() - startTime });
      return null;
    }
  }

  validateAccess(user: SessionUser, config: RouteConfig): { allowed: boolean; reason?: string } {
    if (config.requireVerification && !user.user_metadata?.isVerified) {
      return { allowed: false, reason: 'Email verification required' };
    }

    if (config.allowedRoles && !config.allowedRoles.includes(user.role)) {
      return { allowed: false, reason: 'Insufficient permissions' };
    }

    if (config.subscriptionTier) {
      const userTier = user.user_metadata?.subscription_tier || 'free';
      if (!config.subscriptionTier.includes(userTier)) {
        return { allowed: false, reason: 'Subscription upgrade required' };
      }
    }

    if (config.featureFlag && env[config.featureFlag] !== 'true') {
      return { allowed: false, reason: 'Feature not enabled' };
    }

    return { allowed: true };
  }
}

class SecurityHeadersManager {
  static addSecurityHeaders(response: NextResponse, nonce: string): NextResponse {
    const isDev = env.NODE_ENV === 'development';
    
    // 🔧 PRODUCTION-SAFE CSP: Environment-specific trusted sources с enhanced security
    const trustedScriptSources = isDev
      ? [
          'https://vercel.live', 
          'https://www.google.com', 
          'https://www.gstatic.com', 
          'https://js.stripe.com', 
          'https://cdn.jsdelivr.net'
        ]
      : [
          'https://www.google.com', 
          'https://www.gstatic.com', 
          'https://js.stripe.com'
        ]; // Production: более строгий whitelist
    
    const csp = [
      "default-src 'self'",
      // Script sources с nonce-based security
      `script-src 'self' 'nonce-${nonce}' ${trustedScriptSources.join(' ')}`,
      // Style sources с nonce поддержкой
      `style-src 'self' 'nonce-${nonce}' 'unsafe-inline' https://fonts.googleapis.com`,
      // Font sources
      "font-src 'self' https://fonts.gstatic.com https://cdn.jsdelivr.net",
      // Image sources - comprehensive но secure
      "img-src 'self' data: blob: https://*.vercel.app https://feliona.ai https://feliona.app https://utfs.io https://res.cloudinary.com https://s3.amazonaws.com https://images.unsplash.com https://cdn.amazonaws.com",
      // Media sources для VRM/3D models
      "media-src 'self' https: data: blob:",
      // Connect sources - API endpoints
      `connect-src 'self' https: wss: data: ${isDev ? 'ws://localhost:*' : ''} https://api.openai.com https://api.anthropic.com https://*.vercel.app https://feliona.ai https://feliona.app https://utfs.io`,
      // Worker sources
      "worker-src 'self' blob:",
      // Child sources
      "child-src 'self' blob:",
      // Frame sources - только trusted providers
      "frame-src 'self' https://js.stripe.com https://www.google.com",
      // Security policies
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'none'",
      ...(env.NODE_ENV === 'production' ? ["upgrade-insecure-requests"] : []),
    ].join('; ');

    response.headers.set('Content-Security-Policy', csp);
    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('X-XSS-Protection', '1; mode=block');
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), payment=()');
    response.headers.set('X-DNS-Prefetch-Control', 'off');
    response.headers.set('X-Download-Options', 'noopen');
    response.headers.set('X-Permitted-Cross-Domain-Policies', 'none');

    if (env.NODE_ENV === 'production') {
      response.headers.set(
        'Strict-Transport-Security',
        'max-age=31536000; includeSubDomains; preload'
      );
    }

    response.headers.set('x-nonce', nonce);
    
    // 🔧 ENHANCED MONITORING: Add configuration health indicators
    response.headers.set('x-cors-status', corsValidation.isValid ? 'valid' : 'fallback');
    
    return response;
  }
}

class MetricsCollector {
  static collectSecurityMetrics(
    requestId: string,
    request: NextRequest,
    user?: SessionUser,
    blocked = false,
    reason?: string
  ): SecurityMetrics {
    const consent = request.cookies.get('cookie-consent')?.value === 'true';
    return {
      requestId,
      timestamp: Date.now(),
      ip: env.GDPR_ENABLED === 'true' && !consent ? 'anonymized' : getClientIP(request),
      userAgent:
        env.GDPR_ENABLED === 'true' && !consent
          ? 'anonymized'
          : request.headers.get('user-agent')?.substring(0, 200) || 'unknown',
      path: request.nextUrl.pathname,
      method: request.method,
      userId: user?.id,
      blocked,
      reason,
    };
  }

  static async logMetrics(metrics: SecurityMetrics): Promise<void> {
    if (env.GDPR_ENABLED === 'true') {
      const safeMetrics = {
        requestId: metrics.requestId,
        timestamp: metrics.timestamp,
        path: metrics.path,
        method: metrics.method,
        userId: metrics.userId,
        blocked: metrics.blocked,
        reason: metrics.reason,
      };
      logger.info(safeMetrics, 'Request processed');
    } else {
      logger.info(metrics, 'Request processed');
    }

    if (env.NODE_ENV === 'production') {
      try {
        track('middleware_request', {
          path: metrics.path,
          method: metrics.method,
          blocked: metrics.blocked ?? false,
          reason: metrics.reason ?? '',
        });
      } catch (error) {
        logger.warn('Failed to send metrics:', error);
      }
    }
  }
}

// =====================================================
// MAIN MIDDLEWARE
// =====================================================

export async function middleware(request: NextRequest) {
  const startTime = Date.now();
  const requestId = generateRequestId();
  const { pathname } = request.nextUrl;
  const nonce = generateUUID();

  const rateLimiter = new RateLimiter();
  const authService = new AuthenticationService();

  let response = NextResponse.next();
  let user: SessionUser | undefined = undefined;
  let blocked = false;
  let blockReason: string | undefined;

  try {
    response.headers.set('x-request-id', requestId);

    // 🔧 ENHANCED CORS: Handle preflight с improved validation
    if (request.method === 'OPTIONS') {
      const origin = request.headers.get('origin');
      if (origin && isAllowedOrigin(origin)) {
        const optionsResponse = new NextResponse(null, { status: 200 });
        handleCorsHeaders(optionsResponse, origin);
        optionsResponse.headers.set('Access-Control-Max-Age', '86400'); // 24 hours
        optionsResponse.headers.set('x-cors-validation', 'passed');
        logger.debug('CORS preflight handled', { origin, path: pathname });
        return optionsResponse;
      } else {
        logger.warn('CORS preflight rejected', { 
          origin, 
          path: pathname,
          allowedOrigins: ALLOWED_ORIGINS.slice(0, 3) // Log first 3 for security
        });
        return new NextResponse(null, { status: 403 });
      }
    }

    // 🔧 CORS HEADERS для всех requests
    const origin = request.headers.get('origin');
    handleCorsHeaders(response, origin);

    if (isPublicRoute(pathname, PUBLIC_ROUTES)) {
      response.headers.set('Cache-Control', CACHE_CONFIG.PUBLIC_ROUTE_HEADERS);
      return SecurityHeadersManager.addSecurityHeaders(response, nonce);
    }

    // CSRF validation для state-changing requests
    if (['POST', 'PUT', 'DELETE'].includes(request.method)) {
      const csrfToken = request.headers.get('x-csrf-token');
      if (!csrfToken || !AuthenticationService.validateCsrfToken(request, csrfToken)) {
        blocked = true;
        blockReason = 'Invalid CSRF token';
        return new NextResponse(
          JSON.stringify({ error: 'Invalid CSRF token' }),
          { status: 403, headers: { 'Content-Type': 'application/json' } }
        );
      }
    }

    // Rate limiting для API routes
    if (pathname.startsWith('/api/')) {
      const rateLimitConfig = RATE_LIMITED_ROUTES[pathname];
      if (rateLimitConfig) {
        const { allowed, remaining, resetTime } = await rateLimiter.checkLimit(
          request,
          rateLimitConfig,
          user
        );

        response.headers.set('X-RateLimit-Limit', rateLimitConfig.maxRequests.toString());
        response.headers.set('X-RateLimit-Remaining', remaining.toString());
        response.headers.set('X-RateLimit-Reset', Math.ceil(resetTime / 1000).toString());

        if (!allowed) {
          blocked = true;
          blockReason = 'Rate limit exceeded';
          return new NextResponse(
            JSON.stringify({
              error: 'Too Many Requests',
              message: 'Rate limit exceeded. Please try again later.',
              retryAfter: Math.ceil((resetTime - Date.now()) / 1000),
            }),
            {
              status: 429,
              headers: {
                'Content-Type': 'application/json',
                'Retry-After': Math.ceil((resetTime - Date.now()) / 1000).toString(),
              },
            }
          );
        }
      }
    }

    // Locale handling
    const locale = getLocale(request);
    if (!(SUPPORTED_LOCALES as readonly string[]).includes(locale)) {
      const redirectUrl = new URL(request.url);
      redirectUrl.pathname = `/${DEFAULT_LOCALE}${pathname}`;
      return NextResponse.redirect(redirectUrl);
    }
    if (!request.cookies.get(LOCALIZATION_CONFIG.COOKIE_CONFIG.NAME)?.value) {
      response.cookies.set(LOCALIZATION_CONFIG.COOKIE_CONFIG.NAME, locale, {
        maxAge: LOCALIZATION_CONFIG.COOKIE_CONFIG.MAX_AGE,
        httpOnly: LOCALIZATION_CONFIG.COOKIE_CONFIG.HTTP_ONLY,
        secure: env.NODE_ENV === 'production',
        sameSite: LOCALIZATION_CONFIG.COOKIE_CONFIG.SAME_SITE,
        path: LOCALIZATION_CONFIG.COOKIE_CONFIG.PATH,
      });
    }
    response.headers.set('x-locale', locale);

    // Authentication & authorization
    const routeConfig = getRouteConfig(pathname);
    if (routeConfig && routeConfig.type !== RouteType.PUBLIC) {
      user = (await authService.getUser(request, response)) ?? undefined;

      if (!user) {
        blocked = true;
        blockReason = 'Authentication required';
        const loginUrl = new URL('/login', request.url);
        loginUrl.searchParams.set('callbackUrl', pathname);
        return NextResponse.redirect(loginUrl);
      }

      const { allowed, reason } = authService.validateAccess(user, routeConfig);
      if (!allowed) {
        blocked = true;
        blockReason = reason;

        if (reason === 'Email verification required') {
          const verifyUrl = new URL('/verify', request.url);
          verifyUrl.searchParams.set('callbackUrl', pathname);
          return NextResponse.redirect(verifyUrl);
        }

        if (reason === 'Subscription upgrade required') {
          const pricingUrl = new URL('/pricing', request.url);
          pricingUrl.searchParams.set('upgrade', 'true');
          pricingUrl.searchParams.set('callbackUrl', pathname);
          return NextResponse.redirect(pricingUrl);
        }

        return new NextResponse(
          JSON.stringify({
            error: 'Access Denied',
            message: reason,
          }),
          {
            status: 403,
            headers: { 'Content-Type': 'application/json' },
          }
        );
      }

      // Set user context headers
      if (user) {
        const csrfToken = AuthenticationService.generateCsrfToken();
        response.cookies.set('csrf-token', csrfToken, {
          httpOnly: true,
          secure: env.NODE_ENV === 'production',
          sameSite: 'strict',
          path: '/',
        });
        response.headers.set('x-csrf-token', csrfToken);
        response.headers.set('x-user-id', user.id);
        response.headers.set('x-user-role', user.role);
        response.headers.set('x-user-verified', user.user_metadata?.isVerified ? 'true' : 'false');
        response.headers.set('x-subscription-tier', user.user_metadata?.subscription_tier || 'free');
      }
    }

    // Redirect authenticated users away from auth pages
    if ((pathname === '/login' || pathname === '/register') && user) {
      const callbackUrl = request.nextUrl.searchParams.get('callbackUrl') || '/dashboard';
      return NextResponse.redirect(new URL(callbackUrl, request.url));
    }

    response = SecurityHeadersManager.addSecurityHeaders(response, nonce);
    return response;
  } catch (error) {
    logger.error('Middleware error:', { error, requestId, pathname });
    blocked = true;
    blockReason = 'Internal error';

    return new NextResponse('Internal Server Error', { status: 500 });
  } finally {
    const processingTime = Date.now() - startTime;
    const securityMetrics = MetricsCollector.collectSecurityMetrics(
      requestId,
      request,
      user,
      blocked,
      blockReason
    );

    MetricsCollector.logMetrics(securityMetrics).catch(error =>
      logger.warn('Failed to log metrics:', error)
    );

    if (env.NODE_ENV === 'production') {
      response.headers.set('x-processing-time', processingTime.toString());

      if (processingTime > 1000) {
        logger.warn('Slow middleware processing', {
          requestId,
          pathname,
          processingTime,
        });
      }
    }
  }
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|manifest.json|sw.js|workbox-|public/|icons/|images/|models/|audio/).*)',
  ],
};