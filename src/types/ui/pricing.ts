/**
 * ============================================
 * UI Pricing Types
 * 💰 Pricing and subscription types для компонента PricingSection
 * ============================================
 */

// === BASIC PRICING TYPES ===
export type PlanType = 'free' | 'premium' | 'intimate' | 'enterprise';
export type Currency = 'USD' | 'EUR' | 'RUB';
export type BillingPeriod = 'month' | 'year' | 'forever';
export type ButtonVariant = 'primary' | 'secondary' | 'glass' | 'pricing' | 'adult';

// === PRICING STRUCTURES ===

/**
 * План подписки с ценой
 */
export interface PlanPrice {
  readonly amount: number;
  readonly currency: Currency;
  readonly period: BillingPeriod;
}

/**
 * Функция плана
 */
export interface PlanFeature {
  readonly text: string;
  readonly included: boolean;
  readonly highlight: boolean;
  readonly adult: boolean;
}

/**
 * Метаданные плана
 */
export interface PlanMetadata {
  readonly planType: PlanType;
  readonly popular: boolean;
  readonly highlight: boolean;
  readonly adult?: boolean;
  readonly badge?: string;
}

/**
 * Полный план подписки
 */
export interface PricingPlan {
  readonly id: PlanType;
  readonly name: string;
  readonly description: string;
  readonly price: PlanPrice;
  readonly buttonText: string;
  readonly popular: boolean;
  readonly highlight: boolean;
  readonly limitations: readonly string[];
  readonly features: readonly PlanFeature[];
}

// === COMPONENT PROPS ===

/**
 * Props для FeatureItem
 */
export interface FeatureItemProps {
  readonly feature: PlanFeature;
}

/**
 * Props для PricingCard
 */
export interface PricingCardProps {
  readonly plan: PricingPlan;
  readonly isHovered: boolean;
  readonly animationDelay: string;
  readonly onHover: (planId: PlanType | null) => void;
  readonly onSelect: (planId: PlanType) => void;
}

/**
 * Props для PricingSection
 */
export interface PricingSectionProps {
  readonly onPlanSelect?: (planId: PlanType) => void;
  readonly currentPlan?: PlanType;
  readonly className?: string;
}

// === STATE AND UTILITIES ===

/**
 * План с состоянием UI
 */
export interface PlanWithState extends PricingPlan {
  readonly isCurrent: boolean;
  readonly isHovered: boolean;
}

/**
 * Событие аналитики
 */
export interface PricingAnalyticsEvent {
  readonly event: string;
  readonly planId: PlanType;
  readonly category: string;
  readonly additionalData?: Record<string, unknown>;
}

/**
 * Типы событий pricing
 */
export type PricingEventName = 
  | 'plan_card_hover'
  | 'plan_card_click'
  | 'plan_selected'
  | 'pricing_section_view'
  | 'pricing_section_scroll'
  | 'feature_click';

/**
 * Состояние UI для pricing
 */
export interface PricingUIState {
  readonly hoveredPlan: PlanType | null;
  readonly selectedPlan: PlanType | null;
  readonly isLoading: boolean;
  readonly error?: string;
}

/**
 * Селектор планов
 */
export interface PlanSelector {
  readonly planId: PlanType;
  readonly isSelected: boolean;
  readonly onClick: (planId: PlanType) => void;
}

/**
 * Фильтр планов
 */
export interface PlanFilter {
  readonly adultContent: boolean;
  readonly priceRange: [number, number];
  readonly features: readonly string[];
}

/**
 * Компаратор планов
 */
export interface PlanComparator {
  readonly planIds: readonly PlanType[];
  readonly compareBy: 'price' | 'features' | 'popularity';
}

// === LEGACY TYPES (для обратной совместимости) ===

/**
 * @deprecated Используйте PricingPlan
 */
export interface Subscription {
  readonly id: string;
  readonly userId: string;
  readonly planType: PlanType;
  readonly status: 'active' | 'cancelled' | 'expired';
  readonly currentPeriodStart: Date;
  readonly currentPeriodEnd: Date;
  readonly cancelAtPeriodEnd: boolean;
}

/**
 * @deprecated Используйте UsageLimits в других модулях
 */
export interface UsageLimits {
  readonly messagesPerDay: number;
  readonly companionsLimit: number;
  readonly memoryRetention: 'session' | 'limited' | 'extended';
  readonly advancedFeatures: boolean;
}
