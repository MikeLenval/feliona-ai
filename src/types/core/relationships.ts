/**
 * ============================================
 * EIC - Relationship System Types v5.0
 * 🎯 Relationship levels, progress, and milestones
 * ============================================
 */

import type { EmotionType, EmotionalIntensity, EmotionalInteraction } from './emotions';

// === RELATIONSHIP TYPES ===

/**
 * Уровни отношений (6 уровней)
 */
export type RelationshipLevel = 
  | 'stranger' | 'acquaintance' | 'friendship' 
  | 'close-bond' | 'intimate' | 'soul-unity';

// === RELATIONSHIP INTERFACES ===

/**
 * Информация об уровне отношений
 */
export interface RelationshipLevelInfo {
  readonly icon: string;
  readonly name: string;
  readonly description: string;
  readonly pointsRequired: number;
  readonly features: readonly string[];
  readonly emotionalAccess: readonly EmotionType[];
  readonly contentRating: 'G' | 'PG' | 'PG-13' | 'R' | 'NC-17';
  readonly unlocks: readonly RelationshipUnlock[];
  readonly restrictions: readonly string[];
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
 * Прогресс отношений
 */
export interface RelationshipProgress {
  readonly currentLevel: RelationshipLevel;
  readonly points: number;
  readonly pointsToNext: number;
  readonly totalInteractions: number;
  readonly relationshipHealth: EmotionalIntensity;
  readonly milestones: readonly RelationshipMilestone[];
  readonly emotionalHistory: readonly EmotionalInteraction[];
  readonly growthRate: number;
  readonly lastLevelUp?: Date;
}

/**
 * Веха в отношениях
 */
export interface RelationshipMilestone {
  readonly id: string;
  readonly level: RelationshipLevel;
  readonly name: string;
  readonly description: string;
  readonly unlockedAt: Date;
  readonly emotion: EmotionType;
  readonly special?: boolean;
  readonly impact: 'major' | 'minor' | 'critical';
  readonly celebration?: CelebrationConfig;
}

/**
 * Конфигурация празднования
 */
export interface CelebrationConfig {
  readonly animation: string;
  readonly sound?: string;
  readonly visual: string;
  readonly duration: number;
  readonly emotion: EmotionType;
}