/**
 * ============================================
 * Authentication & Authorization Types
 * 🔐 Platform authentication and security types
 * ============================================
 */

// =====================================================
// USER & SESSION TYPES
// =====================================================

export interface SessionUser {
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

export interface CachedSession {
  user: SessionUser;
  expiresAt: number;
  lastVerified: number;
}

// =====================================================
// ROUTE CONFIGURATION TYPES
// =====================================================

export enum RouteType {
  PUBLIC = 'public',
  PROTECTED = 'protected',
  ADMIN = 'admin',
  CREATOR = 'creator',
}

export interface RouteConfig {
  type: RouteType;
  requireVerification?: boolean;
  allowedRoles?: string[];
  featureFlag?: string;
  subscriptionTier?: ('free' | 'premium' | 'enterprise')[];
}

export interface RoutePattern {
  regexp: RegExp;
  config: RouteConfig;
  originalPath: string;
}

// =====================================================
// RATE LIMITING TYPES
// =====================================================

export interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
  requireRecaptcha?: boolean;
  skipForRoles?: string[];
  burstLimit?: number;
}

// =====================================================
// SECURITY & MONITORING TYPES
// =====================================================

export interface SecurityMetrics {
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

export interface CorsValidationResult {
  isValid: boolean;
  validOrigins: string[];
  errors: string[];
  fallbackUsed: boolean;
}

// =====================================================
// SUBSCRIPTION TIER TYPE
// =====================================================

export type SubscriptionTier = 'free' | 'premium' | 'enterprise';

// =====================================================
// ACCESS VALIDATION RESULT
// =====================================================

export interface AccessValidationResult {
  allowed: boolean;
  reason?: string;
}
