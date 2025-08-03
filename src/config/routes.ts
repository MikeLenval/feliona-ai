/**
 * ============================================
 * Routes Configuration
 * 🛣️ Application routes and rate limiting setup
 * ============================================
 */

import type { RouteConfig, RateLimitConfig } from '../types/platform/auth';
import { RouteType } from '../types/platform/auth';

// =====================================================
// ROUTE CONFIGURATION
// =====================================================

export const ROUTE_CONFIG: Record<string, RouteConfig> = {
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
} as const;

// =====================================================
// PUBLIC ROUTES
// =====================================================

export const PUBLIC_ROUTES = new Set([
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
  // Localized public routes
  '/en',
  '/ru',
  '/es',
  '/fr',
  '/de',
] as const);

// =====================================================
// RATE LIMITED ROUTES
// =====================================================

export const RATE_LIMITED_ROUTES: Record<string, RateLimitConfig> = {
  '/api/ai/completion': {
    windowMs: 60000, // 1 minute
    maxRequests: 30,
    burstLimit: 5,
    skipForRoles: ['premium', 'enterprise'],
  },
  '/api/ai/advanced': {
    windowMs: 60000, // 1 minute
    maxRequests: 10,
    skipForRoles: ['enterprise'],
  },
  '/api/chat/messages': {
    windowMs: 60000, // 1 minute
    maxRequests: 100,
    burstLimit: 20,
  },
  '/api/auth/register': {
    windowMs: 900000, // 15 minutes
    maxRequests: 5,
    requireRecaptcha: true,
  },
  '/api/auth/login': {
    windowMs: 300000, // 5 minutes
    maxRequests: 10,
    requireRecaptcha: true,
  },
  '/api/upload': {
    windowMs: 60000, // 1 minute
    maxRequests: 20,
    skipForRoles: ['premium', 'enterprise'],
  },
} as const;

// =====================================================
// STATIC FILE PREFIXES
// =====================================================

export const STATIC_FILE_PREFIXES = [
  '/api/public/',
  '/_next/',
  '/favicon',
  '/robots',
  '/sitemap',
] as const;

// =====================================================
// LOCALIZED ROUTE PATTERNS
// =====================================================

export function getLocalizedPublicPaths(locale: string): string[] {
  return [
    `/${locale}/discover`,
    `/${locale}/about`, 
    `/${locale}/contact`,
    `/${locale}/privacy`,
    `/${locale}/terms`,
    `/${locale}/pricing`,
  ];
}
