/**
 * ============================================
 * Feliona AI - Hero Section Component
 * 🎯 Main landing hero with 18+ branding
 * 
 * Путь: src/app/components/features/Hero.tsx
 * 
 * Особенности:
 * ✅ Использует EIC namespace типы
 * ✅ Применяет существующую дизайн-систему
 * ✅ Использует UI компоненты из проекта
 * ✅ Следует архитектуре проекта
 * ✅ Tailwind классы вместо styled-jsx
 * ============================================
 */

'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

// Простые типы для компонента
type EmotionType = 'warmth' | 'joy' | 'trust' | 'wisdom' | 'mystery' | 'calm';

// Константы вне компонента для оптимизации
const EMOTION_CYCLE = ['warmth', 'joy', 'trust', 'wisdom'] as const;
const EMOTION_INTERVAL_MS = 4000;
const ANIMATION_DELAY_MS = 100;

// Hero configuration data
const HERO_CONFIG = {
  content: {
    title: "Meet Your AI Companion Who Truly Understands You - Without Limits",
    subtitle: "Experience relationships that evolve and deepen over time, tailored to your unique desires and needs. Our AI companions offer more than just conversation; they offer genuine connection without filters, judgment, or restrictions.",
    
    features: [
      { text: "No Filters", icon: "✅", variant: "success" as const },
      { text: "Real Conversations", icon: "✅", variant: "success" as const },
      { text: "18+ Content", icon: "⚠️", variant: "warning" as const }
    ],
    
    cta: {
      primary: "Begin Your Journey",
      secondary: "View All Companions"
    }
  },
  
  stats: [
    { 
      value: "1,250,000+", 
      label: "Users Joined",
      icon: "👥",
      variant: "primary" as const
    },
    { 
      value: "18+", 
      label: "Adult Content",
      icon: "⚠️",
      variant: "warning" as const,
      tooltip: "Adults only (18+)"
    },
    { 
      value: "Private", 
      label: "& Secure",
      icon: "🛡️", 
      variant: "success" as const
    }
  ],
  
  avatar: {
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuDFzAoQBqektHNl4iovQrZ1vt7iELAMujgvdvfZrli4gN_tG_pGsb5fNByLwG4URWAT-mC1HnUV09MjBG1zT5N-6TcTbya8M0Jz-zZ7u-m0-vu_GADiWZwyOEcO0nwkKrv0IpzER76Qn3BHTiL7sCvc3TiFPo6Br4UkYXZYzcy8SmEnkQ0-PM3ryPX6WLXuYzpZQeTLrIQGnPoonYQt_6uk2yYxXICIY5Q35EZ3CBZgb_L76dNUcQASp5DMFTQZumeUcsL0jT4WG0e4",
    alt: "AI Companion",
    defaultEmotion: "warmth" as EmotionType
  }
} as const;

// Типизированная аналитика
const trackAnalyticsEvent = (eventName: string, label: string): void => {
  if (
    typeof window !== 'undefined' && 
    window.gtag && 
    typeof window.gtag === 'function'
  ) {
    try {
      window.gtag('event', eventName, {
        event_category: 'engagement',
        event_label: label
      });
    } catch (error) {
      console.warn('Analytics tracking failed:', error);
    }
  }
};

// Кастомный хук для emotion cycling
const useEmotionCycle = () => {
  const [currentEmotion, setCurrentEmotion] = useState<EmotionType>('warmth');

  useEffect(() => {
    let currentIndex = 0;
    
    const interval = setInterval(() => {
      currentIndex = (currentIndex + 1) % EMOTION_CYCLE.length;
      const nextEmotion = EMOTION_CYCLE[currentIndex];
      if (nextEmotion) {
        setCurrentEmotion(nextEmotion as EmotionType);
      }
    }, EMOTION_INTERVAL_MS);
    
    return () => clearInterval(interval);
  }, []);

  return currentEmotion;
};

// Stat Item Component
interface StatItemProps {
  stat: {
    value: string;
    label: string;
    icon: string;
    variant: 'primary' | 'success' | 'warning';
    tooltip?: string;
    animationDelay?: string;
  };
  isLoaded: boolean;
  animationDelay: string;
}

