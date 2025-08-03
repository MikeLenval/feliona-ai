/**
 * ============================================
 * EIC - Unified Type Exports v5.0 (Enhanced)
 * Централизованные реэкспорты для удобства использования
 * 
 * 🎯 Объединение всех модульных типов
 * 🔄 Реэкспорты для удобства использования
 * 🛡️ Type-safe константы и утилиты
 * ⚡ Оптимизированная структура импортов
 * ============================================
 */

// === CORE TYPES RE-EXPORTS ===

// Base Types
export type * from './base';

// Core System Types
export type * from './core/emotions';
export type * from './core/companions';
export type * from './core/relationships';
export type * from './core/memory';

// AI System Types
export type * from './ai/langgraph';
export type * from './ai/mcp';
export type * from './ai/models';
export type * from './ai/streaming';

// Platform Types (only non-empty files)
export type * from './platform/auth';
export type * from './platform/events';

// UI Types
export type * from './ui/components';
export type * from './ui/themes';
export type * from './ui/interactions';
export type * from './ui/characters';
export type * from './ui/pricing';

// Utility Types
export type * from './utils/validation';
export type * from './utils/constants';

// VRM Types
export type * from './vrm';

// Global Extensions
export type * from './globals';

// === CONVENIENCE ALIASES ===

// Core aliases for backward compatibility
export type { EmotionType } from './core/emotions';
export type { CompanionType } from './core/companions';
export type { RelationshipLevel } from './core/relationships';
export type { Character, CompanionInstance } from './core/companions';
export type { MemoryEntry, ConversationMessage } from './core/memory';

// Pricing types  
export type { PlanType, FeatureItemProps, PricingCardProps, PricingSectionProps } from './ui/pricing';

// AI aliases
export type { LangGraphRuntime, LangGraphConfig, LangGraphInstance } from './ai/langgraph';
export type { MCPBridge, MCPConnection, MCPTool } from './ai/mcp';

// VRM aliases
export type { VRMExpression, VRMCompanionInstance, VRMManager } from './vrm';

// === TYPE-SAFE CONSTANTS ===

/**
 * Emotion type values for runtime validation
 */
export const EMOTION_VALUES = [
  'warmth', 'trust', 'wisdom', 'mystery', 'joy', 'calm',
  'curiosity', 'empathy', 'excitement', 'melancholy', 'love', 'serenity'
] as const;

/**
 * Companion type values for runtime validation
 */
export const COMPANION_TYPE_VALUES = [
  'caring-friend', 'playful-spark', 'wise-muse', 'passionate-soul',
  'elven-sage', 'neko-girl', 'guardian-angel', 'seductive-demoness'
] as const;

/**
 * Relationship level values for runtime validation
 */
export const RELATIONSHIP_LEVEL_VALUES = [
  'stranger', 'acquaintance', 'friendship', 'close-bond'
] as const;

/**
 * VRM expression values for runtime validation
 */
export const VRM_EXPRESSION_VALUES = [
  'happy', 'sad', 'angry', 'surprised', 'relaxed', 'blink', 'neutral',
  'aa', 'ih', 'ou', 'ee', 'oh'
] as const;

// === VALIDATION HELPERS ===

/**
 * Type guard for EmotionType
 */
export function isEmotionType(value: unknown): value is import('./core/emotions').EmotionType {
  return typeof value === 'string' && (EMOTION_VALUES as readonly string[]).includes(value);
}

/**
 * Type guard for CompanionType
 */
export function isCompanionType(value: unknown): value is import('./core/companions').CompanionType {
  return typeof value === 'string' && (COMPANION_TYPE_VALUES as readonly string[]).includes(value);
}

/**
 * Type guard for RelationshipLevel
 */
export function isRelationshipLevel(value: unknown): value is import('./core/relationships').RelationshipLevel {
  return typeof value === 'string' && (RELATIONSHIP_LEVEL_VALUES as readonly string[]).includes(value);
}

/**
 * Type guard for VRM Expression
 */
export function isVRMExpression(value: unknown): value is import('./vrm').VRMExpression {
  return typeof value === 'string' && (VRM_EXPRESSION_VALUES as readonly string[]).includes(value);
}
