/**
 * ============================================
 * Environment Validation
 * 🌍 Environment configuration and validation
 * ============================================
 */

import { z } from 'zod';

// =====================================================
// ENVIRONMENT SCHEMA
// =====================================================

export const envSchema = z.object({
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
  // CORS Configuration
  CORS_ALLOWED_ORIGINS: z.string().default('https://feliona.ai,https://feliona.app'),
  // Cache Configuration  
  CACHE_TTL_MULTIPLIER: z.coerce.number().min(1).max(3).default(1.5),
  RATE_LIMIT_CACHE_SIZE: z.coerce.number().min(1000).max(10000).default(3000),
  RATE_LIMIT_MAX_TTL: z.coerce.number().default(1800000), // 30 min max TTL
});

// =====================================================
// ENVIRONMENT VALIDATION
// =====================================================

export function validateEnvironment() {
  try {
    return envSchema.parse(process.env);
  } catch (error) {
    console.error('Environment validation failed:', error);
    throw new Error('Invalid environment configuration');
  }
}

// =====================================================
// ENVIRONMENT TYPE
// =====================================================

export type Environment = z.infer<typeof envSchema>;
