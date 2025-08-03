/**
 * ============================================
 * EIC - Memory System Types v5.0
 * 🎯 Comprehensive memory and conversation management
 * ============================================
 */

import type { MemoryId } from '../base';
import type { EmotionType, EmotionalIntensity } from './emotions';
import type { SupportedLocale } from './companions';

// === MEMORY SYSTEM ===

/**
 * Система памяти компаньона
 */
export interface CompanionMemory {
  readonly shortTerm: readonly MemoryEntry[];
  readonly longTerm: readonly MemoryEntry[];
  readonly emotional: readonly EmotionalMemory[];
  readonly preferences: UserPreferences;
  readonly personalDetails: readonly PersonalDetail[];
  readonly conversationHistory: readonly ConversationThread[];
  readonly semanticMemory: readonly SemanticMemoryCluster[];
  readonly memoryCapacity: MemoryCapacity;
}

/**
 * Емкость памяти
 */
export interface MemoryCapacity {
  readonly shortTermLimit: number;
  readonly longTermLimit: number;
  readonly emotionalLimit: number;
  readonly compressionRate: number;
  readonly retentionRate: number;
}

/**
 * Запись в памяти
 */
export interface MemoryEntry {
  readonly id: MemoryId;
  readonly content: string;
  readonly context: string;
  readonly emotion: EmotionType;
  readonly importance: 1 | 2 | 3 | 4 | 5;
  readonly createdAt: Date;
  readonly lastAccessed: Date;
  readonly accessCount: number;
  readonly tags: readonly string[];
  readonly associations: readonly string[];
  readonly decay: number;
  readonly consolidationLevel: 'fresh' | 'consolidating' | 'consolidated' | 'crystallized';
}

/**
 * Эмоциональная память
 */
export interface EmotionalMemory {
  readonly id: MemoryId;
  readonly trigger: string;
  readonly emotion: EmotionType;
  readonly intensity: EmotionalIntensity;
  readonly frequency: number;
  readonly lastTriggered: Date;
  readonly userReaction: 'positive' | 'neutral' | 'negative';
  readonly reinforcementHistory: readonly MemoryReinforcement[];
  readonly contextualFactors: readonly string[];
}

/**
 * Подкрепление памяти
 */
export interface MemoryReinforcement {
  readonly timestamp: Date;
  readonly strength: number;
  readonly context: string;
  readonly emotion: EmotionType;
}

/**
 * Личная информация
 */
export interface PersonalDetail {
  readonly id: string;
  readonly category: 'basic' | 'interests' | 'goals' | 'relationships' | 'experiences' | 'values' | 'fears';
  readonly key: string;
  readonly value: string;
  readonly confidence: number;
  readonly source: 'direct' | 'inferred' | 'observed' | 'deduced';
  readonly lastUpdated: Date;
  readonly importance: number;
  readonly privacy: 'public' | 'private' | 'sensitive';
}

/**
 * Поток разговора
 */
export interface ConversationThread {
  readonly id: string;
  readonly topic: string;
  readonly startedAt: Date;
  readonly lastActivity: Date;
  readonly messages: readonly ConversationMessage[];
  readonly emotionalArc: readonly EmotionType[];
  readonly resolution: 'ongoing' | 'resolved' | 'suspended' | 'abandoned';
  readonly importance: number;
}

/**
 * Сообщение в разговоре
 */
export interface ConversationMessage {
  readonly id: string;
  readonly sender: 'user' | 'companion';
  readonly content: string;
  readonly emotion: EmotionType;
  readonly timestamp: Date;
  readonly context?: string;
  readonly attachments?: readonly MessageAttachment[];
}

/**
 * Приложение к сообщению
 */
export interface MessageAttachment {
  readonly type: 'image' | 'audio' | 'file' | 'emotion' | 'memory';
  readonly data: unknown;
  readonly metadata?: Readonly<Record<string, unknown>>;
}

/**
 * Семантический кластер памяти
 */
export interface SemanticMemoryCluster {
  readonly id: string;
  readonly theme: string;
  readonly relatedConcepts: readonly string[];
  readonly associatedEmotions: readonly EmotionType[];
  readonly strength: number;
  readonly lastAccessed: Date;
  readonly memories: readonly MemoryId[];
}

// === USER PREFERENCES ===

/**
 * Настройки пользователя (comprehensive)
 */
export interface UserPreferences {
  readonly communication: Readonly<{
    tone: 'formal' | 'casual' | 'playful' | 'intimate' | 'professional' | 'friendly';
    verbosity: 'concise' | 'normal' | 'detailed' | 'elaborate';
    emotionalExpression: 'subtle' | 'moderate' | 'expressive' | 'dramatic';
    language: SupportedLocale;
    responseSpeed: 'instant' | 'thoughtful' | 'contemplative';
  }>;
  readonly interaction: Readonly<{
    voiceEnabled: boolean;
    visualCues: boolean;
    hapticFeedback: boolean;
    autoEmotionalResponse: boolean;
    gestureRecognition: boolean;
    eyeTracking: boolean;
    biometricMonitoring: boolean;
  }>;
  readonly privacy: Readonly<{
    memoryRetention: 'session' | 'limited' | 'extended' | 'permanent';
    dataSharing: boolean;
    analytics: boolean;
    personalDataCollection: boolean;
    crossSessionMemory: boolean;
    thirdPartyIntegration: boolean;
  }>;
  readonly accessibility: Readonly<{
    reducedMotion: boolean;
    highContrast: boolean;
    largeText: boolean;
    screenReader: boolean;
    colorBlindnessSupport: 'none' | 'protanopia' | 'deuteranopia' | 'tritanopia';
    keyboardNavigation: boolean;
  }>;
  readonly experience: Readonly<{
    emotionalIntensity: EmotionalIntensity;
    relationshipPace: 'slow' | 'normal' | 'fast' | 'accelerated';
    contentFiltering: 'strict' | 'moderate' | 'permissive' | 'none';
    personalityAdaptation: boolean;
    surpriseLevel: EmotionalIntensity;
  }>;
}