/**
 * ============================================
 * EIC - VRM Types v2.0 (Enhanced & Production-Ready)
 * 🎯 Complete VRM integration with EIC emotional system
 * ============================================
 */

import type { EmotionType } from '../core/emotions';
import type { RelationshipLevel } from '../core/relationships';

// === CORE VRM TYPES ===

/**
 * VRM Expression Preset Names (from @pixiv/three-vrm)
 */
export type VRMExpressionPresetName = 
  | 'happy' 
  | 'sad' 
  | 'angry' 
  | 'surprised' 
  | 'relaxed'
  | 'blink'
  | 'aa'
  | 'ih' 
  | 'ou'
  | 'ee'
  | 'oh'
  | 'neutral';

// Legacy compatibility
export type VRMExpression = VRMExpressionPresetName;

/**
 * VRM Expression Mapping (EIC эмоции -> VRM выражения)
 */
export type VRMExpressionMapping = {
  [K in EmotionType]: VRMExpressionPresetName[];
};

/**
 * VRM Animation State (Enhanced)
 */
export interface VRMAnimationState {
  currentExpression: VRMExpressionPresetName;
  targetExpression: VRMExpressionPresetName;
  transitionProgress: number; // 0-1
  transitionDuration: number; // ms
  isTransitioning: boolean;
  
  // EIC context
  emotionalContext: EmotionType;
  emotionalIntensity: number; // 0-100
  
  // Animation queue
  queuedExpressions: Array<{
    expression: VRMExpressionPresetName;
    duration: number;
    intensity: number;
  }>;
}

/**
 * VRM Model Configuration (Enhanced)
 */
export interface VRMModelConfig {
  companionId: string;
  modelPath: string;
  qualityLevel: 'high' | 'medium' | 'low';
  
  // Essential settings (backward compatibility)
  maxFPS: number;
  enableShadows: boolean;
  emotionalResponseSpeed: number; // 0-1
  
  // Enhanced settings
  enablePostProcessing?: boolean;
  lodDistance?: number;
  expressionIntensityMultiplier?: number; // 0-2
  enableEmotionalTransitions?: boolean;
  enableFrustumCulling?: boolean;
  enableOcclusion?: boolean;
  textureQuality?: 'high' | 'medium' | 'low';
  geometryLOD?: boolean;
}

/**
 * VRM Performance Metrics
 */
export interface VRMPerformanceMetrics {
  // Basic metrics
  fps: number;
  drawCalls: number;
  triangles: number;
  memoryUsage: number;
  
  // VRM-specific metrics
  expressionUpdatesPerSecond: number;
  animationFrameTime: number;
  modelLoadTime?: number;
  textureMemoryUsage?: number;
  
  // EIC-specific metrics
  emotionalTransitionTime?: number;
  expressionAccuracy?: number; // 0-1
  emotionalConsistency?: number; // 0-1
  
  // Performance indicators
  isPerformanceOptimal: boolean;
  recommendations?: string[];
  timestamp: Date;
}

/**
 * VRM Companion Instance (Enhanced)
 */
export interface VRMCompanionInstance {
  companionId: string;
  modelPath: string;
  isLoaded: boolean;
  
  // Animation state
  animationState: VRMAnimationState;
  config: VRMModelConfig;
  
  // EIC integration
  emotionalState: EmotionType;
  relationshipLevel?: RelationshipLevel;
  
  // Performance tracking
  metrics?: VRMPerformanceMetrics;
  lastUpdate: Date;
  
  // Methods
  setExpression(expression: VRMExpressionPresetName, intensity?: number): Promise<void>;
  transitionToExpression(expression: VRMExpressionPresetName, duration?: number): Promise<void>;
  updateEmotionalState(emotion: EmotionType, intensity: number): Promise<void>;
  dispose(): Promise<void>;
  reload?(): Promise<void>;
}

// Legacy alias for backward compatibility
export type VRMCompanion = VRMCompanionInstance;

/**
 * VRM Manager (Enhanced)
 */
export interface VRMManager {
  // Companion management
  loadCompanion(companionId: string, config: VRMModelConfig): Promise<VRMCompanionInstance>;
  unloadCompanion(companionId: string): Promise<void>;
  getCompanion(companionId: string): VRMCompanionInstance | null;
  getAllCompanions?(): VRMCompanionInstance[];
  
