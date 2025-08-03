/**
 * ============================================
 * Shared Analytics Utilities
 * 🎯 Centralized analytics functions and configurations
 * ============================================
 */

// Re-export main analytics functions for shared usage
export {
  configureGA4,
  trackEvent,
  trackPageView,
  trackNavigation,
  trackCompanions,
  trackChat,
  trackUserExperience
} from '@/lib/analytics';

// Additional shared analytics utilities can be added here
export * from '@/lib/analytics';
