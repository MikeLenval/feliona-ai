/**
 * ============================================
 * EIC - MCP (Model Context Protocol) Types v5.0 (Enhanced)
 * 🎯 Complete MCP integration and tool management
 * ============================================
 */

import type { EmotionType } from '../core/emotions';
import type { RelationshipLevel } from '../core/relationships';
import type { JSONSchema } from '../base';

// === MCP SYSTEM ===

/**
 * MCP Bridge
 */
export interface MCPBridge {
  connect: (serverConfig: MCPServerConfig) => Promise<MCPConnection>;
  disconnect: (connectionId: string) => Promise<void>;
  
  // Tools
  getAvailableTools: (connectionId: string) => Promise<readonly MCPTool[]>;
  callTool: (connectionId: string, toolName: string, params: unknown) => Promise<MCPResult>;
  
  // Events
  onToolResult: (callback: (result: MCPResult) => void) => void;
  onConnectionStatus: (callback: (status: MCPConnectionStatus) => void) => void;
  
  // State
  getConnections: () => readonly MCPConnection[];
  getConnectionStatus: (connectionId: string) => MCPConnectionStatus;
}

/**
 * MCP Bridge Implementation (Enhanced with runtime state)
 */
export interface MCPBridgeImplementation extends MCPBridge {
  // Runtime state
  isConnected: boolean;
  lastHeartbeat?: Date;
  connectionAttempts: number;
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  
  // Performance metrics
  averageResponseTime: number;
  lastResponseTime: number;
  connectionUptime: number;
  
  // EIC-specific runtime data
  emotionalContext?: EmotionType;
  companionBindings: Map<string, MCPCompanionBinding>;
  
  // Connection management
  reconnect(): Promise<boolean>;
  healthCheck(): Promise<MCPHealthStatus>;
  getMetrics(): MCPBridgeMetrics;
}

/**
 * MCP Companion Binding (связь с компаньоном)
 */
export interface MCPCompanionBinding {
  companionId: string;
  bindingId: string;
  createdAt: Date;
  lastUsed: Date;
  
  // Configuration
  allowedTools: string[];
  emotionalPermissions: EmotionType[];
  relationshipRequirement?: RelationshipLevel;
  
  // Metrics
  toolUsageCount: Record<string, number>;
  successRate: number;
  averageExecutionTime: number;
}

/**
 * MCP Health Status
 */
export interface MCPHealthStatus {
  isHealthy: boolean;
  uptime: number;
  memoryUsage: number;
  responseTime: number;
  
  // Issues
  issues: Array<{
    severity: 'low' | 'medium' | 'high' | 'critical';
    message: string;
    timestamp: Date;
  }>;
  
  // Recommendations
  recommendations: string[];
}

/**
 * MCP Bridge Metrics
 */
export interface MCPBridgeMetrics {
  totalConnections: number;
  activeConnections: number;
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  
  averageResponseTime: number;
  uptime: number;
  
  // Tool usage statistics
  toolUsageStats: Record<string, {
    calls: number;
    successRate: number;
    averageTime: number;
  }>;
  
  // EIC-specific metrics
  emotionalContextUsage: Record<EmotionType, number>;
  companionInteractions: Record<string, number>;
}

/**
 * MCP Server Configuration
 */
export interface MCPServerConfig {
  readonly name: string;
  readonly command: string;
  readonly args: readonly string[];
  readonly env?: Readonly<Record<string, string>>;
  readonly transport: 'stdio' | 'websocket' | 'http';
  
  // EIC settings
  readonly companionCompatible?: readonly string[];
  readonly emotionalTools?: boolean;
  readonly memoryAccess?: boolean;
}

/**
 * MCP Connection
 */
export interface MCPConnection {
  readonly id: string;
  readonly serverConfig: MCPServerConfig;
  readonly status: MCPConnectionStatus;
  readonly connectedAt: Date;
  readonly lastActivity?: Date;
  
  // Methods
  callTool: (toolName: string, params: unknown) => Promise<MCPResult>;
  getTools: () => Promise<readonly MCPTool[]>;
  disconnect: () => Promise<void>;
}

/**
 * MCP Connection Status
 */
export type MCPConnectionStatus = 
  | 'connecting' 
  | 'connected' 
  | 'disconnected' 
  | 'error' 
  | 'reconnecting';

/**
 * MCP Tool
 */
export interface MCPTool {
  readonly name: string;
  readonly description: string;
  readonly inputSchema: JSONSchema;
  readonly outputSchema?: JSONSchema;
  
  // EIC extensions
  readonly emotionalImpact?: readonly EmotionType[];
  readonly memoryRequired?: boolean;
  readonly relationshipLevel?: RelationshipLevel;
  readonly companionSpecific?: boolean;
}

/**
 * MCP Result
 */
export interface MCPResult {
  readonly success: boolean;
  readonly output?: unknown;
  readonly error?: string;
  readonly executionTime: number;
  readonly timestamp: Date;
  
  // EIC-specific results
  readonly emotionalChanges?: readonly EmotionType[];
  readonly memoryUpdates?: readonly string[];
  readonly relationshipImpact?: number;
}

/**
 * MCP Error Context
 */
export interface MCPErrorContext {
  connectionId: string;
  toolName?: string;
  errorType: 'connection' | 'tool_execution' | 'validation' | 'timeout';
  message: string;
  timestamp: Date;
  
  // Context information
  requestParams?: unknown;
  companionContext?: {
    companionId: string;
    emotion: EmotionType;
    relationshipLevel: RelationshipLevel;
  };
  
  // Recovery information
  recoverable: boolean;
  retryCount: number;
  suggestedAction?: string;
}
