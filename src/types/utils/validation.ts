/**
 * ============================================
 * EIC - Validation System Types v5.0
 * 🎯 Type-safe validation and error handling
 * ============================================
 */

import type { EmotionType } from '../core/emotions';

// === ERROR SYSTEM ===

/**
 * EIC Platform Error
 */
export class EICError extends Error {
  readonly code: string;
  readonly emotion: EmotionType | undefined;
  readonly context: string | undefined;
  readonly severity: 'low' | 'medium' | 'high' | 'critical';
  readonly recoverable: boolean;
  
  constructor(
    message: string, 
    code: string, 
    emotion?: EmotionType, 
    context?: string,
    severity: 'low' | 'medium' | 'high' | 'critical' = 'medium',
    recoverable: boolean = true
  ) {
    super(message);
    this.name = 'EICError';
    this.code = code;
    this.emotion = emotion;
    this.context = context;
    this.severity = severity;
    this.recoverable = recoverable;
  }
}

/**
 * Validation Result
 */
export interface ValidationResult {
  readonly valid: boolean;
  readonly errors: readonly ValidationError[];
  readonly warnings: readonly ValidationWarning[];
  readonly score: number;
}

/**
 * Validation Error
 */
export interface ValidationError {
  readonly field: string;
  readonly message: string;
  readonly code: string;
  readonly severity: 'error' | 'warning' | 'info';
}

/**
 * Validation Warning
 */
export interface ValidationWarning {
  readonly field: string;
  readonly message: string;
  readonly suggestion?: string;
  readonly impact: 'low' | 'medium' | 'high';
}