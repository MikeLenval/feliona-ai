/**
 * EIC Types - Essential Exports Only
 * 🎯 Только то, что РЕАЛЬНО используется в компонентах
 */

// === SINGLE SOURCE OF TRUTH ===
import type { EIC } from './globals';

// === EXPORT EIC NAMESPACE ===
export type { EIC };

// === CORE TYPES (что реально используется в UI) ===
export type EmotionType = EIC.EmotionType;
export type CompanionType = EIC.CompanionType;
export type RelationshipLevel = EIC.RelationshipLevel;

// === MAIN INTERFACES (основные сущности) ===
export type Character = EIC.Character;
export type CompanionInstance = EIC.CompanionInstance;
export type UserPreferences = EIC.UserPreferences;
export type EmotionalState = EIC.EmotionalState;

// === UI TYPES (добавить этот блок) ===
export type {
  PersonalityTrait,
  ResponseStyle,
  CommunicationPrefs,
  McpTool,
} from './ui';

// === AI ESSENTIALS (минимум для работы) ===
export interface AIConfig {
  provider: 'openai' | 'anthropic' | 'custom';
  model: string;
  apiKey?: string;
  baseUrl?: string; // For custom
  temperature: number;
  maxTokens: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  emotion?: EmotionType;
  timestamp: Date;
}

export interface MemoryEntry {
  id: string;
  content: string;
  emotion: EmotionType;
  importance: number; // 0-1
  timestamp: Date;
}

// === VALIDATION (только essentials) ===
const EMOTIONS = [
  'warmth', 'trust', 'wisdom', 'mystery', 'joy', 'calm',
  'curiosity', 'empathy', 'excitement', 'melancholy', 'love', 'serenity'
] as const;

export function isValidEmotion(value: unknown): value is EmotionType {
  return typeof value === 'string' && EMOTIONS.includes(value as EmotionType);
}

// === FACTORIES (только самые нужные) ===
export function createMessage(
  role: 'user' | 'assistant',
  content: string,
  emotion?: EmotionType
): ChatMessage {
  const message: ChatMessage = {
    id: crypto.randomUUID(),
    role,
    content,
    timestamp: new Date()
  };
  
  // Добавляем emotion только если оно определено
  if (emotion !== undefined) {
    message.emotion = emotion;
  }
  
  return message;
}

export function createMemory(
  content: string,
  emotion: EmotionType,
  importance = 0.5
): MemoryEntry {
  return {
    id: crypto.randomUUID(),
    content,
    emotion,
    importance: Math.max(0, Math.min(1, importance)),
    timestamp: new Date()
  };
}

// === DEFAULTS ===
export const DEFAULT_EMOTION: EmotionType = 'warmth';
export const DEFAULT_AI_CONFIG: AIConfig = {
  provider: 'openai',
  model: 'gpt-4o-mini',
  temperature: 0.7,
  maxTokens: 1000
};

/*
 * Всё что РЕАЛЬНО нужно для работы приложения.
 * Остальное - over-engineering.
 */