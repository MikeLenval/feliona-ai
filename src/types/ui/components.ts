/**
 * ============================================
 * EIC - UI Components Types v5.0
 * 🎯 React components with emotional intelligence
 * ============================================
 */

import React from 'react';
import type { CompanionId } from '../base';
import type { EmotionType, EmotionalIntensity, EmotionalState, EmotionalTheme } from '../core/emotions';
import type { CompanionInstance, SupportedLocale, CulturalAdaptation, LocalizedContent } from '../core/companions';
import type { Character } from '../core/companions';

// === REACT COMPONENT TYPES ===

/**
 * Emotionally enhanced React component
 */
export type EmotionalComponent<TProps = object> = React.ComponentType<TProps & {
  readonly emotion?: EmotionType;
  readonly emotionalState?: EmotionalState;
  readonly onEmotionChange?: (emotion: EmotionType) => void;
  readonly className?: string;
  readonly 'data-emotion'?: EmotionType;
}>;

/**
 * Hook with emotional state
 */
export type EmotionalHook<TReturn = unknown> = () => TReturn & {
  readonly emotion: EmotionType;
  readonly setEmotion: (emotion: EmotionType) => void;
  readonly emotionalHistory: readonly EmotionType[];
  readonly emotionalIntensity: EmotionalIntensity;
  readonly transitionEmotion: (to: EmotionType, duration?: number) => Promise<void>;
};

/**
 * Emotional context for React
 */
export interface EmotionalContext {
  readonly currentEmotion: EmotionType;
  readonly emotionalState: EmotionalState;
  readonly companion?: CompanionInstance;
  readonly theme: EmotionalTheme;
  readonly intensity: EmotionalIntensity;
  readonly updateEmotion: (emotion: EmotionType, intensity?: EmotionalIntensity) => void;
  readonly transitionTheme: (theme: EmotionalTheme) => void;
}

/**
 * Emotional provider component
 */
export type EmotionalProvider = React.ComponentType<{
  readonly children: React.ReactNode;
  readonly initialEmotion?: EmotionType;
  readonly initialTheme?: EmotionalTheme;
  readonly companion?: CompanionInstance;
}>;

// === MODAL COMPONENTS ===

/**
 * Base modal properties (enhanced)
 */
export interface ModalProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly title?: string;
  readonly description?: string;
  readonly children: React.ReactNode;
  readonly size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
  readonly emotion?: EmotionType;
  readonly closeOnBackdrop?: boolean;
  readonly showCloseButton?: boolean;
  readonly animation?: 'fade' | 'slide' | 'scale' | 'emotional';
  readonly priority?: 'low' | 'medium' | 'high' | 'critical';
}

/**
 * Waitlist modal properties
 */
export interface WaitlistModalProps extends Omit<ModalProps, 'children'> {
  readonly onSubmit: (data: WaitlistData) => void;
  readonly loading?: boolean;
  readonly validationErrors?: unknown; // Will be defined in utils/validation.ts
}

/**
 * Character selection modal properties
 */
export interface CharacterSelectionModalProps extends Omit<ModalProps, 'children'> {
  readonly characters: readonly Character[];
  readonly onSelect: (character: Character) => void;
  readonly currentSelection?: CompanionId;
  readonly filterOptions?: CharacterFilterOptions;
}

/**
 * Character filter options
 */
export interface CharacterFilterOptions {
  readonly category?: 'sfw' | 'nsfw' | 'all';
  readonly personality?: readonly string[];
  readonly emotions?: readonly EmotionType[];
  readonly complexity?: 'basic' | 'advanced' | 'expert' | 'all';
}

/**
 * Waitlist form data
 */
export interface WaitlistData {
  readonly email: string;
  readonly name?: string;
  readonly companionType?: string;
  readonly interests?: readonly string[];
  readonly source?: string;
  readonly referralCode?: string;
  readonly preferredLanguage?: SupportedLocale;
  readonly marketingConsent: boolean;
}

// === LOCALIZATION COMPONENTS ===

/**
 * Component with localization support
 */
export interface ComponentWithLocale {
  readonly locale: SupportedLocale;
  readonly translations?: LocalizedContent;
  readonly rtlSupport?: boolean;
  readonly culturalAdaptations?: readonly CulturalAdaptation[];
}