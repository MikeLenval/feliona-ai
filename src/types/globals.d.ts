/**
 * EIC - Essential Types v1.0
 * 🎯 Только то, что РЕАЛЬНО нужно
 */

// === CORE IDS ===
export type CompanionId = string;
export type UserId = string;
export type SessionId = string;

// === EMOTIONS (12 основных) ===
export type EmotionType = 
  | 'warmth' | 'trust' | 'wisdom' | 'mystery' | 'joy' | 'calm'
  | 'curiosity' | 'empathy' | 'excitement' | 'melancholy' | 'love' | 'serenity';

// === COMPANIONS ===
export type CompanionType = 
  | 'caring-friend' | 'playful-spark' | 'wise-muse' | 'passionate-soul';

export interface Character {
  readonly id: CompanionId;
  readonly type: CompanionType;
  readonly name: string;
  readonly avatar: string;
  readonly description: string;
}

export interface CompanionInstance {
  readonly id: CompanionId;
  readonly characterId: CompanionId;
  readonly userId: UserId;
  readonly currentEmotion: EmotionType;
  readonly createdAt: Date;
  readonly lastInteraction: Date;
}

// === RELATIONSHIPS ===
export type RelationshipLevel = 
  | 'stranger' | 'acquaintance' | 'friendship' | 'close-bond';

// === USER PREFERENCES ===
export interface UserPreferences {
  readonly language: 'en' | 'ru' | 'es' | 'fr' | 'de';
  readonly emotionalIntensity: number; // 0-100
  readonly voiceEnabled: boolean;
  readonly memoryRetention: 'session' | 'limited' | 'extended';
}

// === AI INTEGRATION ===
export interface AIModelConfig {
  readonly provider: 'openai' | 'anthropic' | 'custom';
  readonly model: string;
  readonly baseUrl?: string; // For custom providers
  readonly temperature?: number;
  readonly maxTokens?: number;
}

export interface AIResponse {
  readonly text: string;
  readonly emotion?: EmotionType;
  readonly finishReason: 'stop' | 'length' | 'error';
}

// === MEMORY ===
export interface MemoryEntry {
  readonly id: string;
  readonly content: string;
  readonly emotion: EmotionType;
  readonly timestamp: Date;
  readonly importance: 1 | 2 | 3 | 4 | 5;
}

// === INTERACTIONS ===
export interface UserInteraction {
  readonly id: string;
  readonly type: 'message' | 'gesture' | 'voice';
  readonly content: string;
  readonly timestamp: Date;
  readonly emotion?: EmotionType;
}

// === EMOTIONAL STATE ===
export interface EmotionalState {
  readonly current: EmotionType;
  readonly intensity: number;
  readonly lastChange: Date;
}

// === GLOBAL EXTENSIONS ===
declare global {
  interface Window {
    EIC?: {
      companions: readonly unknown[];
      currentEmotion: string;
    };
  }
}

// === REACT INTEGRATION ===
export interface EmotionalComponent {
  emotion?: EmotionType;
  onEmotionChange?: (emotion: EmotionType) => void;
}

// === NAMESPACE EXPORT (для import type { EIC }) ===
export namespace EIC {
  export type CompanionId = string;
  export type UserId = string;
  export type SessionId = string;
  
  export type EmotionType = 
    | 'warmth' | 'trust' | 'wisdom' | 'mystery' | 'joy' | 'calm'
    | 'curiosity' | 'empathy' | 'excitement' | 'melancholy' | 'love' | 'serenity';
    
  export type CompanionType = 
    | 'caring-friend' | 'playful-spark' | 'wise-muse' | 'passionate-soul';
    
  export type RelationshipLevel = 
    | 'stranger' | 'acquaintance' | 'friendship' | 'close-bond';

  export interface Character {
    readonly id: CompanionId;
    readonly type: CompanionType;
    readonly name: string;
    readonly avatar: string;
    readonly description: string;
  }

  export interface CompanionInstance {
    readonly id: CompanionId;
    readonly characterId: CompanionId;
    readonly userId: UserId;
    readonly currentEmotion: EmotionType;
    readonly createdAt: Date;
    readonly lastInteraction: Date;
  }

  export interface EmotionalState {
    readonly current: EmotionType;
    readonly intensity: number;
    readonly lastChange: Date;
  }

  export interface UserPreferences {
    readonly language: 'en' | 'ru' | 'es' | 'fr' | 'de';
    readonly emotionalIntensity: number;
    readonly voiceEnabled: boolean;
    readonly memoryRetention: 'session' | 'limited' | 'extended';
  }
}