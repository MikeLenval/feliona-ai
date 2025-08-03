/**
 * ============================================
 * Security Configuration Constants
 * 🛡️ Centralized security configuration
 * ============================================
 */

// =====================================================
// SECURITY CONSTANTS
// =====================================================

export const SECURITY_CONSTANTS = {
  // Rate Limiting
  RATE_LIMIT_CACHE_SIZE: 3000,
  RATE_LIMIT_MAX_TTL: 1800000, // 30 min
  CACHE_TTL_MULTIPLIER: 1.5,
  
  // Session Management
  SESSION_CACHE_TTL: 300000, // 5 min
  SESSION_CACHE_SIZE: 1000,
  CSRF_TOKEN_LENGTH: 32,
  
  // reCAPTCHA
  RECAPTCHA_SCORE_THRESHOLD: 0.5,
  RECAPTCHA_CACHE_MAX: 1000,
  RECAPTCHA_CACHE_TTL: 300000, // 5 min
  
  // Performance Monitoring
  SLOW_PROCESSING_THRESHOLD: 1000, // 1 second
  USER_AGENT_MAX_LENGTH: 200,
  
  // Cache TTL Calculation
  MIN_CACHE_TTL: 60000, // 1 minute minimum
  
  // Request ID
  REQUEST_ID_LENGTH: 16,
} as const;

// =====================================================
// SECURITY HEADERS
// =====================================================

export const SECURITY_HEADERS = {
  CORS_MAX_AGE: '86400', // 24 hours
  HSTS_MAX_AGE: 'max-age=31536000; includeSubDomains; preload',
  PERMISSIONS_POLICY: 'camera=(), microphone=(), geolocation=(), payment=()',
  REFERRER_POLICY: 'strict-origin-when-cross-origin',
  X_FRAME_OPTIONS: 'DENY',
  X_CONTENT_TYPE_OPTIONS: 'nosniff',
  X_XSS_PROTECTION: '1; mode=block',
  X_DNS_PREFETCH_CONTROL: 'off',
  X_DOWNLOAD_OPTIONS: 'noopen',
  X_PERMITTED_CROSS_DOMAIN_POLICIES: 'none',
} as const;

// =====================================================
// EXTERNAL API URLS
// =====================================================

export const EXTERNAL_APIS = {
  RECAPTCHA_VERIFY_URL: 'https://www.google.com/recaptcha/api/siteverify',
} as const;

// =====================================================
// CACHE CONFIGURATION
// =====================================================

export const CACHE_CONFIG = {
  PUBLIC_ROUTE_HEADERS: 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400',
} as const;
