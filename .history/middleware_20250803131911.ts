import { NextRequest, NextResponse } from 'next/server';
import type { ResponseCookie } from 'next/dist/compiled/@edge-runtime/cookies';
import { createServerClient } from '@supabase/ssr';
import { Redis } from '@upstash/redis';
import { z } from 'zod';
import pino from 'pino';
import { LRUCache } from 'lru-cache';
import { track } from '@vercel/analytics';
import { pathToRegexp } from 'path-to-regexp';

// Edge Runtime compatible UUID generator
function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

// =====================================================
// ENVIRONMENT VALIDATION
// =====================================================

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  SUPABASE_URL: z.string().url(),
  SUPABASE_ANON_KEY: z.string(),
  UPSTASH_REDIS_REST_URL: z.string().url().optional(),
  UPSTASH_REDIS_REST_TOKEN: z.string().optional(),
  RECAPTCHA_SECRET_KEY: z.string().optional(),
  RECAPTCHA_SCORE_THRESHOLD: z.coerce.number().min(0).max(1).default(0.5),
  NEXT_PUBLIC_SUPPORTED_LOCALES: z.string().default('en,ru'),
  NEXT_PUBLIC_DEFAULT_LOCALE: z.string().default('en'),
  DEBUG_LOGGING: z.enum(['true', 'false']).default('false'),
  GDPR_ENABLED: z.enum(['true', 'false']).default('true'),
  SESSION_CACHE_TTL: z.coerce.number().default(300000),
  SESSION_CACHE_SIZE: z.coerce.number().default(1000),
  CSRF_TOKEN_LENGTH: z.coerce.number().default(32),
  FEATURE_CREATOR_ECONOMY: z.enum(['true', 'false']).default('false'),
  FEATURE_XR_SUPPORT: z.enum(['true', 'false']).default('false'),
  FEATURE_ADVANCED_AI: z.enum(['true', 'false']).default('false'),
});

const env = envSchema.parse(process.env);

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
// TYPES AND INTERFACES
// =====================================================

interface SessionUser {
  id: string;
  role: string;
  email?: string | undefined;
  user_metadata?: {
    isVerified?: boolean;
    subscription_tier?: 'free' | 'premium' | 'enterprise';
  };
  app_metadata?: {
    provider?: string;
    providers?: string[];
  };
}

interface CachedSession {
  user: SessionUser;
  expiresAt: number;
  lastVerified: number;
}

enum RouteType {
  PUBLIC = 'public',
  PROTECTED = 'protected',
  ADMIN = 'admin',
  CREATOR = 'creator',
}

interface RouteConfig {
  type: RouteType;
  requireVerification?: boolean;
  allowedRoles?: string[];
  featureFlag?: keyof typeof env;
  subscriptionTier?: ('free' | 'premium' | 'enterprise')[];
}

interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
  requireRecaptcha?: boolean;
  skipForRoles?: string[];
  burstLimit?: number;
}

interface SecurityMetrics {
  requestId: string;
  timestamp: number;
  ip: string;
  userAgent: string;
  path: string;
  method: string;
  userId: string | undefined;
  blocked?: boolean;
  reason?: string | undefined;
}

// =====================================================
// CONFIGURATION
// =====================================================

const ROUTE_CONFIG: Record<string, RouteConfig> = {
  '/dashboard': { type: RouteType.PROTECTED },
  '/chats': { type: RouteType.PROTECTED },
  '/profile': { type: RouteType.PROTECTED },
  '/create': { type: RouteType.PROTECTED },
  '/creator': {
    type: RouteType.CREATOR,
    requireVerification: true,
    featureFlag: 'FEATURE_CREATOR_ECONOMY',
    subscriptionTier: ['premium', 'enterprise'],
  },
  '/admin': {
    type: RouteType.ADMIN,
    allowedRoles: ['admin', 'moderator'],
  },
  '/xr': {
    type: RouteType.PROTECTED,
    featureFlag: 'FEATURE_XR_SUPPORT',
    subscriptionTier: ['premium', 'enterprise'],
  },
  '/ai/advanced': {
    type: RouteType.PROTECTED,
    featureFlag: 'FEATURE_ADVANCED_AI',
    subscriptionTier: ['enterprise'],
  },
};

// Добавьте интерфейс для лучшей типизации
interface RoutePattern {
  regexp: RegExp;
  config: RouteConfig;
  originalPath: string;
}

const ROUTE_PATTERNS: RoutePattern[] = Object.entries(ROUTE_CONFIG).map(([path, config]) => {
  const { regexp } = pathToRegexp(path);
  return { regexp, config, originalPath: path };
});

const PUBLIC_ROUTES = new Set([
  '/',
  '/discover',
  '/about',
  '/contact',
  '/privacy',
  '/terms',
  '/login',
  '/register',
  '/verify',
  '/pricing',
  '/api/health',
  '/api/webhooks/stripe',
]);

