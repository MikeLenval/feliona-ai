/**
 * ============================================
 * Pricing Analytics Utilities
 * 💰 Analytics tracking для PricingSection
 * ============================================
 */

import type { PlanType } from '@/types';

// === ANALYTICS TRACKING ===

/**
 * Track pricing-related events
 */
export function trackPricingEvent(
  eventName: string,
  category: string,
  planId?: PlanType,
  additionalData?: Record<string, unknown>
): void {
  if (typeof window === 'undefined') return;
  
  try {
    // Google Analytics 4
    if (window.gtag && typeof window.gtag === 'function') {
      const analyticsParams: Record<string, string | number | boolean> = {
        event_category: category,
        ...additionalData
      };
      
      if (planId) {
        analyticsParams.plan_id = planId;
        analyticsParams.event_label = `plan_${planId}`;
      }
      
      window.gtag('event', eventName, analyticsParams);
    }

    // Console log для разработки
    if (process.env.NODE_ENV === 'development') {
      console.log('Pricing Analytics:', {
        event: eventName,
        category,
        planId,
        ...additionalData
      });
    }
  } catch (error) {
    console.warn('Pricing analytics tracking failed:', error);
  }
}

/**
 * Track plan card interactions
 */
export function trackPlanCardHover(planId: PlanType): void {
  trackPricingEvent('plan_card_hover', 'pricing_interaction', planId);
}

export function trackPlanCardClick(planId: PlanType): void {
  trackPricingEvent('plan_card_click', 'pricing_interaction', planId);
}

export function trackPlanSelection(planId: PlanType): void {
  trackPricingEvent('plan_selected', 'pricing_conversion', planId);
}

/**
 * Track pricing section interactions
 */
export function trackPricingSectionView(): void {
  trackPricingEvent('pricing_section_view', 'pricing_engagement');
}

export function trackPricingSectionScroll(): void {
  trackPricingEvent('pricing_section_scroll', 'pricing_engagement');
}

/**
 * Track feature interactions
 */
export function trackFeatureClick(planId: PlanType, featureName: string): void {
  trackPricingEvent('feature_click', 'pricing_interaction', planId, {
    feature_name: featureName
  });
}

/**
 * Track conversion funnel
 */
export function trackPricingFunnelStep(step: string, planId?: PlanType): void {
  trackPricingEvent('pricing_funnel', 'conversion_funnel', planId, {
    funnel_step: step
  });
}

// === ANALYTICS DATA HELPERS ===

/**
 * Get plan analytics metadata
 */
export function getPlanAnalyticsData(planId: PlanType) {
  return {
    plan_id: planId,
    plan_type: planId,
    is_premium: planId !== 'free',
    is_adult: ['intimate', 'enterprise'].includes(planId),
    conversion_tier: {
      free: 1,
      premium: 2,
      intimate: 3,
      enterprise: 4
    }[planId] || 1
  };
}
