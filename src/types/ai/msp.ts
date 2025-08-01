/**
 * EIC MCP Types - Essential Only
 * 🎯 Только то, что РЕАЛЬНО нужно для MCP интеграции
 */

import type { EIC } from '../../../types/globals';

// === CORE MCP TYPES ===

/**
 * MCP Action (основная единица работы)
 */
export interface MCPAction {
  id: string;
  type: MCPActionType;
  companionId: string;
  payload: Record<string, unknown>;
  status: MCPActionStatus;
  timestamp: Date;
  
  // EIC context (essential)
  emotionalContext?: EIC.EmotionType;
  relationshipLevel?: EIC.RelationshipLevel;
}

export type MCPActionType = 
  | 'emotion_change'
  | 'animation_trigger'
  | 'voice_synthesis'
  | 'memory_store'
  | 'custom';

export type MCPActionStatus = 
  | 'pending'
  | 'executing'
  | 'completed'
  | 'failed';

/**
 * MCP Connection (упрощенная)
 */
export interface MCPConnection {
  id: string;
  status: 'connected' | 'disconnected' | 'error';
  serverName: string;
  lastActivity: Date;
  
  // Core methods
  execute(action: MCPAction): Promise<MCPResult>;
  disconnect(): Promise<void>;
}

/**
 * MCP Result
 */
export interface MCPResult {
  success: boolean;
  data?: unknown;
  error?: string;
  executionTime: number;
  
  // EIC feedback
  emotionalImpact?: EIC.EmotionType;
}

/**
 * MCP Event (для уведомлений)
 */
export interface MCPEvent {
  id: string;
  type: 'action_completed' | 'connection_changed' | 'error';
  companionId?: string;
  data: Record<string, unknown>;
  timestamp: Date;
}

// === MCP MANAGER ===

/**
 * Основной MCP менеджер
 */
export interface MCPManager {
  // Connection management
  connect(serverConfig: MCPServerConfig): Promise<MCPConnection>;
  disconnect(connectionId: string): Promise<void>;
  getConnections(): MCPConnection[];
  
  // Action execution
  executeAction(action: MCPAction): Promise<MCPResult>;
  
  // Event handling
  onEvent(callback: (event: MCPEvent) => void): void;
  
  // Health check
  getStatus(): MCPManagerStatus;
}

export interface MCPServerConfig {
  name: string;
  command: string;
  args: string[];
  timeout: number;
}

export interface MCPManagerStatus {
  totalConnections: number;
  activeConnections: number;
  totalActions: number;
  successRate: number;
  averageResponseTime: number;
}

// === UTILITY FUNCTIONS ===

/**
 * Create MCP action
 */
export function createMCPAction(
  type: MCPActionType,
  companionId: string,
  payload: Record<string, unknown> = {}
): MCPAction {
  return {
    id: crypto.randomUUID(),
    type,
    companionId,
    payload,
    status: 'pending',
    timestamp: new Date()
  };
}

/**
 * Validate MCP payload
 */
export function validateMCPPayload(
  type: MCPActionType,
  payload: Record<string, unknown>
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  switch (type) {
    case 'emotion_change':
      if (!payload.emotion || typeof payload.emotion !== 'string') {
        errors.push('emotion is required');
      }
      break;
      
    case 'voice_synthesis':
      if (!payload.text || typeof payload.text !== 'string') {
        errors.push('text is required');
      }
      break;
      
    case 'memory_store':
      if (!payload.content || typeof payload.content !== 'string') {
        errors.push('content is required');
      }
      break;
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Create emotion change action
 */
export function createEmotionChangeAction(
  companionId: string,
  emotion: EIC.EmotionType,
  intensity: number = 50
): MCPAction {
  return createMCPAction('emotion_change', companionId, {
    emotion,
    intensity: Math.max(0, Math.min(100, intensity))
  });
}

/**
 * Create voice synthesis action
 */
export function createVoiceSynthesisAction(
  companionId: string,
  text: string,
  voice?: string
): MCPAction {
  const payload: Record<string, unknown> = { text };
  if (voice) payload.voice = voice;
  
  return createMCPAction('voice_synthesis', companionId, payload);
}

/**
 * Create memory store action
 */
export function createMemoryStoreAction(
  companionId: string,
  content: string,
  importance: number = 0.5
): MCPAction {
  return createMCPAction('memory_store', companionId, {
    content,
    importance: Math.max(0, Math.min(1, importance))
  });
}

// === CONSTANTS ===

export const MCP_DEFAULTS = {
  CONNECTION_TIMEOUT: 10000,
  ACTION_TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3,
  MAX_CONNECTIONS: 5
} as const;

export const MCP_ERRORS = {
  CONNECTION_FAILED: 'Failed to connect to MCP server',
  ACTION_TIMEOUT: 'MCP action timed out',
  INVALID_PAYLOAD: 'Invalid action payload',
  SERVER_ERROR: 'MCP server error'
} as const;

/*
 * Всё что РЕАЛЬНО нужно для MCP интеграции.
 * Focused, simple, maintainable.
 */