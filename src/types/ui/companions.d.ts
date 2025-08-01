/**
 * ============================================
 * EIC - Companion Types (AI Personality & Communication)
 * Централизованные типы для AI-компаньонов, их стилей и предпочтений
 * ============================================
 */

/**
 * Черты личности компаньона (PersonalityTrait)
 */
export type PersonalityTrait =
  | 'empathetic'
  | 'nurturing'
  | 'intuitive'
  | 'supportive'
  | 'playful'
  | 'energetic'
  | 'optimistic'
  | 'spontaneous'
  | 'analytical'
  | 'curious'
  | 'patient'
  | 'knowledgeable';

/**
 * Стиль ответа компаньона (ResponseStyle)
 */
export type ResponseStyle = {
  verbosity: 'moderate' | 'detailed';
  formality: 'friendly' | 'casual';
  emotiveness: 'expressive' | 'balanced';
  humor: 'light' | 'playful' | 'witty';
};

/**
 * Коммуникационные предпочтения компаньона (CommunicationPrefs)
 */
export type CommunicationPrefs = {
  preferredTopics: string[];
  avoidedTopics: string[];
  responseSpeed: 'thoughtful' | 'instant' | 'deliberate';
  memoryReference: 'frequent' | 'moderate';
};

/**
 * MCP-инструменты компаньона (McpTool)
 */
export type McpTool =
  | 'emotion_change'
  | 'memory_store'
  | 'empathy_gesture'
  | 'voice_synthesis'
  | 'playful_animation'
  | 'surprise_gesture'
  | 'upbeat_voice'
  | 'thoughtful_gesture'
  | 'knowledge_synthesis'
  | 'mentor_voice';

// === МИНОРНЫЕ УЛУЧШЕНИЯ ===

/**
 * Профиль компаньона (композиция всех типов)
 */
export interface CompanionProfile {
  personalityTraits: PersonalityTrait[];
  responseStyle: ResponseStyle;
  communicationPrefs: CommunicationPrefs;
  availableTools: McpTool[];
}

/**
 * Константы для валидации
 */
export const PERSONALITY_TRAITS: readonly PersonalityTrait[] = [
  'empathetic', 'nurturing', 'intuitive', 'supportive',
  'playful', 'energetic', 'optimistic', 'spontaneous',
  'analytical', 'curious', 'patient', 'knowledgeable'
] as const;

export const MCP_TOOLS: readonly McpTool[] = [
  'emotion_change', 'memory_store', 'empathy_gesture', 'voice_synthesis',
  'playful_animation', 'surprise_gesture', 'upbeat_voice', 'thoughtful_gesture',
  'knowledge_synthesis', 'mentor_voice'
] as const;

/**
 * Type guards (простые)
 */
export function isPersonalityTrait(value: unknown): value is PersonalityTrait {
  return typeof value === 'string' && 
         (PERSONALITY_TRAITS as readonly string[]).includes(value);
}

export function isMcpTool(value: unknown): value is McpTool {
  return typeof value === 'string' && 
         (MCP_TOOLS as readonly string[]).includes(value);
}

/**
 * Factory для создания дефолтного профиля
 */
export function createDefaultProfile(): CompanionProfile {
  return {
    personalityTraits: ['empathetic', 'supportive'],
    responseStyle: {
      verbosity: 'moderate',
      formality: 'friendly',
      emotiveness: 'balanced',
      humor: 'light'
    },
    communicationPrefs: {
      preferredTopics: [],
      avoidedTopics: [],
      responseSpeed: 'thoughtful',
      memoryReference: 'moderate'
    },
    availableTools: ['emotion_change', 'memory_store', 'empathy_gesture']
  };
}