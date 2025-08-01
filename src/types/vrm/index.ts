/**
 * EIC VRM Types - Essential Only
 * 🎯 Только то, что РЕАЛЬНО нужно для VRM интеграции
 */

import type { EIC } from '../globals';

// === CORE VRM TYPES ===

/**
 * VRM Expression (from @pixiv/three-vrm)
 */
export type VRMExpression = 
  | 'happy' | 'sad' | 'angry' | 'surprised' | 'relaxed'
  | 'blink' | 'neutral';

/**
 * VRM Model Configuration (упрощенная)
 */
export interface VRMModelConfig {
  companionId: string;
  modelPath: string;
  qualityLevel: 'high' | 'medium' | 'low';
  
  // Essential settings
  maxFPS: number;
  enableShadows: boolean;
  emotionalResponseSpeed: number; // 0-1
}

/**
 * VRM Animation State (essential)
 */
export interface VRMAnimationState {
  currentExpression: VRMExpression;
  isTransitioning: boolean;
  emotionalContext: EIC.EmotionType;
  emotionalIntensity: number; // 0-100
}

/**
 * VRM Companion Instance (упрощенный)
 */
export interface VRMCompanion {
  companionId: string;
  modelPath: string;
  isLoaded: boolean;
  animationState: VRMAnimationState;
  
  // Methods
  setExpression(expression: VRMExpression): Promise<void>;
  setEmotion(emotion: EIC.EmotionType, intensity?: number): Promise<void>;
  dispose(): Promise<void>;
}

/**
 * VRM Manager (основной интерфейс)
 */
export interface VRMManager {
  // Companion management
  loadCompanion(companionId: string, config: VRMModelConfig): Promise<VRMCompanion>;
  unloadCompanion(companionId: string): Promise<void>;
  getCompanion(companionId: string): VRMCompanion | null;
  
  // Expression control
  setExpression(companionId: string, expression: VRMExpression): Promise<void>;
  setEmotion(companionId: string, emotion: EIC.EmotionType, intensity?: number): Promise<void>;
  
  // Events
  onExpressionChange(callback: (companionId: string, expression: VRMExpression) => void): void;
  onError(callback: (companionId: string, error: string) => void): void;
}

// === EMOTION MAPPING ===

/**
 * Map EIC emotion to VRM expression
 */
export function mapEmotionToExpression(emotion: EIC.EmotionType): VRMExpression {
  const mapping: Record<EIC.EmotionType, VRMExpression> = {
    warmth: 'happy',
    trust: 'relaxed',
    wisdom: 'neutral',
    mystery: 'surprised',
    joy: 'happy',
    calm: 'relaxed',
    curiosity: 'surprised',
    empathy: 'relaxed',
    excitement: 'happy',
    melancholy: 'sad',
    love: 'happy',
    serenity: 'relaxed'
  };
  
  return mapping[emotion] || 'neutral';
}

// === UTILITY FUNCTIONS ===

/**
 * Create VRM config with defaults
 */
export function createVRMConfig(
  companionId: string,
  modelPath: string,
  qualityLevel: 'high' | 'medium' | 'low' = 'medium'
): VRMModelConfig {
  const configs = {
    high: { maxFPS: 60, enableShadows: true, emotionalResponseSpeed: 0.8 },
    medium: { maxFPS: 30, enableShadows: true, emotionalResponseSpeed: 0.7 },
    low: { maxFPS: 24, enableShadows: false, emotionalResponseSpeed: 0.5 }
  };
  
  return {
    companionId,
    modelPath,
    qualityLevel,
    ...configs[qualityLevel]
  };
}

/**
 * Create default animation state
 */
export function createAnimationState(
  emotion: EIC.EmotionType = 'warmth',
  intensity: number = 50
): VRMAnimationState {
  return {
    currentExpression: mapEmotionToExpression(emotion),
    isTransitioning: false,
    emotionalContext: emotion,
    emotionalIntensity: Math.max(0, Math.min(100, intensity))
  };
}

/**
 * Validate VRM model path
 */
export function isValidVRMPath(path: string): boolean {
  return typeof path === 'string' && 
         path.length > 0 && 
         path.endsWith('.vrm');
}

/**
 * Validate quality level
 */
export function isValidQualityLevel(level: unknown): level is 'high' | 'medium' | 'low' {
  return typeof level === 'string' && 
         ['high', 'medium', 'low'].includes(level);
}

// === CONSTANTS ===

export const VRM_EXPRESSIONS: readonly VRMExpression[] = [
  'happy', 'sad', 'angry', 'surprised', 'relaxed', 'blink', 'neutral'
] as const;

export const VRM_DEFAULTS = {
  QUALITY_LEVEL: 'medium' as const,
  MAX_FPS: 30,
  RESPONSE_SPEED: 0.7,
  DEFAULT_INTENSITY: 50
} as const;

/*
 * Всё что РЕАЛЬНО нужно для VRM интеграции.
 * Focused, simple, maintainable.
 */