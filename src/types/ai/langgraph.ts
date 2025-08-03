/**
 * ============================================
 * EIC - LangGraph System Types v5.0 (Enhanced)
 * 🎯 Complete LangGraph integration and workflow management
 * ============================================
 */

import type { CompanionId } from '../base';
import type { EmotionType } from '../core/emotions';
import type { RelationshipLevel } from '../core/relationships';

// === LANGGRAPH SYSTEM ===

/**
 * LangGraph Runtime
 */
export interface LangGraphRuntime {
  createGraph: (config: LangGraphConfig) => Promise<LangGraphInstance>;
  loadGraph: (path: string) => Promise<LangGraphInstance>;
  runGraph: (graphId: string, input: unknown) => Promise<LangGraphResult>;
  
  // Status и monitoring
  getActiveGraphs: () => readonly LangGraphInstance[];
  getGraphMetrics: (graphId: string) => LangGraphMetrics;
  
  // Lifecycle
  initialize: () => Promise<void>;
  shutdown: () => Promise<void>;
}

/**
 * LangGraph Configuration
 */
export interface LangGraphConfig {
  readonly name: string;
  readonly description?: string;
  readonly nodes: readonly LangGraphNodeConfig[];
  readonly edges: readonly LangGraphEdgeConfig[];
  readonly entryPoint: string;
  readonly variables?: Readonly<Record<string, unknown>>;
  
  // EIC extensions
  readonly companionId?: CompanionId;
  readonly emotionalProfile?: readonly EmotionType[];
  readonly memoryIntegration?: boolean;
  readonly relationshipAware?: boolean;
}

/**
 * LangGraph Node Configuration
 */
export interface LangGraphNodeConfig {
  readonly id: string;
  readonly type: 'action' | 'condition' | 'parallel' | 'human';
  readonly name?: string;
  readonly description?: string;
  
  // Node logic
  readonly executor?: (context: LangGraphExecutionContext) => Promise<unknown>;
  readonly condition?: (context: LangGraphExecutionContext) => Promise<boolean>;
  
  // EIC-specific
  readonly emotionalTriggers?: readonly EmotionType[];
  readonly memoryAccess?: boolean;
  readonly companionSpecific?: boolean;
}

/**
 * LangGraph Node Implementation (Enhanced with runtime state)
 */
export interface LangGraphNodeImplementation extends LangGraphNodeConfig {
  // Runtime properties
  isActive: boolean;
  lastExecution?: Date;
  executionCount: number;
  averageExecutionTime: number;
  errorCount: number;
  
  // EIC-specific runtime data
  emotionalState?: EmotionType;
  memoryAccessRuntime?: {
    lastAccessed: Date;
    accessCount: number;
    relevantMemories: string[];
  };
  
  // Performance metrics
  performance: {
    successRate: number;
    averageLatency: number;
    resourceUsage: number;
  };
}

/**
 * LangGraph Edge Configuration
 */
export interface LangGraphEdgeConfig {
  readonly id: string;
  readonly from: string;
  readonly to: string;
  readonly condition?: (context: LangGraphExecutionContext) => Promise<boolean>;
  readonly weight?: number;
  
  // EIC-specific routing
  readonly emotionalRouting?: Readonly<Record<EmotionType, string>>;
  readonly relationshipRouting?: Readonly<Record<RelationshipLevel, string>>;
}

/**
 * LangGraph Edge Implementation (Enhanced with runtime state)
 */
export interface LangGraphEdgeImplementation extends LangGraphEdgeConfig {
  // Runtime properties
  traversalCount: number;
  lastTraversal?: Date;
  isBlocked: boolean;
  
  // EIC-specific edge data
  emotionalHistory: Array<{
    emotion: EmotionType;
    timestamp: Date;
    success: boolean;
  }>;
  
  // Conditional evaluation cache
  conditionCache?: {
    lastEvaluation: Date;
    result: boolean;
    context: Record<string, unknown>;
  };
}

/**
 * LangGraph Execution Context
 */
export interface LangGraphExecutionContext {
  readonly graphId: string;
  readonly executionId: string;
  readonly currentNode: string;
  readonly variables: Readonly<Record<string, unknown>>;
  
  // EIC context
  readonly companionId?: CompanionId;
  readonly currentEmotion?: EmotionType;
  readonly relationshipLevel?: RelationshipLevel;
  readonly memoryContext?: readonly string[];
  
  // Runtime state
  readonly startTime: Date;
  readonly executionPath: readonly string[];
  readonly nodeStates: Readonly<Record<string, unknown>>;
  
  // Performance tracking
  readonly nodeExecutionTimes: Readonly<Record<string, number>>;
  readonly totalExecutionTime: number;
  
  // Error handling
  readonly errors: readonly LangGraphExecutionError[];
  readonly warnings: readonly string[];
}

/**
 * LangGraph Execution Error
 */
export interface LangGraphExecutionError {
  readonly nodeId: string;
  readonly message: string;
  readonly timestamp: Date;
  readonly context?: Readonly<Record<string, unknown>>;
  readonly recoverable: boolean;
  readonly errorType: 'runtime' | 'validation' | 'memory' | 'emotion';
}

/**
 * LangGraph Instance
 */
export interface LangGraphInstance {
  readonly id: string;
  readonly config: LangGraphConfig;
  readonly status: 'idle' | 'running' | 'paused' | 'completed' | 'error';
  readonly createdAt: Date;
  readonly lastRun?: Date;
  
  // Methods
  run: (input: unknown) => Promise<LangGraphResult>;
  pause: () => Promise<void>;
  resume: () => Promise<void>;
  stop: () => Promise<void>;
  
  // State access
  getState: () => Readonly<Record<string, unknown>>;
  setState: (state: Record<string, unknown>) => Promise<void>;
}

/**
 * LangGraph Result
 */
export interface LangGraphResult {
  readonly executionId: string;
  readonly success: boolean;
  readonly output: unknown;
  readonly executionTime: number;
  readonly nodesExecuted: readonly string[];
  readonly errors: readonly LangGraphExecutionError[];
  
  // EIC-specific results
  readonly emotionalTransitions?: readonly EmotionType[];
  readonly memoryUpdates?: readonly string[];
  readonly relationshipChanges?: RelationshipLevel;
}

/**
 * LangGraph Metrics
 */
export interface LangGraphMetrics {
  readonly totalExecutions: number;
  readonly successRate: number;
  readonly averageExecutionTime: number;
  readonly nodeMetrics: Readonly<Record<string, {
    executions: number;
    successRate: number;
    averageTime: number;
  }>>;
  
  // EIC-specific metrics
  readonly emotionalDistribution: Readonly<Record<EmotionType, number>>;
  readonly memoryAccessFrequency: number;
  readonly relationshipImpact: number;
}
