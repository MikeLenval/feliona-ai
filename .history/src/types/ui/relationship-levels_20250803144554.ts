/**
 * ============================================
 * UI Relationship Levels Types 
 * 💕 Types для компонента RelationshipLevels.tsx
 * ============================================
 */

import type { RelationshipLevel } from '../core/relationships';

// === RELATIONSHIP LEVEL CONFIG ===

/**
 * Конфигурация уровня отношений для UI
 */
export interface RelationshipLevelConfig {
  readonly id: RelationshipLevel;
  readonly level: number;
  readonly icon: string;
  readonly name: string;
  readonly description: string;
  readonly points: number;
  readonly pointsRequired: number;
  readonly color: string;
  readonly position: 'left' | 'right';
  readonly isAdult?: boolean;
  readonly isSpecial?: boolean;
  readonly badge?: string;
  readonly features: readonly string[];
  readonly unlocks: readonly RelationshipUnlock[];
  readonly restrictions: readonly string[];
  readonly emotionalAccess: readonly string[];
  readonly contentRating: 'G' | 'PG' | 'PG-13' | 'R' | 'NC-17';
}

/**
 * Разблокировки уровня отношений
 */
export interface RelationshipUnlock {
  readonly type: 'feature' | 'emotion' | 'content' | 'customization';
  readonly name: string;
  readonly description: string;
  readonly icon?: string;
}

/**
 * Уровень отношений с прогрессом
 */
export interface RelationshipLevelWithProgress extends RelationshipLevelConfig {
  readonly isUnlocked?: boolean;
  readonly isCurrent?: boolean;
  readonly progress?: number;
}

// === COMPONENT PROPS ===

/**
 * Props для LevelCard компонента
 */
export interface LevelCardProps {
  readonly level: RelationshipLevelWithProgress;
  readonly isVisible: boolean;
  readonly animationDelay: number;
  readonly onLevelSelect?: (level: RelationshipLevel) => void;
}

/**
 * Props для ConnectionLine компонента
 */
export interface ConnectionLineProps {
  readonly isVisible: boolean;
  readonly animationDelay: number;
  readonly isActive?: boolean;
}

/**
 * Props для основного RelationshipLevels компонента
 */
export interface RelationshipLevelsProps {
  readonly currentLevel?: RelationshipLevel;
  readonly currentPoints?: number;
  readonly onLevelSelect?: (level: RelationshipLevel) => void;
  readonly className?: string;
}

/**
 * Состояние компонента RelationshipLevels
 */
export interface RelationshipLevelsState {
  readonly visibleLevels: readonly boolean[];
  readonly isLoaded: boolean;
  readonly selectedLevel?: RelationshipLevel;
}

// === ANIMATION CONFIG ===

export const RELATIONSHIP_ANIMATION_CONFIG = {
  staggerDelay: 200,
  cardAnimationDuration: 600,
  lineAnimationDuration: 300,
  scrollThreshold: 0.3
} as const;

// === CSS CLASSES ===

export const RELATIONSHIP_CSS_CLASSES = {
  container: 'relationship-levels-section',
  zigzag: 'relationship-zigzag',
  levelItem: 'relationship-level-item',
  levelLeft: 'relationship-level-left',
  levelRight: 'relationship-level-right',
  levelCard: 'relationship-level-card',
  levelNumber: 'relationship-level-number',
  levelContent: 'relationship-level-content',
  adultBadge: 'relationship-adult-badge',
  specialGlow: 'special-glow',
  connectionLine: 'relationship-connection-line',
  visible: 'visible',
  hidden: 'hidden'
} as const;
