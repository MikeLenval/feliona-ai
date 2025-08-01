/**
 * EIC LangGraph Types - Essential Only
 * 🎯 Только то, что РЕАЛЬНО нужно для LangGraph интеграции
 */

import type { EIC } from '../globals';

// === CORE LANGGRAPH TYPES ===

/**
 * Graph Execution (основная операция)
 */
export interface GraphExecution {
  id: string;
  graphId: string;
  status: GraphStatus;
  currentNode: string;
  startTime: Date;
  
  // EIC context (essential)
  companionId?: string;
  emotion?: EIC.EmotionType;
  relationshipLevel?: EIC.RelationshipLevel;
  
  // Simple state
  variables: Record<string, unknown>;
  errors: string[];
}

export type GraphStatus = 
  | 'running'
  | 'completed'
  | 'failed'
  | 'paused';

/**
 * Graph Node (упрощенный)
 */
export interface GraphNode {
  id: string;
  type: NodeType;
  name: string;
  config: Record<string, unknown>;
  
  // EIC integration
  emotionalWeight?: number; // 0-1
  memoryAccess?: boolean;
  relationshipGating?: EIC.RelationshipLevel;
}

export type NodeType = 
  | 'emotion_analysis'
  | 'memory_retrieval'
  | 'personality_adaptation'
  | 'llm_response'
  | 'custom';

/**
 * Graph Edge (простой)
 */
export interface GraphEdge {
  from: string;
  to: string;
  condition?: string;
  
  // EIC conditions
  emotionTrigger?: EIC.EmotionType;
  relationshipRequired?: EIC.RelationshipLevel;
}

/**
 * Graph Configuration
 */
export interface GraphConfig {
  id: string;
  name: string;
  nodes: GraphNode[];
  edges: GraphEdge[];
  entryPoint: string;
}

// === GRAPH EXECUTOR ===

/**
 * Простой исполнитель графов
 */
export interface GraphExecutor {
  // Core operations
  execute(config: GraphConfig, input: GraphInput): Promise<GraphResult>;
  pause(executionId: string): Promise<void>;
  resume(executionId: string): Promise<void>;
  
  // Status
  getExecution(executionId: string): Promise<GraphExecution | null>;
  getActiveExecutions(): Promise<GraphExecution[]>;
}

/**
 * Graph Input
 */
export interface GraphInput {
  message: string;
  companionId: string;
  emotion?: EIC.EmotionType;
  context?: Record<string, unknown>;
}

/**
 * Graph Result
 */
export interface GraphResult {
  success: boolean;
  output?: unknown;
  error?: string;
  executionTime: number;
  
  // EIC results
  finalEmotion?: EIC.EmotionType;
  memoryUpdates?: string[];
}

// === UTILITY FUNCTIONS ===

/**
 * Create emotion analysis node
 */
export function createEmotionNode(id: string): GraphNode {
  return {
    id,
    type: 'emotion_analysis',
    name: 'Emotion Analysis',
    config: { model: 'eic-emotion-classifier' },
    emotionalWeight: 1.0,
    memoryAccess: true
  };
}

/**
 * Create memory node
 */
export function createMemoryNode(id: string, operation: 'retrieve' | 'store'): GraphNode {
  return {
    id,
    type: 'memory_retrieval',
    name: `Memory ${operation}`,
    config: { operation, maxResults: 10 },
    memoryAccess: true
  };
}

/**
 * Create LLM response node
 */
export function createLLMNode(id: string, model: string = 'gpt-4o-mini'): GraphNode {
  return {
    id,
    type: 'llm_response',
    name: 'LLM Response',
    config: { model, temperature: 0.7, maxTokens: 1000 },
    emotionalWeight: 0.8
  };
}

/**
 * Create simple conversation graph
 */
export function createConversationGraph(): GraphConfig {
  return {
    id: 'conversation-' + Date.now(),
    name: 'Basic Conversation',
    nodes: [
      createEmotionNode('emotion'),
      createMemoryNode('memory', 'retrieve'),
      createLLMNode('response')
    ],
    edges: [
      { from: 'emotion', to: 'memory' },
      { from: 'memory', to: 'response' }
    ],
    entryPoint: 'emotion'
  };
}

/**
 * Validate graph configuration
 */
export function validateGraph(config: GraphConfig): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  // Basic checks
  if (!config.entryPoint) {
    errors.push('Entry point is required');
  }
  
  if (config.nodes.length === 0) {
    errors.push('Graph must have at least one node');
  }
  
  // Check entry point exists
  if (!config.nodes.find(n => n.id === config.entryPoint)) {
    errors.push('Entry point node not found');
  }
  
  // Check edge references
  for (const edge of config.edges) {
    if (!config.nodes.find(n => n.id === edge.from)) {
      errors.push(`Edge references unknown node: ${edge.from}`);
    }
    if (!config.nodes.find(n => n.id === edge.to)) {
      errors.push(`Edge references unknown node: ${edge.to}`);
    }
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}

/*
 * Всё что РЕАЛЬНО нужно для LangGraph интеграции.
 * Simple, focused, maintainable.
 */