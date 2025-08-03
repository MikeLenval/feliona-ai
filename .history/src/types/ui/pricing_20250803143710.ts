/**
 * ============================================
 * Pricing Types
 * 💰 Pricing and subscription types
 * ============================================
 */

// === PLAN TYPES ===
export type PlanType = 'free' | 'premium' | 'enterprise';

// === SUBSCRIPTION ===
export interface Subscription {
  readonly id: string;
  readonly userId: string;
  readonly planType: PlanType;
  readonly status: 'active' | 'cancelled' | 'expired';
  readonly currentPeriodStart: Date;
  readonly currentPeriodEnd: Date;
  readonly cancelAtPeriodEnd: boolean;
}

// === PRICING PLAN ===
export interface PricingPlan {
  readonly id: string;
  readonly type: PlanType;
  readonly name: string;
  readonly description: string;
  readonly price: number;
  readonly currency: string;
  readonly interval: 'month' | 'year';
  readonly features: readonly string[];
  readonly popular?: boolean;
}

// === USAGE LIMITS ===
export interface UsageLimits {
  readonly messagesPerDay: number;
  readonly companionsLimit: number;
  readonly memoryRetention: 'session' | 'limited' | 'extended';
  readonly advancedFeatures: boolean;
}
