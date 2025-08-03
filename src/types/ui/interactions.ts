/**
 * ============================================
 * EIC - UI Interactions Types v5.0
 * 🎯 User interaction and gesture types
 * ============================================
 */

import type { EmotionType } from '../core/emotions';

// === INTERACTION TYPES ===

/**
 * Gesture Type
 */
export type GestureType = 
  | 'tap' | 'long-press' | 'swipe' | 'pinch' | 'rotate'
  | 'hover' | 'focus' | 'key-press' | 'voice-command';

/**
 * Interaction Event
 */
export interface InteractionEvent {
  readonly id: string;
  readonly type: GestureType;
  readonly timestamp: Date;
  readonly target: string;
  readonly emotion?: EmotionType;
  readonly data?: Readonly<Record<string, unknown>>;
}

/**
 * Gesture Handler
 */
export interface GestureHandler {
  readonly type: GestureType;
  readonly handler: (event: InteractionEvent) => void;
  readonly options?: GestureOptions;
}

/**
 * Gesture Options
 */
export interface GestureOptions {
  readonly threshold?: number;
  readonly duration?: number;
  readonly preventDefault?: boolean;
  readonly stopPropagation?: boolean;
  readonly emotionalResponse?: EmotionType;
}