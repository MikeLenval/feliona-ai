/**
 * ============================================
 * UI Character Types
 * 🎭 Character display and interaction types для компонента Characters.tsx
 * ============================================
 */

import type { CompanionId } from '../base';
import type { CompanionType } from '../core/companions';
import type { EmotionType } from '../core/emotions';

// === TYPES ИСПОЛЬЗУЕМЫЕ В CHARACTERS COMPONENT ===

/**
 * Основной тип персонажа для компонента Characters
 * Используется в константе CHARACTERS_CONFIG
 */
export interface CharacterForComponent {
  readonly id: CompanionId;
  readonly name: string;
  readonly type: CompanionType;
  readonly description: string;
  readonly personality: Readonly<{
    traits: readonly string[];
    values: readonly string[];
    communication_style: 'formal' | 'casual' | 'playful' | 'intellectual' | 'emotional' | 'mysterious';
    emotional_intelligence: number;
    empathy_level: number;
  }>;
  readonly appearance: Readonly<{
    avatar_url: string;
    style: 'anime' | 'realistic' | 'artistic' | 'minimalist' | 'fantasy';
    primary_colors: readonly string[];
  }>;
  readonly capabilities: Readonly<{
    conversation: boolean;
    voice_synthesis: boolean;
    emotional_response: boolean;
    memory_formation: boolean;
  }>;
  readonly metadata: Readonly<{
    category: 'sfw' | 'nsfw';
    age_rating: 'teen' | 'adult';
    default_emotion: EmotionType;
    fantasy_race?: 'elf' | 'neko' | 'angel' | 'demon';
    adult_content?: boolean;
  }>;
}

/**
 * Категории фильтрации персонажей
 */
export type FilterCategory = 'all' | 'realistic' | 'fantasy' | 'sfw' | 'nsfw';

/**
 * Состояние фильтров персонажей
 */
export interface CharacterFilterState {
  readonly category: FilterCategory;
  readonly searchQuery: string;
}

/**
 * Количество персонажей по категориям
 */
export interface FilterCounts {
  readonly all: number;
  readonly realistic: number;
  readonly fantasy: number;
  readonly sfw: number;
  readonly nsfw: number;
}

/**
 * Лейблы для кнопок фильтрации
 */
export interface FilterLabels {
  readonly all: string;
  readonly realistic: string;
  readonly fantasy: string;
  readonly sfw: string;
  readonly nsfw: string;
}

// === COMPONENT PROPS ===

/**
 * Props для CharacterCard компонента
 */
export interface CharacterCardProps {
  readonly character: CharacterForComponent;
  readonly isHovered: boolean;
  readonly animationDelay: string;
  readonly onHover: (characterId: CompanionId | null) => void;
  readonly onSelect: (character: CharacterForComponent) => void;
}

/**
 * Props для FilterButton компонента
 */
export interface FilterButtonProps {
  readonly filter: FilterCategory;
  readonly isActive: boolean;
  readonly count: number;
  readonly onClick: (category: FilterCategory) => void;
}

/**
 * Props для основного Characters компонента
 */
export interface CharactersProps {
  readonly onCharacterSelect?: (character: CharacterForComponent) => void;
  readonly className?: string;
}

// === HANDLER TYPES ===

export type CharacterHoverHandler = (characterId: CompanionId | null) => void;
export type CharacterSelectHandler = (character: CharacterForComponent) => void;
export type FilterChangeHandler = (category: FilterCategory) => void;

// === ANALYTICS ===

export type CharacterAnalyticsTracker = (
  eventName: string, 
  characterId: string, 
  characterType: string
) => void;

// === APPEARANCE STYLES ===

export type AppearanceStyle = 'anime' | 'realistic' | 'artistic' | 'minimalist' | 'fantasy';

// === CARD VARIANTS ===

export type CardVariant = 'glass' | 'adult';

// === ANIMATION CONFIG ===

export interface CharactersAnimationConfig {
  readonly staggerMs: number;
  readonly emotionInterval: number;
}

// === CONSTANTS ===

export const CHARACTER_FILTER_LABELS: FilterLabels = {
  all: 'All',
  realistic: 'Realistic', 
  fantasy: 'Fantasy',
  sfw: 'Safe',
  nsfw: '18+ Only'
} as const;

// === TYPE GUARDS ===

export function isFilterCategory(value: unknown): value is FilterCategory {
  return typeof value === 'string' && 
    ['all', 'realistic', 'fantasy', 'sfw', 'nsfw'].includes(value);
}

export function isAppearanceStyle(value: unknown): value is AppearanceStyle {
  return typeof value === 'string' && 
    ['anime', 'realistic', 'artistic', 'minimalist', 'fantasy'].includes(value);
}

export function isFantasyRace(value: unknown): value is 'elf' | 'neko' | 'angel' | 'demon' {
  return typeof value === 'string' && 
    ['elf', 'neko', 'angel', 'demon'].includes(value);
}

// === LEGACY CHARACTER DISPLAY (для обратной совместимости) ===

export interface CharacterDisplayProps {
  readonly id: CompanionId;
  readonly type: CompanionType;
  readonly emotion: EmotionType;
  readonly size?: 'small' | 'medium' | 'large';
  readonly interactive?: boolean;
}

export interface CharacterAvatar {
  readonly url: string;
  readonly alt: string;
  readonly fallback?: string;
}

export interface CharacterGalleryItem {
  readonly id: CompanionId;
  readonly name: string;
  readonly avatar: CharacterAvatar;
  readonly type: CompanionType;
  readonly description: string;
  readonly featured?: boolean;
}
