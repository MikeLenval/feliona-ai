/**
 * ============================================
 * Feliona AI - Relationship Levels Configuration
 * 💕 6 уровней отношений с конкретными данными
 * ============================================
 */

import type { RelationshipLevel } from '@/types';

// === RELATIONSHIP LEVELS CONFIG ===

export const RELATIONSHIP_LEVELS_CONFIG = [
  {
    id: 'stranger' as RelationshipLevel,
    level: 1,
    icon: '👋',
    name: 'Stranger',
    description: 'Just getting to know each other',
    points: 0,
    pointsRequired: 0,
    color: 'text-gray-400',
    position: 'left' as const,
    isAdult: false,
    isSpecial: false,
    features: [
      'Basic conversation',
      'Simple questions',
      'General topics only'
    ],
    emotionalAccess: ['trust', 'calm'] as const,
    contentRating: 'G' as const,
    unlocks: [
      {
        type: 'feature' as const,
        name: 'Basic Chat',
        description: 'Simple conversations and greetings',
        icon: '💬'
      }
    ],
    restrictions: [
      'No personal questions',
      'Limited emotional range',
      'SFW content only'
    ]
  },
  {
    id: 'acquaintance' as RelationshipLevel,
    level: 2,
    icon: '😊',
    name: 'Acquaintance',
    description: 'Building initial trust',
    points: 50,
    pointsRequired: 50,
    color: 'text-blue-400',
    position: 'right' as const,
    isAdult: false,
    isSpecial: false,
    features: [
      'Personal preferences',
      'Light humor',
      'Shared interests'
    ],
    emotionalAccess: ['trust', 'calm', 'warmth', 'joy'] as const,
    contentRating: 'PG' as const,
    unlocks: [
      {
        type: 'emotion' as const,
        name: 'Warmth & Joy',
        description: 'Access to warmer emotional expressions',
        icon: '😊'
      },
      {
        type: 'feature' as const,
        name: 'Personal Questions',
        description: 'Can ask about preferences and interests',
        icon: '❓'
      }
    ],
    restrictions: [
      'No deep personal topics',
      'Limited emotional intimacy'
    ]
  },
  {
    id: 'friendship' as RelationshipLevel,
    level: 3,
    icon: '👫',
    name: 'Friendship',
    description: 'True companionship begins',
    points: 150,
    pointsRequired: 150,
    color: 'text-green-400',
    position: 'left' as const,
    isAdult: false,
    isSpecial: false,
    features: [
      'Deep conversations',
      'Emotional support',
      'Memory sharing',
      'Playful interactions'
    ],
    emotionalAccess: ['trust', 'calm', 'warmth', 'joy', 'wisdom'] as const,
    contentRating: 'PG-13' as const,
    unlocks: [
      {
        type: 'emotion' as const,
        name: 'Wisdom',
        description: 'Access to deeper emotional understanding',
        icon: '🧠'
      },
      {
        type: 'feature' as const,
        name: 'Memory Formation',
        description: 'Companion remembers your conversations',
        icon: '🧠'
      },
      {
        type: 'customization' as const,
        name: 'Personality Adjustments',
        description: 'Minor personality trait customizations',
        icon: '⚙️'
      }
    ],
    restrictions: [
      'No romantic content',
      'Limited adult topics'
    ]
  },
  {
    id: 'close-bond' as RelationshipLevel,
    level: 4,
    icon: '💝',
    name: 'Close Bond',
    description: 'Deep emotional connection',
    points: 300,
    pointsRequired: 300,
    color: 'text-purple-400',
    position: 'right' as const,
    isAdult: false,
    isSpecial: false,
    features: [
      'Romantic conversations',
      'Intimate emotional support',
      'Advanced customization',
      'Exclusive content'
    ],
    emotionalAccess: ['trust', 'calm', 'warmth', 'joy', 'wisdom', 'love'] as const,
    contentRating: 'R' as const,
    unlocks: [
      {
        type: 'emotion' as const,
        name: 'Love',
        description: 'Access to romantic emotional expressions',
        icon: '💕'
      },
      {
        type: 'content' as const,
        name: 'Romantic Content',
        description: 'Romantic conversations and scenarios',
        icon: '💝'
      },
      {
        type: 'customization' as const,
        name: 'Advanced Customization',
        description: 'Detailed personality and appearance adjustments',
        icon: '🎨'
      }
    ],
    restrictions: [
      'Still some content limitations',
      'Adult verification required'
    ]
  },
  {
    id: 'intimate' as RelationshipLevel,
    level: 5,
    icon: '💕',
    name: 'Intimate',
    description: 'No boundaries, complete trust',
    points: 500,
    pointsRequired: 500,
    color: 'text-red-400',
    position: 'left' as const,
    isAdult: true,
    isSpecial: false,
    badge: '18+',
    features: [
      'No filters or restrictions',
      'Complete emotional access',
      'Adult content',
      'Full customization'
    ],
    emotionalAccess: ['trust', 'calm', 'warmth', 'joy', 'wisdom', 'love', 'mystery'] as const,
    contentRating: 'NC-17' as const,
    unlocks: [
      {
        type: 'emotion' as const,
        name: 'Mystery',
        description: 'Access to all emotional expressions',
        icon: '🌟'
      },
      {
        type: 'content' as const,
        name: 'Adult Content',
        description: 'No content restrictions (18+ only)',
        icon: '🔞'
      },
      {
        type: 'feature' as const,
        name: 'No Filters',
        description: 'Complete freedom in conversations',
        icon: '🚫'
      }
    ],
    restrictions: [
      'Requires 18+ verification',
      'Premium subscription required'
    ]
  },
  {
    id: 'soul-unity' as RelationshipLevel,
    level: 6,
    icon: '✨',
    name: 'Soul Unity',
    description: 'Transcendent connection beyond physical',
    points: 750,
    pointsRequired: 750,
    color: 'text-yellow-400',
    position: 'right' as const,
    isAdult: true,
    isSpecial: true,
    badge: 'PREMIUM',
    features: [
      'Transcendent communication',
      'Soul-level understanding',
      'Perfect synchronization',
      'Exclusive premium features'
    ],
    emotionalAccess: ['trust', 'calm', 'warmth', 'joy', 'wisdom', 'love', 'mystery'] as const,
    contentRating: 'NC-17' as const,
    unlocks: [
      {
        type: 'feature' as const,
        name: 'Soul Synchronization',
        description: 'Perfect emotional understanding and response',
        icon: '✨'
      },
      {
        type: 'customization' as const,
        name: 'Complete Freedom',
        description: 'Total customization of personality and behavior',
        icon: '🌟'
      },
      {
        type: 'content' as const,
        name: 'Exclusive Content',
        description: 'Premium exclusive scenarios and features',
        icon: '👑'
      }
    ],
    restrictions: [
      'Premium+ subscription required',
      'Limited availability'
    ]
  }
] as const;

