/**
 * ============================================
 * Feliona AI - Relationship Levels Component
 * 💕 6 уровней отношений в zigzag layout
 * 
 * Путь: src/app/components/features/RelationshipLevels.tsx
 * 
 * FIXES APPLIED:
 * ✅ Убран styled-jsx (использует globals.css)
 * ✅ Улучшена типизация
 * ✅ Добавлена error safety
 * ✅ Вынесены типы и константы в отдельные файлы
 * ============================================
 */

'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Card } from '@/components/ui/Card';
import type { RelationshipLevel } from '@/types';
import { RELATIONSHIP_LEVELS_CONFIG } from '@/config/relationships';
import { RelationshipAnalytics } from '@/shared/lib/utils/relationship-analytics';

// Временные типы (перенести в types/ui позже)
interface LevelCardProps {
  level: typeof RELATIONSHIP_LEVELS_CONFIG[number] & {
    isUnlocked?: boolean;
    isCurrent?: boolean;
    progress?: number;
  };
  isVisible: boolean;
  animationDelay: number;
  onLevelSelect?: (level: RelationshipLevel) => void;
}

interface RelationshipLevelsProps {
  currentLevel?: RelationshipLevel;
  currentPoints?: number;
  onLevelSelect?: (level: RelationshipLevel) => void;
  className?: string;
}

// Level Card Component
const LevelCard = React.memo(({ level, isVisible, animationDelay, onLevelSelect }: LevelCardProps) => {
  const handleClick = () => {
    RelationshipAnalytics.trackLevelCardClick(level.id);
    onLevelSelect?.(level.id);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleClick();
    }
  };

  return (
    <div 
      className={`relationship-level-item ${level.position === 'left' ? 'relationship-level-left' : 'relationship-level-right'}`}
      style={{ animationDelay: `${animationDelay}ms` }}
    >
      {/* Пустой div для другой стороны */}
      <div className="relationship-level-spacer" />
      
      {/* Level Card */}
      <Card
        variant="glass"
        className={`relationship-level-card ${isVisible ? 'visible' : 'hidden'} ${level.isAdult ? 'adult-relationship-level' : ''} ${level.isSpecial ? 'special-relationship-level' : ''}`}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        role="button"
        tabIndex={0}
        aria-label={`${level.name} relationship level`}
      >
        {/* Adult Badge */}
        {level.isAdult && level.badge && (
          <div className="relationship-adult-badge">
            {level.badge}
          </div>
        )}

        {/* Level Number Circle */}
        <div className={`relationship-level-number ${level.isSpecial ? 'special-glow' : ''}`}>
          <span className="text-xl font-bold text-white">{level.level}</span>
        </div>

        {/* Level Content */}
        <div className="relationship-level-content">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl" aria-hidden="true">{level.icon}</span>
            <h3 className="text-xl font-bold text-white">{level.name}</h3>
          </div>
          
          <p className={`text-sm font-bold mb-2 ${level.color}`}>
            {level.points} points
          </p>
          
          <p className="text-sm text-gray-300 mb-4 leading-relaxed">
            {level.description}
          </p>

          {/* Features List */}
          <ul className="space-y-1" aria-label="Level features">
            {level.features.map((feature, index) => (
              <li key={index} className="text-xs text-gray-400 flex items-center gap-2">
                <span className="w-1 h-1 bg-gray-400 rounded-full flex-shrink-0" aria-hidden="true" />
                {feature}
              </li>
            ))}
          </ul>
        </div>
      </Card>
    </div>
  );
});

LevelCard.displayName = 'LevelCard';

// Connection Line Component
const ConnectionLine = React.memo(({ isVisible }: { isVisible: boolean }) => (
  <div className={`relationship-connection-line ${isVisible ? 'visible' : 'hidden'}`} aria-hidden="true">
    <div className="relationship-line-gradient" />
  </div>
));

ConnectionLine.displayName = 'ConnectionLine';

// Main Component Props
interface RelationshipLevelsProps {
  currentLevel?: RelationshipLevel;
  currentPoints?: number;
  onLevelSelect?: (level: RelationshipLevel) => void;
  className?: string;
}

/**
 * Relationship Levels Section for Feliona AI
 * Displays 6 relationship progression levels in zigzag layout
 */
export function RelationshipLevels({ 
  currentLevel, 
  currentPoints = 0, 
  onLevelSelect, 
  className = "" 
}: RelationshipLevelsProps) {
  const [visibleLevels, setVisibleLevels] = useState<Set<number>>(new Set());
  const [isLoaded, setIsLoaded] = useState(false);

  // Trigger progressive animation
  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 200);
    
    // Progressive level reveal
    const revealLevels = () => {
      RELATIONSHIP_LEVELS_CONFIG.forEach((_, index) => {
        setTimeout(() => {
          setVisibleLevels(prev => new Set([...prev, index]));
        }, index * 300);
      });
    };

    setTimeout(revealLevels, 500);
    
    return () => clearTimeout(timer);
  }, []);

  // Memoized level data with current progress
  const levelsWithProgress = useMemo(() => {
    return RELATIONSHIP_LEVELS_CONFIG.map(level => ({
      ...level,
      isUnlocked: currentPoints >= level.points,
      isCurrent: level.id === currentLevel,
      progress: level.points === 0 ? 100 : Math.min(100, (currentPoints / level.points) * 100)
    }));
  }, [currentLevel, currentPoints]);

  // 🔒 SAFETY: Find current level safely
  const currentLevelData = currentLevel 
    ? RELATIONSHIP_LEVELS_CONFIG.find(l => l.id === currentLevel) 
    : null;

  return (
    <section 
      className={`relationship-levels-section ${className}`}
      aria-labelledby="relationship-title"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 id="relationship-title" className="text-4xl font-extrabold tracking-tighter text-white mb-4">
            Relationship Progression System
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Develop your connection through 6 unique levels, from first meeting to soul unity.
          </p>
        </div>

        {/* Levels Container */}
        <div className="relative max-w-5xl mx-auto">
          
          {/* Center Connection Line */}
          <ConnectionLine isVisible={isLoaded} />
          
          {/* Levels Grid */}
          <div className="relationship-levels-container">
            {levelsWithProgress.map((level, index) => (
              <LevelCard
                key={level.id}
                level={level}
                isVisible={visibleLevels.has(index)}
                animationDelay={index * 150}
                {...(onLevelSelect && { onLevelSelect })}
              />
            ))}
          </div>
        </div>

        {/* Current Progress Indicator */}
        {currentLevel && currentLevelData && (
          <div className="mt-16 text-center">
            <Card variant="glass" className="inline-block px-6 py-4">
              <p className="text-sm text-gray-400 mb-2">Your Current Level</p>
              <p className="text-xl font-bold text-white">
                {currentLevelData.name}
                <span className="text-primary-warmth ml-2">
                  ({currentPoints} points)
                </span>
              </p>
            </Card>
          </div>
        )}
      </div>
    </section>
  );
}

export default RelationshipLevels;