/**
 * ============================================
 * Validation Utilities
 * ✅ Common validation functions for middleware
 * ============================================
 */

import { NextRequest } from 'next/server';
import { STATIC_FILE_PREFIXES, getLocalizedPublicPaths } from '../config/routes';
import { LOCALIZATION_CONFIG } from '../config/localization';
import { SECURITY_CONSTANTS } from '../config/security';

// =====================================================
// CORS VALIDATION
// =====================================================

export function validateCorsOrigin(origin: string | null, allowedOrigins: string[]): boolean {
  if (!origin) return false;
  return allowedOrigins.includes(origin);
}

// =====================================================
// ROUTE VALIDATION
// =====================================================

export function isPublicRoute(pathname: string, publicRoutes: Set<string>): boolean {
  if (publicRoutes.has(pathname)) return true;

  // Check static files and system paths
  if (STATIC_FILE_PREFIXES.some(prefix => pathname.startsWith(prefix))) return true;

  // Check localized public routes
  for (const locale of LOCALIZATION_CONFIG.SUPPORTED_LOCALES) {
    if (pathname === `/${locale}`) return true;
    
    const localizedPublicPaths = getLocalizedPublicPaths(locale);
    if (localizedPublicPaths.includes(pathname)) return true;
  }

  return false;
}

// =====================================================
// CACHE TTL CALCULATION
// =====================================================

export function calculateCacheTTL(
  windowMs: number, 
  multiplier: number = SECURITY_CONSTANTS.CACHE_TTL_MULTIPLIER, 
  maxTTL: number = SECURITY_CONSTANTS.RATE_LIMIT_MAX_TTL
): number {
  const calculatedTTL = Math.max(windowMs * multiplier, SECURITY_CONSTANTS.MIN_CACHE_TTL);
  return Math.min(calculatedTTL, maxTTL);
}

// =====================================================
// CLIENT IP EXTRACTION
// =====================================================

export function getClientIP(request: NextRequest): string {
  // Cloudflare
  const cfConnectingIP = request.headers.get('cf-connecting-ip');
  if (cfConnectingIP) return cfConnectingIP;

  // Load balancer / proxy
  const xForwardedFor = request.headers.get('x-forwarded-for');
  if (typeof xForwardedFor === 'string' && xForwardedFor !== undefined && xForwardedFor) {
    return xForwardedFor?.split(',')[0]?.trim() ?? 'unknown';
  }

  // Nginx / other proxies
  const xRealIP = request.headers.get('x-real-ip');
  if (xRealIP) return xRealIP;

  return 'unknown';
}

// =====================================================
// LOCALE DETECTION
// =====================================================

export function getLocale(request: NextRequest): string {
  // Check cookie first
  const cookieLocale = request.cookies.get(LOCALIZATION_CONFIG.COOKIE_CONFIG.NAME)?.value;
  if (cookieLocale && LOCALIZATION_CONFIG.SUPPORTED_LOCALES.includes(cookieLocale as any)) {
    return cookieLocale;
  }

  // Check Accept-Language header
  const acceptLanguage = request.headers.get('accept-language');
  if (acceptLanguage) {
    const matchedLocale = LOCALIZATION_CONFIG.SUPPORTED_LOCALES.find(locale =>
      acceptLanguage.toLowerCase().includes(locale.toLowerCase())
    );
    if (matchedLocale) return matchedLocale;
  }

  return LOCALIZATION_CONFIG.DEFAULT_LOCALE;
}

// =====================================================
// REQUEST ID GENERATION
// =====================================================

export function generateRequestId(): string {
  return generateUUID().replace(/-/g, '').substring(0, SECURITY_CONSTANTS.REQUEST_ID_LENGTH);
}

// =====================================================
// UUID GENERATION (Edge Runtime Compatible)
// =====================================================

export function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}