  // Expression control
  setExpression(companionId: string, expression: VRMExpressionPresetName, intensity?: number): Promise<void>;
  transitionToExpression?(companionId: string, expression: VRMExpressionPresetName, duration?: number): Promise<void>;
  
  // EIC integration
  setEmotion(companionId: string, emotion: EmotionType, intensity?: number): Promise<void>;
  updateRelationshipLevel?(companionId: string, level: RelationshipLevel): Promise<void>;
  
  // Events
  onExpressionChange(callback: (companionId: string, expression: VRMExpressionPresetName) => void): void;
  onError(callback: (companionId: string, error: string) => void): void;
}

// === UTILITY FUNCTIONS ===

/**
 * Create VRM model configuration with enhanced defaults
 */
export function createVRMModelConfig(
  companionId: string,
  modelPath: string,
  qualityLevel: 'high' | 'medium' | 'low' = 'medium'
): VRMModelConfig {
  const baseConfig: VRMModelConfig = {
    companionId,
    modelPath,
    qualityLevel,
    maxFPS: qualityLevel === 'high' ? 60 : qualityLevel === 'medium' ? 30 : 24,
    enableShadows: qualityLevel !== 'low',
    emotionalResponseSpeed: 0.7,
    enablePostProcessing: qualityLevel === 'high',
    lodDistance: 50,
    expressionIntensityMultiplier: 1.0,
    enableEmotionalTransitions: true,
    enableFrustumCulling: true,
    enableOcclusion: qualityLevel === 'high',
    textureQuality: qualityLevel,
    geometryLOD: true
  };
  
  return baseConfig;
}

/**
 * Map EIC emotion to VRM expressions (Enhanced)
 */
export function mapEmotionToExpressions(emotion: EmotionType): VRMExpressionPresetName[] {
  const mapping: VRMExpressionMapping = {
    warmth: ['happy', 'relaxed'],
    trust: ['relaxed', 'happy'],
    wisdom: ['neutral', 'relaxed'],
    mystery: ['neutral', 'surprised'],
    joy: ['happy', 'surprised'],
    calm: ['relaxed', 'neutral'],
    curiosity: ['surprised', 'happy'],
    empathy: ['relaxed', 'sad'],
    excitement: ['happy', 'surprised'],
    melancholy: ['sad', 'neutral'],
    love: ['happy', 'relaxed'],
    serenity: ['relaxed', 'neutral']
  };
  
  return mapping[emotion] || ['neutral'];
}

/**
 * Map EIC emotion to single VRM expression (backward compatibility)
 */
export function mapEmotionToExpression(emotion: EmotionType): VRMExpressionPresetName {
  const expressions = mapEmotionToExpressions(emotion);
  return expressions[0] || 'neutral';
}

/**
 * Create default animation state (Enhanced)
 */
export function createDefaultAnimationState(
  emotion: EmotionType = 'warmth'
): VRMAnimationState {
  const expressions = mapEmotionToExpressions(emotion);
  const currentExpression = expressions[0] || 'neutral';
  
  return {
    currentExpression,
    targetExpression: currentExpression,
    transitionProgress: 1.0,
    transitionDuration: 1000,
    isTransitioning: false,
    emotionalContext: emotion,
    emotionalIntensity: 50,
    queuedExpressions: []
  };
}

// === CONSTANTS ===

/**
 * VRM Expression emoji mapping
 */
export const VRM_EXPRESSION_EMOJIS: Record<VRMExpressionPresetName, string> = {
  happy: '😊',
  sad: '😢',
  angry: '😠',
  surprised: '😲',
  relaxed: '😌',
  blink: '😊',
  aa: '😮',
  ih: '😐',
  ou: '😯',
  ee: '😬',
  oh: '😲',
  neutral: '😐'
} as const;

/**
 * Performance thresholds
 */
export const VRM_PERFORMANCE_THRESHOLDS = {
  OPTIMAL_FPS: 30,
  MIN_FPS: 15,
  MAX_MEMORY_MB: 200,
  MAX_DRAW_CALLS: 500,
  EXPRESSION_UPDATE_RATE: 10 // per second
} as const;