const RATE_LIMITED_ROUTES: Record<string, RateLimitConfig> = {
  '/api/ai/completion': {
    windowMs: 60000,
    maxRequests: 30,
    burstLimit: 5,
    skipForRoles: ['premium', 'enterprise'],
  },
  '/api/ai/advanced': {
    windowMs: 60000,
    maxRequests: 10,
    skipForRoles: ['enterprise'],
  },
  '/api/chat/messages': {
    windowMs: 60000,
    maxRequests: 100,
    burstLimit: 20,
  },
  '/api/auth/register': {
    windowMs: 900000,
    maxRequests: 5,
    requireRecaptcha: true,
  },
  '/api/auth/login': {
    windowMs: 300000,
    maxRequests: 10,
    requireRecaptcha: true,
  },
  '/api/upload': {
    windowMs: 60000,
    maxRequests: 20,
    skipForRoles: ['premium', 'enterprise'],
  },
};

const SUPPORTED_LOCALES = env.NEXT_PUBLIC_SUPPORTED_LOCALES.split(',');
const DEFAULT_LOCALE = env.NEXT_PUBLIC_DEFAULT_LOCALE;

// =====================================================
// CACHING LAYER
// =====================================================

class SessionCache {
  private cache = new LRUCache<string, CachedSession>({
    max: env.SESSION_CACHE_SIZE,
    ttl: env.SESSION_CACHE_TTL,
  });

  set(sessionToken: string, user: SessionUser): void {
    const expiresAt = Date.now() + env.SESSION_CACHE_TTL;
    this.cache.set(sessionToken, {
      user,
      expiresAt,
      lastVerified: Date.now(),
    });
  }

  get(sessionToken: string): SessionUser | null {
    const cached = this.cache.get(sessionToken);
    if (!cached || Date.now() > cached.expiresAt) {
      this.cache.delete(sessionToken);
      return null;
    }
    return cached.user;
  }

  invalidate(sessionToken: string): void {
    this.cache.delete(sessionToken);
  }

  clear(): void {
    this.cache.clear();
  }
}

const sessionCache = new SessionCache();

// =====================================================
// UTILITY FUNCTIONS
// =====================================================

function getClientIP(request: NextRequest): string {
  const cfConnectingIP = request.headers.get('cf-connecting-ip');
  if (cfConnectingIP) return cfConnectingIP;

  const xForwardedFor = request.headers.get('x-forwarded-for');
  if (typeof xForwardedFor === 'string' && xForwardedFor !== undefined && xForwardedFor) {
    return xForwardedFor?.split(',')[0]?.trim() ?? 'unknown';
  }

  const xRealIP = request.headers.get('x-real-ip');
  if (xRealIP) return xRealIP;

  return 'unknown';
}

function getLocale(request: NextRequest): string {
  const cookieLocale = request.cookies.get('NEXT_LOCALE')?.value;
  if (cookieLocale && SUPPORTED_LOCALES.includes(cookieLocale)) {
    return cookieLocale;
  }

  const acceptLanguage = request.headers.get('accept-language');
  if (acceptLanguage) {
    const matchedLocale = SUPPORTED_LOCALES.find(locale =>
      acceptLanguage.toLowerCase().includes(locale.toLowerCase())
    );
    if (matchedLocale) return matchedLocale;
  }

  return DEFAULT_LOCALE;
}

function getRouteConfig(pathname: string): RouteConfig | null {
  // Сначала проверяем точные совпадения
  if (ROUTE_CONFIG[pathname]) {
    return ROUTE_CONFIG[pathname];
  }

  // Затем проверяем паттерны
  for (const { regexp, config } of ROUTE_PATTERNS) {
    if (regexp.test(pathname)) { // Теперь regexp действительно RegExp
      return config;
    }
  }
  return null;
}

function isPublicRoute(pathname: string): boolean {
  if (PUBLIC_ROUTES.has(pathname)) return true;

  const publicPrefixes = ['/api/public/', '/_next/', '/favicon', '/robots', '/sitemap'];
  return publicPrefixes.some(prefix => pathname.startsWith(prefix));
}

function generateRequestId(): string {
  return generateUUID().replace(/-/g, '').substring(0, 16);
}

// =====================================================
// SECURITY MODULES
// =====================================================

class RecaptchaValidator {
  private static readonly VERIFY_URL = 'https://www.google.com/recaptcha/api/siteverify';
  private static cache = new LRUCache<string, boolean>({ max: 1000, ttl: 300000 });

