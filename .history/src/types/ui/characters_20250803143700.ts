/**
 * ============================================
 * UI Character Types
 * 🎭 Character display and interaction types
 * ============================================
 */

import type { CompanionId, CompanionType } from '../core/companions';
import type { EmotionType } from '../core/emotions';

// === CHARACTER DISPLAY ===
export interface CharacterDisplayProps {
  readonly id: CompanionId;
  readonly type: CompanionType;
  readonly emotion: EmotionType;
  readonly size?: 'small' | 'medium' | 'large';
  readonly interactive?: boolean;
}

// === CHARACTER AVATAR ===
export interface CharacterAvatar {
  readonly url: string;
  readonly alt: string;
  readonly fallback?: string;
}

// === CHARACTER GALLERY ===
export interface CharacterGalleryItem {
  readonly id: CompanionId;
  readonly name: string;
  readonly avatar: CharacterAvatar;
  readonly type: CompanionType;
  readonly description: string;
  readonly featured?: boolean;
}
