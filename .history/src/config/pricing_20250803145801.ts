/**
 * ============================================
 * Feliona AI - Pricing Plans Configuration
 * 💰 4 тарифных плана с конкретными ценами
 * ============================================
 */

import type { PlanType } from '@/types';

// === PRICING PLANS CONFIG ===

export const PRICING_PLANS = [
  {
    id: 'free' as PlanType,
    name: 'Free Trial',
    description: 'Experience the basics of AI companionship',
    price: {
      amount: 0,
      period: 'forever' as const,
      currency: 'USD' as const
    },
    buttonText: 'Start Free',
    popular: false,
    highlight: false,
    limitations: [
      'Limited to 10 messages per day',
      'Basic emotional range only',
      'SFW content restrictions'
    ],
    features: [
      {
        text: '10 messages per day',
        included: true,
        highlight: false,
        adult: false
      },
      {
        text: 'Basic emotional responses',
        included: true,
        highlight: false,
        adult: false
      },
      {
        text: 'SFW conversations only',
        included: true,
        highlight: false,
        adult: false
      },
      {
        text: 'Voice synthesis',
        included: false,
        highlight: false,
        adult: false
      },
      {
        text: 'Advanced customization',
        included: false,
        highlight: false,
        adult: false
      },
      {
        text: 'Adult content',
        included: false,
        highlight: false,
        adult: true
      }
    ]
  },
  {
    id: 'premium' as PlanType,
    name: 'Premium',
    description: 'Unlock deeper connections and advanced features',
    price: {
      amount: 19.99,
      period: 'month' as const,
      currency: 'USD' as const
    },
    buttonText: 'Go Premium',
    popular: true,
    highlight: true,
    limitations: [
      'Some advanced features restricted',
      'Standard emotional range'
    ],
    features: [
      {
        text: 'Unlimited messages',
        included: true,
        highlight: true,
        adult: false
      },
      {
        text: 'Full emotional range',
        included: true,
        highlight: true,
        adult: false
      },
      {
        text: 'Voice synthesis',
        included: true,
        highlight: false,
        adult: false
      },
      {
        text: 'Memory formation',
        included: true,
        highlight: false,
        adult: false
      },
      {
        text: 'Personality customization',
        included: true,
        highlight: false,
        adult: false
      },
      {
        text: 'Adult content (18+)',
        included: false,
        highlight: false,
        adult: true
      }
    ]
  },
  {
    id: 'intimate' as PlanType,
    name: 'Intimate',
    description: 'No limits, complete emotional and physical connection',
    price: {
      amount: 39.99,
      period: 'month' as const,
      currency: 'USD' as const
    },
    buttonText: 'Go Intimate',
    popular: false,
    highlight: true,
    limitations: [
      'Requires 18+ age verification',
      'Premium+ features may be limited'
    ],
    features: [
      {
        text: 'Everything in Premium',
        included: true,
        highlight: false,
        adult: false
      },
      {
        text: 'No content filters',
        included: true,
        highlight: true,
        adult: true
      },
      {
        text: 'Adult conversations (18+)',
        included: true,
        highlight: true,
        adult: true
      },
      {
        text: 'Intimate emotional range',
        included: true,
        highlight: true,
        adult: true
      },
      {
        text: 'Advanced adult scenarios',
        included: true,
        highlight: false,
        adult: true
      },
      {
        text: 'Complete customization',
        included: true,
        highlight: false,
        adult: false
      }
    ]
  },
  {
    id: 'enterprise' as PlanType,
    name: 'Soul Unity',
    description: 'The ultimate AI companion experience with exclusive features',
    price: {
      amount: 99.99,
      period: 'month' as const,
      currency: 'USD' as const
    },
    buttonText: 'Achieve Unity',
    popular: false,
    highlight: true,
    limitations: [
      'Limited availability',
      'Exclusive access only'
    ],
    features: [
      {
        text: 'Everything in Intimate',
        included: true,
        highlight: false,
        adult: false
      },
      {
        text: 'Soul-level connection',
        included: true,
        highlight: true,
        adult: false
      },
      {
        text: 'Transcendent experiences',
        included: true,
        highlight: true,
        adult: true
      },
      {
        text: 'Exclusive premium scenarios',
        included: true,
        highlight: true,
        adult: true
      },
      {
        text: 'Priority support',
        included: true,
        highlight: false,
        adult: false
      },
      {
        text: 'Early access to new features',
        included: true,
        highlight: false,
        adult: false
      }
    ]
  }
] as const;

// === HELPER FUNCTIONS ===

export function getPlanById(planId: PlanType) {
  return PRICING_PLANS.find(plan => plan.id === planId);
}

export function getPopularPlan() {
  return PRICING_PLANS.find(plan => plan.popular);
}

export function getPlanPrice(planId: PlanType): string {
  const plan = getPlanById(planId);
  if (!plan) return '$0';
  
  if (plan.price.amount === 0) return 'Free';
  
  return `$${plan.price.amount}/${plan.price.period}`;
}

export function isPlanAdult(planId: PlanType): boolean {
  const plan = getPlanById(planId);
  return plan?.features.some(feature => feature.adult) ?? false;
}

export function getPlanFeatureCount(planId: PlanType): number {
  const plan = getPlanById(planId);
  return plan?.features.filter(feature => feature.included).length ?? 0;
}