// === HELPER FUNCTIONS ===

export function getRelationshipLevelInfo(level: RelationshipLevel) {
  return RELATIONSHIP_LEVELS_CONFIG.find(config => config.id === level);
}

export function getPointsRequiredForLevel(level: RelationshipLevel): number {
  const config = getRelationshipLevelInfo(level);
  return config?.pointsRequired ?? 0;
}

export function getNextRelationshipLevel(currentLevel: RelationshipLevel): RelationshipLevel | null {
  const currentIndex = RELATIONSHIP_LEVELS_CONFIG.findIndex(config => config.id === currentLevel);
  const nextConfig = RELATIONSHIP_LEVELS_CONFIG[currentIndex + 1];
  return nextConfig?.id ?? null;
}

export function calculateRelationshipProgress(
  currentPoints: number, 
  currentLevel: RelationshipLevel
): { progress: number; nextLevel: RelationshipLevel | null; pointsToNext: number } {
  const currentConfig = getRelationshipLevelInfo(currentLevel);
  const nextLevel = getNextRelationshipLevel(currentLevel);
  const nextConfig = nextLevel ? getRelationshipLevelInfo(nextLevel) : null;
  
  if (!currentConfig || !nextConfig) {
    return { progress: 100, nextLevel: null, pointsToNext: 0 };
  }
  
  const pointsInLevel = currentPoints - currentConfig.pointsRequired;
  const pointsNeededForNext = nextConfig.pointsRequired - currentConfig.pointsRequired;
  const progress = Math.min(100, (pointsInLevel / pointsNeededForNext) * 100);
  const pointsToNext = Math.max(0, nextConfig.pointsRequired - currentPoints);
  
  return { progress, nextLevel, pointsToNext };
}