  static async verify(token: string, ip: string): Promise<boolean> {
    if (!env.RECAPTCHA_SECRET_KEY) {
      logger.error('RECAPTCHA_SECRET_KEY not configured');
      return false;
    }

    const cacheKey = `${token}:${ip}`;
    const cachedResult = this.cache.get(cacheKey);
    if (cachedResult !== undefined) {
      return cachedResult;
    }

    try {
      const response = await fetch(this.VERIFY_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          secret: env.RECAPTCHA_SECRET_KEY,
          response: token,
          remoteip: ip,
        }),
      });

      if (!response.ok) {
        logger.error(`reCAPTCHA API returned ${response.status}`);
        this.cache.set(cacheKey, false);
        return false;
      }

      const data = await response.json();
      const result = data.success && data.score >= env.RECAPTCHA_SCORE_THRESHOLD;
      this.cache.set(cacheKey, result);
      return result;
    } catch (error) {
      logger.error('reCAPTCHA verification failed:', error);
      this.cache.set(cacheKey, false);
      return false;
    }
  }
}

class RateLimiter {
  private redis: Redis | null = null;
  private memoryCache = new LRUCache<string, { count: number; resetTime: number }>({
    max: env.SESSION_CACHE_SIZE,
    ttl: 60000,
  });

  constructor() {
    if (env.UPSTASH_REDIS_REST_URL && env.UPSTASH_REDIS_REST_TOKEN) {
      this.redis = new Redis({
        url: env.UPSTASH_REDIS_REST_URL,
        token: env.UPSTASH_REDIS_REST_TOKEN,
      });
    }
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
      if (!token || !(await RecaptchaValidator.verify(token, ip))) {
        logger.warn(`reCAPTCHA verification failed for ${request.nextUrl.pathname}`, { ip, identifier });
        return { allowed: false, remaining: 0, resetTime: Date.now() + config.windowMs };
      }
    }

    if (!this.redis) {
      const cached = this.memoryCache.get(key) || { count: 0, resetTime: Date.now() + config.windowMs };
      if (cached.count >= config.maxRequests) {
        logger.warn('Rate limit exceeded (memory)', { path: request.nextUrl.pathname, ip, identifier });
        return { allowed: false, remaining: 0, resetTime: cached.resetTime };
      }
      this.memoryCache.set(key, { count: cached.count + 1, resetTime: cached.resetTime });
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
      logger.warn('Rate limit exceeded', {
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
    // 🔒 Улучшенная CSP политика с поддержкой production и development
    const isDev = env.NODE_ENV === 'development';
    
    const csp = [
      "default-src 'self'",
      // Script sources - nonce для безопасности, разрешенные домены
      `script-src 'self' 'nonce-${nonce}' https://vercel.live https://www.google.com https://www.gstatic.com https://js.stripe.com https://cdn.jsdelivr.net`,
      // Style sources - nonce + Google Fonts
      `style-src 'self' 'nonce-${nonce}' 'unsafe-inline' https://fonts.googleapis.com`,
      // Font sources
      "font-src 'self' https://fonts.gstatic.com https://cdn.jsdelivr.net",
      // Image sources - все необходимые CDN
      "img-src 'self' data: blob: https://*.vercel.app https://feliona.ai https://feliona.app https://utfs.io https://res.cloudinary.com https://s3.amazonaws.com https://images.unsplash.com https://cdn.jsdelivr.net https://cdn.statically.io https://cdn.feliona.ai https://cdn.feliona.app https://cdn.vercel.app",
      // Media sources для VRM/3D моделей
      "media-src 'self' https: data: blob:",
      // Connect sources - API endpoints + WebSocket
      `connect-src 'self' https: wss: data: ${isDev ? 'ws://localhost:*' : ''} https://api.openai.com https://api.anthropic.com https://*.vercel.app https://feliona.ai https://feliona.app https://utfs.io`,
      // Worker sources для Web Workers
      "worker-src 'self' blob:",
      // Child sources для embedded content
      "child-src 'self' blob:",
      // Frame sources - Stripe, Google, no others
      "frame-src 'self' https://js.stripe.com https://www.google.com",
      // Strict policies
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
      // Создаем объект без приватных полей
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

    if (isPublicRoute(pathname)) {
      response.headers.set('Cache-Control', 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400');
      return SecurityHeadersManager.addSecurityHeaders(response, nonce);
    }

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

    const locale = getLocale(request);
    if (!SUPPORTED_LOCALES.includes(locale)) {
      const redirectUrl = new URL(request.url);
      redirectUrl.pathname = `/${DEFAULT_LOCALE}${pathname}`;
      return NextResponse.redirect(redirectUrl);
    }
    if (!request.cookies.get('NEXT_LOCALE')?.value) {
      response.cookies.set('NEXT_LOCALE', locale, {
        maxAge: 365 * 24 * 60 * 60,
        httpOnly: false,
        secure: env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
      });
    }
    response.headers.set('x-locale', locale);

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