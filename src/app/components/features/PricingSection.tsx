/**
 * ============================================
 * Feliona AI - Pricing Section Component
 * 💰 4 тарифных плана с правильными ценами
 * 
 * Путь: src/app/components/features/PricingSection.tsx
 * 
 * REFACTORED v2.0:
 * ✅ Модульная архитектура с разделением типов и констант
 * ✅ Использует централизованную конфигурацию
 * ✅ Типобезопасные аналитические утилиты
 * ✅ Производительные React паттерны
 * ============================================
 */

'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

// Централизованные импорты
import { PRICING_PLANS } from '@/config/pricing';
import { trackPricingEvent } from '@/shared/lib/utils/pricing-analytics';
import type { PlanType } from '@/types';

// Локальные типы для компонента
interface FeatureItemProps {
  feature: typeof PRICING_PLANS[0]['features'][0];
}

interface PricingCardProps {
  plan: typeof PRICING_PLANS[0];
  isHovered: boolean;
  animationDelay: string;
  onHover: (planId: PlanType | null) => void;
  onSelect: (planId: PlanType) => void;
}

interface PricingSectionProps {
  onPlanSelect?: (planId: PlanType) => void;
  currentPlan?: PlanType;
  className?: string;
}

// Feature Item Component
const FeatureItem = React.memo(({ feature }: FeatureItemProps) => {
  const iconClasses = feature.included 
    ? 'text-green-500' 
    : 'text-gray-500';
  
  const textClasses = feature.included
    ? feature.highlight 
      ? 'text-white font-medium' 
      : 'text-gray-300'
    : 'text-gray-500 line-through';

  return (
    <li className="flex gap-3 items-start">
      <svg 
        className={`${iconClasses} flex-shrink-0 mt-0.5`}
        fill="currentColor" 
        height="20" 
        viewBox="0 0 256 256" 
        width="20" 
        aria-hidden="true"
      >
        {feature.included ? (
          <path d="M229.66,77.66l-128,128a8,8,0,0,1-11.32,0l-56-56a8,8,0,0,1,11.32-11.32L96,188.69,218.34,66.34a8,8,0,0,1,11.32,11.32Z" />
        ) : (
          <path d="M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z" />
        )}
      </svg>
      <span className={`text-sm ${textClasses}`}>
        {feature.text}
        {feature.adult && (
          <span className="ml-2 bg-red-600 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
            18+
          </span>
        )}
      </span>
    </li>
  );
});

FeatureItem.displayName = 'FeatureItem';

// Pricing Card Component
const PricingCard = React.memo(({ 
  plan, 
  isHovered, 
  animationDelay, 
  onHover, 
  onSelect 
}: PricingCardProps) => {
  const handleMouseEnter = useCallback(() => {
    onHover(plan.id);
  }, [plan.id, onHover]);

  const handleMouseLeave = useCallback(() => {
    onHover(null);
  }, [onHover]);

  const handleSelect = useCallback(() => {
    trackPricingEvent('plan_select', plan.id, plan.name);
    onSelect(plan.id);
  }, [plan.id, plan.name, onSelect]);

  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleSelect();
    }
  }, [handleSelect]);

  const cardVariant = plan.popular ? 'pricing' : plan.metadata.adult ? 'adult' : 'glass';

  return (
    <Card
      variant={cardVariant}
      className={`pricing-card ${isHovered ? 'hovered' : ''} ${plan.popular ? 'popular' : ''} ${plan.metadata.adult ? 'adult-pricing-plan' : ''}`}
      style={{ animationDelay }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      aria-label={`${plan.name} plan - ${plan.price.amount === 0 ? 'Free' : `$${plan.price.amount} per ${plan.price.period}`}`}
    >
      {/* Popular Badge */}
      {plan.badge && (
        <div className="pricing-plan-badge">
          {plan.badge}
        </div>
      )}

      {/* Plan Header */}
      <div className="pricing-plan-header">
        <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
        
        {/* Price */}
        <div className="pricing-price-container">
          {plan.price.amount === 0 ? (
            <>
              <span className="text-4xl font-extrabold tracking-tight text-white">Free</span>
              <span className="text-sm font-medium text-gray-400 ml-2">{plan.price.period}</span>
            </>
          ) : (
            <>
              <span className="text-4xl font-extrabold tracking-tight text-white">
                ${plan.price.amount}
              </span>
              <span className="text-sm font-medium text-gray-400">/{plan.price.period}</span>
            </>
          )}
        </div>
        
        {/* Description */}
        <p className="text-sm text-gray-400 mt-2 leading-relaxed">
          {plan.description}
        </p>
        
        {/* Limitations Note */}
        <p className="text-xs text-gray-500 mt-2 italic">
          {plan.limitations[0]}
        </p>
      </div>

      {/* Features List */}
      <div className="pricing-plan-features">
        <ul className="space-y-3" aria-label="Plan features">
          {plan.features.map((feature, index: number) => (
            <FeatureItem key={index} feature={feature} />
          ))}
        </ul>
      </div>

      {/* CTA Button */}
      <div className="pricing-plan-footer">
        <Button
          variant="glass"
          size="lg"
          onClick={handleSelect}
          className="w-full pricing-plan-cta"
          aria-label={`Select ${plan.name} plan`}
        >
          {plan.buttonText}
        </Button>
      </div>
    </Card>
  );
});

PricingCard.displayName = 'PricingCard';

/**
 * Pricing Section for Feliona AI
 * Displays 4 subscription plans with features and pricing
 */
export function PricingSection({ 
  onPlanSelect, 
  currentPlan, 
  className = "" 
}: PricingSectionProps) {
  const [hoveredPlan, setHoveredPlan] = useState<PlanType | null>(null);

  // Event handlers
  const handlePlanHover = useCallback((planId: PlanType | null) => {
    setHoveredPlan(planId);
  }, []);

  const handlePlanSelect = useCallback((planId: PlanType) => {
    onPlanSelect?.(planId);
  }, [onPlanSelect]);

  // Memoized plans with current selection
  const plansWithState = useMemo(() => {
    return PRICING_PLANS.map(plan => ({
      ...plan,
      isCurrent: plan.id === currentPlan,
      isHovered: hoveredPlan === plan.id
    }));
  }, [currentPlan, hoveredPlan]);

  return (
    <section 
      className={`pricing-section ${className}`}
      aria-labelledby="pricing-title"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="pricing-ethical-badge">
            Ethical monetization
          </div>
          <h2 id="pricing-title" className="text-4xl font-extrabold tracking-tighter text-white mb-4">
            Choose your level of connection
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Transparent pricing with no hidden fees. Start free and grow at your own pace with meaningful relationships.
          </p>
        </div>

        {/* Pricing Grid */}
        <div className="pricing-grid">
          {plansWithState.map((plan, index) => (
            <PricingCard
              key={plan.id}
              plan={plan}
              isHovered={plan.isHovered}
              animationDelay={`${index * 100}ms`}
              onHover={handlePlanHover}
              onSelect={handlePlanSelect}
            />
          ))}
        </div>

        {/* Additional Info */}
        <div className="text-center mt-16">
          <p className="text-sm text-gray-500 mb-4">
            All plans include 7-day money-back guarantee • Cancel anytime • No hidden fees
          </p>
          <div className="pricing-security-badges">
            <span className="pricing-security-badge">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              SSL Encrypted
            </span>
            <span className="pricing-security-badge">
              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
              GDPR Compliant
            </span>
            <span className="pricing-security-badge">
              <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
              Age Verified
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

export default PricingSection;