/**
 * ============================================
 * EIC - AI Streaming System Types v5.0
 * 🎯 Real-time streaming and communication
 * ============================================
 */

import type { StreamId, CompanionId } from '../base';
import type { EmotionType } from '../core/emotions';

// === STREAMING SYSTEM ===

/**
 * Streaming Manager
 */
export interface StreamingManager {
  createStream: (type: StreamType, config: StreamConfig) => Promise<AIStream>;
  getActiveStreams: () => readonly AIStream[];
  terminateStream: (streamId: StreamId) => Promise<void>;
  
  // Events
  onStreamData: (callback: (data: StreamData) => void) => void;
  onStreamEnd: (callback: (streamId: StreamId) => void) => void;
  onStreamError: (callback: (error: StreamError) => void) => void;
}

/**
 * AI Stream
 */
export interface AIStream {
  readonly id: StreamId;
  readonly type: StreamType;
  readonly status: StreamStatus;
  
  // Methods
  read: () => Promise<StreamData | null>;
  cancel: () => Promise<void>;
  
  // Events
  onData: (callback: (data: StreamData) => void) => void;
  onEnd: (callback: () => void) => void;
  onError: (callback: (error: StreamError) => void) => void;
}

/**
 * Stream Type
 */
export type StreamType = 'text' | 'audio' | 'emotion' | 'animation' | 'mixed';

/**
 * Stream Status
 */
export type StreamStatus = 'idle' | 'streaming' | 'paused' | 'ended' | 'error';

/**
 * Stream Data
 */
export interface StreamData {
  readonly type: StreamType;
  readonly content: unknown;
  readonly metadata?: Readonly<Record<string, unknown>>;
  
  // EIC data
  readonly emotion?: EmotionType;
  readonly companionId?: CompanionId;
  readonly sequenceNumber?: number;
}

/**
 * Stream Error
 */
export interface StreamError {
  readonly code: string;
  readonly message: string;
  readonly fatal: boolean;
  
  // EIC context
  readonly streamId: StreamId;
  readonly companionId?: CompanionId;
}

/**
 * Stream Configuration
 */
export interface StreamConfig {
  readonly bufferSize?: number;
  readonly timeout?: number;
  readonly retryAttempts?: number;
  
  // EIC settings
  readonly emotionalSync?: boolean;
  readonly memoryIntegration?: boolean;
  readonly qualityMode?: 'low' | 'medium' | 'high';
}