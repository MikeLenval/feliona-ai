/**
 * ============================================
 * EIC - Emotional System Types v5.0
 * 🎯 Complete emotional intelligence type definitions
 * ============================================
 */

import type { Brand } from '../base';

// === CORE EMOTIONAL TYPES ===

/**
 * 12 основных эмоций EIC Platform (строго типизированные)
 */
export type EmotionType = 
  | 'warmth' | 'trust' | 'wisdom' | 'mystery' | 'joy' | 'calm'
  | 'curiosity' | 'empathy' | 'excitement' | 'melancholy' | 'love' | 'serenity';

/**
 * Эмоциональная интенсивность (0-100)
 */
export type EmotionalIntensity = Brand<number, 'EmotionalIntensity'> & {
  readonly __min: 0;
  readonly __max: 100;
};

/**
 * Эмоциональные темы
 */
export type EmotionalTheme = 
  | 'romantic' | 'playful' | 'calm' | 'wise' 
  | 'mysterious' | 'joyful' | 'serene' | 'default';

// === EMOTIONAL INTERFACES ===

/**
 * Полная информация об эмоции
 */
export interface Emotion {
  readonly type: EmotionType;
  readonly intensity: EmotionalIntensity;
  readonly duration: number;
  readonly timestamp: Date;
  readonly metadata: Readonly<{
    triggered_by?: string;
    context?: string;
    user_input?: string;
    companion_state?: string;
    environmental_factors?: readonly string[];
    previous_emotion?: EmotionType;
    transition_type?: 'gradual' | 'sudden' | 'triggered' | 'natural';
    authenticity_score?: number;
    user_resonance?: number;
  }>;
  readonly physiological?: Readonly<{
    heart_rate_influence?: number;
    breathing_pattern?: 'calm' | 'excited' | 'anxious' | 'peaceful';
    muscle_tension?: number;
    facial_expression?: string;
  }>;
  readonly cognitive?: Readonly<{
    clarity?: number;
    focus?: number;
    creativity?: number;
    decision_making?: number;
  }>;
}

/**
 * Эмоциональное состояние (enhanced)
 */
export interface EmotionalState {
  readonly primary: EmotionType;
  readonly secondary?: EmotionType;
  readonly intensity: EmotionalIntensity;
  readonly stability: number;
  readonly authenticity: number;
  readonly context: string;
  readonly timestamp: Date;
  readonly history: readonly Emotion[];
  readonly transitions?: readonly EmotionalTransition[];
  readonly triggers?: readonly EmotionalTrigger[];
  readonly suppressions?: readonly EmotionalSuppression[];
  readonly amplifications?: readonly EmotionalAmplification[];
  readonly conflicts?: readonly EmotionalConflict[];
  readonly harmonies?: readonly EmotionalHarmony[];
  readonly environment_influence?: number;
  readonly user_influence?: number;
  readonly companion_influence?: number;
}

/**
 * Изменение эмоционального состояния
 */
export interface EmotionalStateChange {
  readonly from: EmotionType;
  readonly to: EmotionType;
  readonly reason: string;
  readonly intensity_delta: number;
  readonly timestamp: Date;
  readonly duration: number;
  readonly natural: boolean;
}

/**
 * Эмоциональный переход
 */
export interface EmotionalTransition {
  readonly id: string;
  readonly from: EmotionType;
  readonly to: EmotionType;
  readonly duration: number;
  readonly easing: 'linear' | 'ease-in' | 'ease-out' | 'ease-in-out' | 'bounce' | 'elastic';
  readonly trigger: string;
  readonly naturalness: number;
  readonly user_initiated: boolean;
  readonly system_initiated: boolean;
  readonly environmental: boolean;
}

/**
 * Эмоциональный триггер
 */
export interface EmotionalTrigger {
  readonly id: string;
  readonly type: 'word' | 'phrase' | 'context' | 'memory' | 'user_action' | 'environmental';
  readonly stimulus: string;
  readonly response_emotion: EmotionType;
  readonly sensitivity: number;
  readonly learned: boolean;
  readonly frequency: number;
  readonly last_triggered: Date;
  readonly effectiveness: number;
}

/**
 * Эмоциональное подавление
 */
export interface EmotionalSuppression {
  readonly emotion: EmotionType;
  readonly reason: string;
  readonly strength: number;
  readonly duration: number;
  readonly side_effects: readonly string[];
}

/**
 * Эмоциональное усиление
 */
export interface EmotionalAmplification {
  readonly emotion: EmotionType;
  readonly reason: string;
  readonly multiplier: number;
  readonly duration: number;
  readonly sustainability: number;
}

/**
 * Эмоциональный конфликт
 */
export interface EmotionalConflict {
  readonly emotions: readonly [EmotionType, EmotionType];
  readonly intensity: number;
  readonly resolution_strategy: 'suppression' | 'balance' | 'dominance' | 'integration';
  readonly stress_level: number;
}

/**
 * Эмоциональная гармония
 */
export interface EmotionalHarmony {
  readonly emotions: readonly EmotionType[];
  readonly synergy_level: number;
  readonly flow_state: boolean;
  readonly user_alignment: number;
}

// === CONDITIONAL EMOTION TYPES ===

/**
 * Conditional type based on emotion
 */
export type EmotionallyConditional<T extends EmotionType, True, False> = 
  T extends 'warmth' | 'love' | 'joy' ? True : False;

/**
 * Extract emotion category
 */
export type EmotionCategory<T extends EmotionType> = 
  T extends 'warmth' | 'trust' | 'wisdom' | 'mystery' | 'joy' | 'calm' 
    ? 'primary' 
    : T extends 'curiosity' | 'empathy' | 'excitement' | 'melancholy' | 'love' | 'serenity'
    ? 'extended'
    : never;

// === INTERACTION TYPES ===

/**
 * Эмоциональное взаимодействие
 */
export interface EmotionalInteraction {
  readonly id: string;
  readonly timestamp: Date;
  readonly userEmotion: EmotionType;
  readonly companionEmotion: EmotionType;
  readonly context: string;
  readonly intensity: EmotionalIntensity;
  readonly outcome: 'positive' | 'neutral' | 'negative' | 'transformative';
  readonly pointsEarned: number;
  readonly relationshipImpact: number;
  readonly memoryFormed: boolean;
}