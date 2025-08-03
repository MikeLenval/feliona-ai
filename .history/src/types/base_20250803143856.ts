/**
 * ============================================
 * Base Types
 * 🎯 Fundamental type definitions
 * ============================================
 */

// === BASIC ID TYPES ===
export type CompanionId = string;
export type UserId = string;
export type SessionId = string;
export type ModelId = string;
export type MessageId = string;

// === COMMON UTILITY TYPES ===
export type Timestamp = number;
export type Optional<T> = T | undefined;
export type Nullable<T> = T | null;
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

// === BASIC CONFIGURATION ===
export interface BaseConfig {
  readonly id: string;
  readonly name: string;
  readonly description?: string;
  readonly enabled?: boolean;
}

// === SUPPORTED LANGUAGES ===
export type SupportedLanguage = 'en' | 'ru' | 'es' | 'fr' | 'de';

// === COMMON ENUMS ===
export type LogLevel = 'debug' | 'info' | 'warn' | 'error';
export type Environment = 'development' | 'production' | 'test';
