/**
 * ============================================
 * EIC - AI Models System Types v5.0
 * 🎯 AI model management and inference
 * ============================================
 */

import type { ModelId, CompanionId, SessionId } from '../base';
import type { EmotionType } from '../core/emotions';
import type { RelationshipLevel } from '../core/relationships';

// === AI MODEL SYSTEM ===

/**
 * AI Model Manager
 */
export interface AIModelManager {
  loadModel: (modelConfig: AIModelConfig) => Promise<AIModelInstance>;
  unloadModel: (modelId: ModelId) => Promise<void>;
  
  // Inference
  generateResponse: (modelId: ModelId, prompt: string, config?: InferenceConfig) => Promise<AIResponse>;
  generateStream: (modelId: ModelId, prompt: string, config?: InferenceConfig) => Promise<ReadableStream<AIResponse>>;
  
  // State
  getLoadedModels: () => readonly AIModelInstance[];
  getModelMetrics: (modelId: ModelId) => AIModelMetrics;
}

/**
 * AI Model Configuration
 */
export interface AIModelConfig {
  readonly id: ModelId;
  readonly provider: 'openai' | 'anthropic' | 'local' | 'custom';
  readonly model: string;
  readonly apiKey?: string;
  readonly baseUrl?: string;
  
  // Parameters
  readonly temperature?: number;
  readonly maxTokens?: number;
  readonly topP?: number;
  readonly frequencyPenalty?: number;
  
  // EIC settings
  readonly emotionalAwareness?: boolean;
  readonly memoryIntegration?: boolean;
  readonly personalityConsistency?: number;
}

/**
 * AI Model Instance
 */
export interface AIModelInstance {
  readonly id: ModelId;
  readonly config: AIModelConfig;
  readonly status: AIModelStatus;
  readonly metrics: AIModelMetrics;
  
  // Methods
  generate: (prompt: string, config?: InferenceConfig) => Promise<AIResponse>;
  generateStream: (prompt: string, config?: InferenceConfig) => Promise<ReadableStream<AIResponse>>;
  
  // Lifecycle
  load: () => Promise<void>;
  unload: () => Promise<void>;
  
  // Events
  onResponse: (callback: (response: AIResponse) => void) => void;
  onError: (callback: (error: AIModelError) => void) => void;
}

/**
 * AI Model Status
 */
export type AIModelStatus = 'loading' | 'ready' | 'busy' | 'error' | 'unloaded';

/**
 * Inference Configuration
 */
export interface InferenceConfig {
  readonly temperature?: number;
  readonly maxTokens?: number;
  readonly stopSequences?: readonly string[];
  
  // EIC parameters
  readonly emotionalContext?: readonly EmotionType[];
  readonly personalityBias?: Readonly<Record<string, number>>;
  readonly memoryContext?: readonly string[];
  readonly relationshipLevel?: RelationshipLevel;
}

/**
 * AI Response
 */
export interface AIResponse {
  readonly text: string;
  readonly finishReason: 'stop' | 'length' | 'error';
  readonly usage?: Readonly<{
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  }>;
  
  // EIC metadata
  readonly emotionalTone?: EmotionType;
  readonly personalityAlignment?: number;
  readonly memoryReferences?: readonly string[];
  readonly confidence?: number;
}

/**
 * AI Model Metrics
 */
export interface AIModelMetrics {
  readonly totalRequests: number;
  readonly averageResponseTime: number;
  readonly errorRate: number;
  readonly tokenUsage: number;
  
  // EIC metrics
  readonly emotionalAccuracy?: number;
  readonly personalityConsistency?: number;
  readonly memoryRelevance?: number;
}

/**
 * AI Model Error
 */
export interface AIModelError {
  readonly code: string;
  readonly message: string;
  readonly details?: unknown;
  readonly retryable: boolean;
  
  // EIC context
  readonly companionId?: CompanionId;
  readonly emotionalContext?: EmotionType;
}

// === AI RUNTIME SYSTEM ===

/**
 * AI Runtime система
 */
export interface AIRuntime {
  readonly langGraph?: unknown; // Will be defined in langgraph.ts
  readonly mcpBridge?: unknown; // Will be defined in mcp.ts
  readonly companions?: ReadonlyMap<CompanionId, AICompanionInstance>;
  readonly streaming?: unknown; // Will be defined in streaming.ts
  readonly models?: AIModelManager;
}

/**
 * AI Companion Instance
 */
export interface AICompanionInstance {
  readonly modelId: ModelId;
  readonly langGraphId?: string;
  readonly mcpConnections: readonly string[];
  readonly currentContext: AIContext;
  readonly streamingActive: boolean;
  
  // Performance metrics
  readonly responseTime: number;
  readonly accuracy: number;
  readonly creativity: number;
  readonly empathy: number;
  
  // State
  readonly isProcessing: boolean;
  readonly lastResponse: Date;
  readonly errorCount: number;
  readonly successCount: number;
}

/**
 * AI Context
 */
export interface AIContext {
  readonly sessionId: SessionId;
  readonly conversationHistory: readonly AIMessage[];
  readonly emotionalContext: readonly EmotionType[];
  readonly relationshipLevel: RelationshipLevel;
  readonly personalityState: Readonly<Record<string, number>>;
  readonly memoryActivation: readonly string[];
  
  // Dynamic context
  readonly userMood?: EmotionType;
  readonly timeOfDay?: string;
  readonly conversationTopic?: string;
  readonly interactionMode?: 'text' | 'voice' | 'mixed';
}

/**
 * AI Message
 */
export interface AIMessage {
  readonly id: string;
  readonly type: 'user' | 'assistant' | 'system';
  readonly content: string;
  readonly timestamp: Date;
  
  // EIC metadata
  readonly emotion?: EmotionType;
  readonly companionId?: CompanionId;
  readonly relationshipLevel?: RelationshipLevel;
  readonly memoryTriggers?: readonly string[];
}

// === PERFORMANCE METRICS ===

/**
 * AI Performance Metrics
 */
export interface AIPerformanceMetrics {
  readonly responseTime: number;
  readonly throughput: number;
  readonly errorRate: number;
  readonly memoryUsage: number;
  
  // Model-specific
  readonly modelAccuracy: number;
  readonly emotionalConsistency: number;
  readonly personalityAlignment: number;
  
  // System-wide
  readonly concurrentSessions: number;
  readonly queueLength: number;
  readonly resourceUtilization: number;
}

/**
 * AI System Metrics
 */
export interface AISystemMetrics {
  readonly totalCompanions: number;
  readonly activeConversations: number;
  readonly averageResponseTime: number;
  readonly systemLoad: number;
  readonly memoryUsage: number;
  
  // Quality metrics
  readonly userSatisfaction: number;
  readonly emotionalAccuracy: number;
  readonly relationshipGrowth: number;
}

/**
 * AI Connection Status
 */
export interface AIConnectionStatus {
  readonly id: string;
  readonly type: 'llm' | 'mcp' | 'websocket' | 'streaming';
  readonly status: 'connected' | 'disconnected' | 'error' | 'connecting';
  readonly latency?: number;
  readonly lastActivity: Date;
}