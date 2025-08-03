/**
 * EIC - Global Type Extensions v1.0
 * 🌍 Global type extensions and namespace declarations
 */

// === GLOBAL EXTENSIONS ===
declare global {
  interface Window {
    EIC?: {
      companions: readonly unknown[];
      currentEmotion: string;
    };
  }
}

// === NAMESPACE EXPORT (для import type { EIC }) ===
export namespace EIC {
  export type CompanionId = import('./base').CompanionId;
  export type UserId = import('./base').UserId;
  export type SessionId = import('./base').SessionId;
  
  export type EmotionType = import('./core/emotions').EmotionType;
  export type CompanionType = import('./core/companions').CompanionType;
  export type RelationshipLevel = import('./core/relationships').RelationshipLevel;

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