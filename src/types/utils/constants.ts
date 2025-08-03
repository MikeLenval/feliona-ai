/**
 * ============================================
 * EIC - Constants and Web API Extensions v5.0
 * 🎯 Modern web APIs and system constants
 * ============================================
 */

import type { CSSColor } from '../base';
import type { EmotionType, EmotionalIntensity } from '../core/emotions';

// === MODERN WEB API EXTENSIONS ===

/**
 * Container Query Context
 */
export interface ContainerQueryContext {
  readonly containerName: string;
  readonly containerType: 'size' | 'inline-size' | 'block-size' | 'style' | 'state';
  readonly currentQuery: string;
  readonly matches: boolean;
  readonly subscribe: (callback: (matches: boolean) => void) => () => void;
}

/**
 * Feature Support Detection
 */
export interface FeatureSupport {
  readonly containerQueries: boolean;
  readonly viewTransitions: boolean;
  readonly cssAnchorPositioning: boolean;
  readonly backdropFilter: boolean;
  readonly webGL: boolean;
  readonly webGL2: boolean;
  readonly webGPU: boolean;
  readonly fileSystemAccess: boolean;
  readonly webLocks: boolean;
  readonly computePressure: boolean;
  readonly cssNesting: boolean;
  readonly cssSubgrid: boolean;
  readonly cssLogicalProperties: boolean;
}

/**
 * Progressive Enhancement Configuration
 */
export interface ProgressiveEnhancement {
  readonly baseline: React.ComponentType;
  readonly enhanced?: React.ComponentType;
  readonly condition: () => boolean;
  readonly fallback?: React.ComponentType;
}

// === CSS VARIABLE TYPES ===

/**
 * Complete CSS emotional variables interface
 */
export interface CSSEmotionalVariables {
  readonly '--primary-warmth': CSSColor;
  readonly '--primary-trust': CSSColor;
  readonly '--primary-wisdom': CSSColor;
  readonly '--primary-mystery': CSSColor;
  readonly '--primary-joy': CSSColor;
  readonly '--primary-calm': CSSColor;
  readonly '--gradient-emotional': string;
  readonly '--gradient-trust': string;
  readonly '--gradient-wisdom': string;
  readonly '--gradient-hero': string;
  readonly '--emotional-intensity': `${number}`;
  readonly '--dynamic-primary': CSSColor;
  readonly '--dynamic-secondary': CSSColor;
}

/**
 * Strict emotion-based CSS variable names
 */
export type StrictEmotionVar = `--emotion-${EmotionType}`;
export type StrictColorVar = `--color-${string}`;
export type StrictSpaceVar = `--space-${string}`;

// === ANIMATION TYPES ===

/**
 * Easing function type
 */
export type EasingFunction = (t: number) => number;

/**
 * Animation options (enhanced)
 */
export interface AnimationOptions {
  readonly duration?: number;
  readonly delay?: number;
  readonly easing?: 'smooth' | 'bounce' | 'emotion' | 'comfort' | EasingFunction;
  readonly repeat?: boolean | number;
  readonly direction?: 'normal' | 'reverse' | 'alternate' | 'alternate-reverse';
  readonly fillMode?: 'none' | 'forwards' | 'backwards' | 'both';
  readonly emotion?: EmotionType;
  readonly intensity?: EmotionalIntensity;
}

/**
 * Animation keyframe
 */
export interface AnimationKeyframe {
  readonly time: number; // 0-1
  readonly transform?: string;
  readonly opacity?: number;
  readonly color?: CSSColor;
  readonly scale?: number;
  readonly rotation?: readonly [number, number, number];
  readonly position?: readonly [number, number, number];
  readonly morphTargets?: Readonly<Record<string, number>>;
}

/**
 * Emotional animation track
 */
export interface EmotionalAnimationTrack {
  readonly emotion: EmotionType;
  readonly keyframes: readonly AnimationKeyframe[];
  readonly options: AnimationOptions;
  readonly blendMode?: 'override' | 'additive' | 'multiply';
}