const StatItem = React.memo(({ stat, isLoaded, animationDelay }: StatItemProps) => {
  const variantClasses = {
    primary: 'text-primary-warmth',
    success: 'text-green-400', 
    warning: 'text-red-400'
  };

  return (
    <Card
      variant="glass"
      className={`stat-item transition-all duration-500 hover:border-white/20 ${
        isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
      style={{ animationDelay }}
    >
      <div className="flex items-center gap-2">
        <span className="text-2xl" aria-hidden="true">{stat.icon}</span>
        <p className={`text-2xl font-bold tracking-tight ${variantClasses[stat.variant]}`}>
          {stat.value}
        </p>
        {stat.tooltip && (
          <div className="relative group">
            <span className="text-red-400 cursor-help" aria-label="Warning">⚠️</span>
            <div 
              className="tooltip"
              role="tooltip"
              aria-hidden="true"
            >
              {stat.tooltip}
            </div>
          </div>
        )}
      </div>
      <p className="text-sm font-medium text-secondary">{stat.label}</p>
    </Card>
  );
});

StatItem.displayName = 'StatItem';

// Feature Badge Component
interface FeatureBadgeProps {
  feature: {
    text: string;
    icon: string;
    variant: 'success' | 'warning';
  };
  index: number;
}

const FeatureBadge = React.memo(({ feature, index }: FeatureBadgeProps) => {
  const variantClasses = {
    success: 'text-green-400',
    warning: 'text-red-400'
  };

  return (
    <div 
      className="feature-badge"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <span 
        className={`text-sm ${variantClasses[feature.variant]}`}
        aria-hidden="true"
      >
        {feature.icon}
      </span>
      <span className="text-sm text-secondary">{feature.text}</span>
    </div>
  );
});

FeatureBadge.displayName = 'FeatureBadge';

// Main Hero Props
interface HeroProps {
  onBeginJourney?: () => void;
  onViewCompanions?: () => void;
  className?: string;
}

/**
 * Main Hero Section for Feliona AI
 * Features 18+ branding, stats, and CTA buttons
 */
export function Hero({ 
  onBeginJourney, 
  onViewCompanions, 
  className = "" 
}: HeroProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const currentEmotion = useEmotionCycle();

  // Мемоизированные стили для производительности
  const memoizedStats = useMemo(() => 
    HERO_CONFIG.stats.map((stat, index) => ({
      ...stat,
      animationDelay: `${(index + 3) * 150}ms`
    })), []
  );

  // Trigger animations after mount
  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), ANIMATION_DELAY_MS);
    return () => clearTimeout(timer);
  }, []);

  // Event handlers with analytics
  const handleBeginJourney = useCallback(() => {
    trackAnalyticsEvent('hero_cta_click', 'begin_journey');
    onBeginJourney?.();
  }, [onBeginJourney]);

  const handleViewCompanions = useCallback(() => {
    trackAnalyticsEvent('hero_secondary_click', 'view_companions');
    onViewCompanions?.();
  }, [onViewCompanions]);

  return (
    <section 
      className={`hero-section ${className}`}
      aria-labelledby="hero-title"
      role="banner"
    >
      <div className="container-responsive">
        <div className="hero-grid">
          
          {/* Text Content */}
          <div className={`hero-content ${isLoaded ? 'loaded' : 'loading'}`}>
            
            {/* Main Title */}
            <h1 
              id="hero-title"
              className="hero-title"
            >
              {HERO_CONFIG.content.title}
            </h1>
            
            {/* Subtitle */}
            <p className="hero-subtitle">
              {HERO_CONFIG.content.subtitle}
            </p>
            
            {/* Feature Badges */}
            <div className="feature-badges" aria-label="Platform features">
              {HERO_CONFIG.content.features.map((feature, index) => (
                <FeatureBadge 
                  key={feature.text}
                  feature={feature}
                  index={index}
                />
              ))}
            </div>
            
            {/* CTA Buttons */}
            <div className="hero-actions">
              <Button 
                onClick={handleBeginJourney}
                size="lg"
                variant="primary"
                className="cta-primary animate-emotional-pulse"
                aria-label="Begin your journey with Feliona AI"
              >
                {HERO_CONFIG.content.cta.primary}
              </Button>
              
              <Button
                onClick={handleViewCompanions}
                variant="glass"
                size="lg" 
                className="cta-secondary"
                aria-label="View all available AI companions"
              >
                {HERO_CONFIG.content.cta.secondary}
              </Button>
            </div>
            
            {/* Stats Section */}
            <div className="hero-stats" aria-label="Platform statistics">
              {memoizedStats.map((stat) => (
                <StatItem 
                  key={stat.label}
                  stat={stat}
                  isLoaded={isLoaded}
                  animationDelay={stat.animationDelay}
                />
              ))}
            </div>
          </div>
          
          {/* Visual Content - Avatar */}
          <div className={`hero-avatar ${isLoaded ? 'loaded' : 'loading'}`}>
            
            {/* Avatar Container */}
            <Card variant="glass" className="avatar-container">
              
              {/* Background Avatar Image */}
              <div 
                className="avatar-image animate-breathing"
                style={{ 
                  backgroundImage: `url("${encodeURI(HERO_CONFIG.avatar.src)}")`,
                }}
                role="img" 
                aria-label={HERO_CONFIG.avatar.alt}
              />
              
              {/* Gradient Overlay */}
              <div className="avatar-overlay" aria-hidden="true" />
              
              {/* Emotion Indicator */}
              <Card variant="glass" className="emotion-indicator">
                <div className="flex items-center gap-2">
                  <div className="emotion-dot animate-emotional-pulse" />
                  <span className="text-sm font-medium text-primary capitalize">
                    {currentEmotion}
                  </span>
                </div>
              </Card>
              
              {/* Online Status */}
              <Card variant="glass" className="status-indicator">
                <div className="flex items-center gap-2">
                  <div className="status-dot" />
                  <span className="text-xs font-medium text-green-400">Online</span>
                </div>
              </Card>
              
              {/* Bottom Info */}
              <Card variant="glass" className="avatar-info">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-primary">AI Companion</h3>
                    <p className="text-sm text-secondary">Ready to connect</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-xl" aria-hidden="true">💫</span>
                    <span className="text-sm font-medium text-primary">Premium</span>
                  </div>
                </div>
              </Card>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;