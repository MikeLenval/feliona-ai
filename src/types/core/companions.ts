/**
 * ============================================
 * EIC - Companion System Types v5.0
 * 🎯 Character archetypes and companion instances
 * ============================================
 */

import type { CompanionId, SessionId, DeepPartial } from '../base';
import type { EmotionType, EmotionalIntensity, EmotionalTheme } from './emotions';

// === COMPANION TYPES ===

/**
 * Типы компаньонов (8 архетипов)
 */
export type CompanionType = 
  | 'caring-friend' | 'playful-spark' | 'wise-muse' | 'passionate-soul'
  | 'elven-sage' | 'neko-girl' | 'guardian-angel' | 'seductive-demoness';

/**
 * Поддерживаемые локали (20 языков)
 */
export type SupportedLocale = 
  | 'en' | 'ru' | 'es' | 'fr' | 'de' | 'ja' | 'ko' | 'zh' | 'pt' | 'it'
  | 'ar' | 'hi' | 'th' | 'vi' | 'pl' | 'tr' | 'nl' | 'sv' | 'da' | 'no';

// === CHARACTER SYSTEM ===

/**
 * Архетип персонажа (enhanced)
 */
export interface Character {
  readonly id: CompanionId;
  readonly name: string;
  readonly type: CompanionType;
  readonly description: string;
  readonly personality: Readonly<{
    traits: readonly string[];
    values: readonly string[];
    quirks: readonly string[];
    strengths: readonly string[];
    weaknesses: readonly string[];
    communication_style: 'formal' | 'casual' | 'playful' | 'intellectual' | 'emotional' | 'mysterious';
    humor_type?: 'witty' | 'playful' | 'dry' | 'sarcastic' | 'wholesome' | 'none';
    emotional_intelligence: number;
    empathy_level: number;
    curiosity_level: number;
    wisdom_level: number;
    playfulness_level: number;
    mystery_level: number;
    loyalty_level: number;
    independence_level: number;
  }>;
  readonly appearance: Readonly<{
    avatar_url: string;
    model_url?: string;
    style: 'anime' | 'realistic' | 'artistic' | 'minimalist' | 'fantasy';
    primary_colors: readonly string[];
    aesthetic: string;
    clothing_style?: string;
    accessories?: readonly string[];
    distinctive_features?: readonly string[];
  }>;
  readonly capabilities: Readonly<{
    conversation: boolean;
    voice_synthesis: boolean;
    emotional_response: boolean;
    memory_formation: boolean;
    learning: boolean;
    creativity: boolean;
    problem_solving: boolean;
    storytelling: boolean;
    advice_giving: boolean;
    emotional_support: boolean;
    entertainment: boolean;
    educational: boolean;
  }>;
  readonly emotional_profile: Readonly<{
    default_emotion: EmotionType;
    emotional_range: readonly EmotionType[];
    emotional_stability: number;
    emotional_expressiveness: number;
    emotional_contagion: number;
    emotional_regulation: number;
  }>;
  readonly preferences: Readonly<{
    topics: readonly string[];
    activities: readonly string[];
    conversation_depth: 'surface' | 'moderate' | 'deep' | 'philosophical';
    interaction_frequency: 'minimal' | 'moderate' | 'frequent' | 'constant';
    personal_space: 'distant' | 'respectful' | 'close' | 'intimate';
    conflict_resolution: 'avoidant' | 'diplomatic' | 'direct' | 'assertive';
  }>;
  readonly backstory?: Readonly<{
    origin: string;
    experiences: readonly string[];
    relationships: readonly string[];
    goals: readonly string[];
    fears: readonly string[];
    dreams: readonly string[];
  }>;
  readonly content_rating: 'G' | 'PG' | 'PG-13' | 'R' | 'NC-17';
  readonly created_at: Date;
  readonly updated_at: Date;
  readonly version: string;
}

/**
 * Паттерн ответов персонажа
 */
export interface ResponsePattern {
  readonly emotion: EmotionType;
  readonly triggers: readonly string[];
  readonly responses: readonly string[];
  readonly probability: number;
  readonly context_dependent: boolean;
  readonly learning_weight: number;
}

/**
 * Активный экземпляр компаньона
 */
export interface CompanionInstance {
  readonly id: CompanionId;
  readonly character: Character;
  readonly session_id: SessionId;
  readonly current_emotion: EmotionType;
  readonly emotional_state: Readonly<Record<EmotionType, number>>;
  readonly energy_level: number;
  readonly engagement_level: number;
  readonly trust_level: number;
  readonly customizations: CompanionCustomizations;
  readonly status: 'active' | 'idle' | 'sleeping' | 'offline' | 'maintenance';
  readonly last_interaction: Date;
  readonly total_interactions: number;
  readonly session_duration: number;
  readonly preferences_learned: number;
  readonly performance_metrics: CompanionPerformanceMetrics;
}

/**
 * Кастомизации компаньона
 */
export interface CompanionCustomizations {
  readonly displayName?: string;
  readonly emotionalSensitivity: EmotionalIntensity;
  readonly responseVerbosity: 'concise' | 'normal' | 'detailed' | 'verbose';
  readonly personalityAdjustments: DeepPartial<Character['personality']>;
  readonly visualPreferences: Readonly<{
    theme: EmotionalTheme;
    colorScheme?: 'auto' | 'warm' | 'cool' | 'neutral';
    animationLevel: 'minimal' | 'normal' | 'enhanced';
  }>;
}

/**
 * Метрики производительности компаньона
 */
export interface CompanionPerformanceMetrics {
  readonly responseTime: number;
  readonly accuracy: number;
  readonly creativity: number;
  readonly empathy: number;
  readonly userSatisfaction: number;
  readonly learningRate: number;
  readonly adaptability: number;
  readonly consistency: number;
  readonly errorRate: number;
  readonly uptime: number;
}

// === LOCALIZED CONTENT ===

/**
 * Локализованный контент
 */
export interface LocalizedContent {
  readonly [key: string]: Readonly<{
    readonly [locale in SupportedLocale]?: string;
  }>;
}

/**
 * Культурная адаптация
 */
export interface CulturalAdaptation {
  readonly locale: SupportedLocale;
  readonly emotionalNorms: readonly EmotionType[];
  readonly communicationStyle: string;
  readonly taboos: readonly string[];
  readonly preferences: Readonly<Record<string, unknown>>;
}