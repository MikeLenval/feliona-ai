/**
 * ============================================
 * Content Security Policy Configuration
 * 🔒 CSP and CORS configuration
 * ============================================
 */

// =====================================================
// CSP CONFIGURATION
// =====================================================

export const CSP_CONFIG = {
  TRUSTED_SCRIPT_SOURCES: {
    development: [
      'https://vercel.live',
      'https://www.google.com',
      'https://www.gstatic.com',
      'https://js.stripe.com',
      'https://cdn.jsdelivr.net'
    ],
    production: [
      'https://www.google.com',
      'https://www.gstatic.com',
      'https://js.stripe.com'
    ]
  },
  
  TRUSTED_DOMAINS: {
    fonts: [
      'https://fonts.googleapis.com',
      'https://fonts.gstatic.com',
      'https://cdn.jsdelivr.net'
    ],
    
    images: [
      'https://*.vercel.app',
      'https://feliona.ai',
      'https://feliona.app',
      'https://utfs.io',
      'https://res.cloudinary.com',
      'https://s3.amazonaws.com',
      'https://images.unsplash.com',
      'https://cdn.amazonaws.com'
    ],
    
    api: [
      'https://api.openai.com',
      'https://api.anthropic.com',
      'https://*.vercel.app',
      'https://feliona.ai',
      'https://feliona.app',
      'https://utfs.io'
    ],
    
    frames: [
      'https://js.stripe.com',
      'https://www.google.com'
    ]
  },
  
  BASE_POLICIES: [
    "default-src 'self'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
  ],
  
  CONDITIONAL_POLICIES: {
    production: ["upgrade-insecure-requests"]
  }
} as const;

// =====================================================
// CORS CONFIGURATION
// =====================================================

export const CORS_CONFIG = {
  DEFAULT_ORIGINS: {
    development: ['http://localhost:3000', 'https://feliona.ai'],
    production: ['https://feliona.ai', 'https://feliona.app']
  },
  
  ALLOWED_METHODS: 'GET, POST, PUT, DELETE, OPTIONS',
  ALLOWED_HEADERS: 'Content-Type, Authorization, X-CSRF-Token',
  MAX_AGE: '86400', // 24 hours
  
  EMERGENCY_FALLBACK: ['https://feliona.ai']
} as const;
