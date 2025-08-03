/**
 * ============================================
 * EIC - UI Themes Types v5.0
 * 🎯 Theme system and visual styling
 * ============================================
 */

import type { CSSColor } from '../base';
import type { EmotionType } from '../core/emotions';

// === THEME SYSTEM ===

/**
 * Theme Configuration
 */
export interface ThemeConfig {
  readonly name: string;
  readonly emotion: EmotionType;
  readonly colors: ThemeColors;
  readonly animation: AnimationSettings;
  readonly spacing: SpacingSystem;
  readonly typography: TypographySystem;
}

/**
 * Theme Colors
 */
export interface ThemeColors {
  readonly primary: CSSColor;
  readonly secondary: CSSColor;
  readonly accent: CSSColor;
  readonly background: CSSColor;
  readonly surface: CSSColor;
  readonly text: CSSColor;
  readonly emotional: CSSColor;
}

/**
 * Animation Settings
 */
export interface AnimationSettings {
  readonly speed: 'slow' | 'normal' | 'fast';
  readonly intensity: 'minimal' | 'normal' | 'enhanced';
  readonly easing: string;
}

/**
 * Spacing System
 */
export interface SpacingSystem {
  readonly xs: string;
  readonly sm: string;
  readonly md: string;
  readonly lg: string;
  readonly xl: string;
}

/**
 * Typography System
 */
export interface TypographySystem {
  readonly fontFamily: string;
  readonly fontSizes: Readonly<Record<string, string>>;
  readonly fontWeights: Readonly<Record<string, number>>;
  readonly lineHeights: Readonly<Record<string, number>>;
}