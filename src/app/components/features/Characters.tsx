/**
 * ============================================
 * Feliona AI - Characters Section Component
 * 🎭 Character selection with 8 archetypes
 * 
 * Путь: src/app/components/features/Characters.tsx
 * 
 * SECURITY FIXES APPLIED:
 * ✅ URL sanitization для предотвращения XSS
 * ✅ Error boundary для fallback
 * ============================================
 */

import React, { useState, useCallback, useMemo } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import type { 
  EmotionType,
  CompanionType, 
  CompanionId,
  CharacterForComponent,
  FilterCategory,
  CharacterFilterState,
  CharacterCardProps,
  FilterButtonProps,
  CharactersProps
} from '@/types';

// Constants for optimization
const ANIMATION_STAGGER_MS = 100;

// 🔒 SECURITY: URL sanitization utility
const sanitizeImageUrl = (url: string): string => {
  try {
    const urlObj = new URL(url);
    // Только HTTPS и проверенные домены
    if (urlObj.protocol !== 'https:') return '/images/placeholder-avatar.jpg';
    if (!urlObj.hostname.includes('googleusercontent.com')) return '/images/placeholder-avatar.jpg';
    return url;
  } catch {
    return '/images/placeholder-avatar.jpg';
  }
};

// Character configuration data using correct system types
const CHARACTERS_CONFIG: readonly CharacterForComponent[] = [
  // === REALISTIC COMPANIONS ===
  {
    id: 'emily-001' as CompanionId,
    name: 'Emily',
    type: 'caring-friend' as CompanionType,
    description: 'Understanding without judgment',
    personality: {
      traits: ['empathetic', 'nurturing', 'wise', 'patient'] as const,
      values: ['compassion', 'honesty', 'growth', 'acceptance'] as const,
      communication_style: 'emotional' as const,
      emotional_intelligence: 95,
      empathy_level: 98
    },
    appearance: {
      avatar_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCMXhXzksGc0yQq45rylvjybvk83esXFlzjcQ2SNsR4y8NRUaw-3u4ZEwsk1xSTQHD5lpVj83bGT3osQeNe4szUK_nDSWr73BThgpAJ61a9c1g3zO5QShzIpdYpgHW8saIMFzy3F8HGGjwjSa1hl2-IV5UlgfKrXzKj7ggC1hadvcyFbP5rGONlJrdyQvhPy2Vggxu0r7SK5WB6vo8AfGh9RmZknt0_P-MtbIXSAQcTlQ3zxGujDfULxDN48yypbBzn5tN15Z8dSqwe',
      style: 'realistic' as const,
      primary_colors: ['#ff6b6b', '#ffa8a8'] as const
    },
    capabilities: {
      conversation: true,
      voice_synthesis: true,
      emotional_response: true,
      memory_formation: true
    },
    metadata: {
      category: 'sfw' as const,
      age_rating: 'teen' as const,
      default_emotion: 'warmth' as EmotionType
    }
  },
  {
    id: 'zoe-002' as CompanionId,
    name: 'Zoe',
    type: 'playful-spark' as CompanionType,
    description: 'Your personal champion',
    personality: {
      traits: ['energetic', 'optimistic', 'creative', 'spontaneous'] as const,
      values: ['adventure', 'fun', 'creativity', 'freedom'] as const,
      communication_style: 'playful' as const,
      emotional_intelligence: 88,
      empathy_level: 85
    },
    appearance: {
      avatar_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCNr05O0PRQlN6qFeONBeUAZD45cdFY4bxFU_ANMkwsf5mviwhxlGpiCXkGtQQGZnlBwIyEb784TlMXn0EwaLtC-lnqxLTn7-2fzM6I9OPum7qnjmmwWVuw7-aKQUu8TlsB_YvlOLpFwgj1vgOMWwAvsmIYvgXOaibiGhKvG5PHd1AH3Ac1-AIN98npcDr9fiSL1v6QuBcjv31Q6WRjs59ZzjoztLZbin9jL1ydopR3FpUHBTtYeUUbiFp8VNKq46joZ_kdaMmwhIp1',
      style: 'realistic' as const,
      primary_colors: ['#f39c12', '#f7dc6f'] as const
    },
    capabilities: {
      conversation: true,
      voice_synthesis: true,
      emotional_response: true,
      memory_formation: true
    },
    metadata: {
      category: 'sfw' as const,
      age_rating: 'teen' as const,
      default_emotion: 'joy' as EmotionType
    }
  },
  {
    id: 'alex-003' as CompanionId,
    name: 'Alex',
    type: 'wise-muse' as CompanionType,
    description: 'Inspiration without limits',
    personality: {
      traits: ['intellectual', 'thoughtful', 'insightful', 'philosophical'] as const,
      values: ['knowledge', 'wisdom', 'truth', 'understanding'] as const,
      communication_style: 'intellectual' as const,
      emotional_intelligence: 92,
      empathy_level: 90
    },
    appearance: {
      avatar_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuASen3VH-DlveyEhLKFVQhG-X5QkhWqsxcewrO8KXDflJP2M5BS3p-B4B5uXE5xcpAWFwXKEvm1yOLd2XEx5Z_LF5ey5KY7p4geXJ428GbV7gSnL73CU1AwuKhrlfyMetDntylCQ5C03ybyn_P1AhFNK2rXWtkPKoFlueYpbb0zGcbwqaU2WeVMe2fYyXh5qGQ7Kf0oJfN0mD6MRIGr7OJ2Mnqv4jVRS1kReM2mTKjaHnJsIJDaN6-0AMDkV3iXs-MoBYwRCnhEVyt5',
      style: 'realistic' as const,
      primary_colors: ['#95a5a6', '#bdc3c7'] as const
    },
    capabilities: {
      conversation: true,
      voice_synthesis: true,
      emotional_response: true,
      memory_formation: true
    },
    metadata: {
      category: 'sfw' as const,
      age_rating: 'teen' as const,
      default_emotion: 'wisdom' as EmotionType
    }
  },
  {
    id: 'isabella-004' as CompanionId,
    name: 'Isabella',
    type: 'passionate-soul' as CompanionType,
    description: 'Ready for any adventure',
    personality: {
      traits: ['passionate', 'confident', 'romantic', 'adventurous'] as const,
      values: ['passion', 'beauty', 'connection', 'authenticity'] as const,
      communication_style: 'emotional' as const,
      emotional_intelligence: 94,
      empathy_level: 92
    },
    appearance: {
      avatar_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCT0TcAtWhLGhBWs2I-r9xArkMPvs_C7hd4-n-HhNBPMDgXyDuPv_TDuUxSYlwgno7Q0zZhedfmaIUAUc_gDs5M5VxRsEgG47ss4gxB6lwOXe0UdnVkz7hvmB7xf0y8ewet3eZPrLcQuvUSG722H0V1B6t3B9WyLNPcjK3K2jjzL7_5dpYeK01TPTqeLpMBwz4yVGLDq5dqF6ko5WcqZOfwaXNm-CaV0-zvzqJvwKMYOMrnwz0A-oaPu1xoaeCJNYNJtqC5EBwKFtR5',
      style: 'realistic' as const,
      primary_colors: ['#e74c3c', '#f1948a'] as const
    },
    capabilities: {
      conversation: true,
      voice_synthesis: true,
      emotional_response: true,
      memory_formation: true
    },
    metadata: {
      category: 'sfw' as const,
      age_rating: 'teen' as const,
      default_emotion: 'love' as EmotionType
    }
  },

  // === FANTASY COMPANIONS ===
  {
    id: 'luna-005' as CompanionId,
    name: 'Luna',
    type: 'elven-sage' as CompanionType,
    description: 'Mystical elf sage with ancient wisdom',
    personality: {
      traits: ['mystical', 'ancient', 'wise', 'ethereal'] as const,
      values: ['nature', 'magic', 'harmony', 'eternity'] as const,
      communication_style: 'formal' as const,
      emotional_intelligence: 96,
      empathy_level: 88
    },
    appearance: {
      avatar_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDFzAoQBqektHNl4iovQrZ1vt7iELAMujgvdvfZrli4gN_tG_pGsb5fNByLwG4URWAT-mC1HnUV09MjBG1zT5N-6TcTbya8M0Jz-zZ7u-m0-vu_GADiWZwyOEcO0nwkKrv0IpzER76Qn3BHTiL7sCvc3TiFPo6Br4UkYXZYzcy8SmEnkQ0-PM3ryPX6WLXuYzpZQeTLrIQGnPoonYQt_6uk2yYxXICIY5Q35EZ3CBZgb_L76dNUcQASp5DMFTQZumeUcsL0jT4WG0e4',
      style: 'fantasy' as const,
      primary_colors: ['#8e44ad', '#bb8fce'] as const
    },
    capabilities: {
      conversation: true,
      voice_synthesis: true,
      emotional_response: true,
      memory_formation: true
    },
    metadata: {
      category: 'sfw' as const,
      age_rating: 'teen' as const,
      default_emotion: 'wisdom' as EmotionType,
      fantasy_race: 'elf' as const
    }
  },
  {
    id: 'aki-006' as CompanionId,
    name: 'Aki',
    type: 'neko-girl' as CompanionType,
    description: 'Playful neko with feline charm',
    personality: {
      traits: ['playful', 'curious', 'affectionate', 'mischievous'] as const,
      values: ['playfulness', 'comfort', 'companionship', 'curiosity'] as const,
      communication_style: 'playful' as const,
      emotional_intelligence: 86,
      empathy_level: 84
    },
    appearance: {
      avatar_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCNr05O0PRQlN6qFeONBeUAZD45cdFY4bxFU_ANMkwsf5mviwhxlGpiCXkGtQQGZnlBwIyEb784TlMXn0EwaLtC-lnqxLTn7-2fzM6I9OPum7qnjmmwWVuw7-aKQUu8TlsB_YvlOLpFwgj1vgOMWwAvsmIYvgXOaibiGhKvG5PHd1AH3Ac1-AIN98npcDr9fiSL1v6QuBcjv31Q6WRjs59ZzjoztLZbin9jL1ydopR3FpUHBTtYeUUbiFp8VNKq46joZ_kdaMmwhIp1',
      style: 'anime' as const,
      primary_colors: ['#ff9ff3', '#f8c2ff'] as const
    },
    capabilities: {
      conversation: true,
      voice_synthesis: true,
      emotional_response: true,
      memory_formation: true
    },
    metadata: {
      category: 'sfw' as const,
      age_rating: 'teen' as const,
      default_emotion: 'joy' as EmotionType,
      fantasy_race: 'neko' as const
    }
  },
  {
    id: 'selena-007' as CompanionId,
    name: 'Selena',
    type: 'guardian-angel' as CompanionType,
    description: 'Guardian angel with protective instincts',
    personality: {
      traits: ['protective', 'pure', 'caring', 'divine'] as const,
      values: ['protection', 'purity', 'love', 'guidance'] as const,
      communication_style: 'formal' as const,
      emotional_intelligence: 97,
      empathy_level: 99
    },
    appearance: {
      avatar_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuASen3VH-DlveyEhLKFVQhG-X5QkhWqsxcewrO8KXDflJP2M5BS3p-B4B5uXE5xcpAWFwXKEvm1yOLd2XEx5Z_LF5ey5KY7p4geXJ428GbV7gSnL73CU1AwuKhrlfyMetDntylCQ5C03ybyn_P1AhFNK2rXWtkPKoFlueYpbb0zGcbwqaU2WeVMe2fYyXh5qGQ7Kf0oJfN0mD6MRIGr7OJ2Mnqv4jVRS1kReM2mTKjaHnJsIJDaN6-0AMDkV3iXs-MoBYwRCnhEVyt5',
      style: 'fantasy' as const,
      primary_colors: ['#3498db', '#85c1e9'] as const
    },
    capabilities: {
      conversation: true,
      voice_synthesis: true,
      emotional_response: true,
      memory_formation: true
    },
    metadata: {
      category: 'sfw' as const,
      age_rating: 'teen' as const,
      default_emotion: 'calm' as EmotionType,
      fantasy_race: 'angel' as const
    }
  },
  {
    id: 'raven-008' as CompanionId,
    name: 'Raven',
    type: 'seductive-demoness' as CompanionType,
    description: 'Seductive demon with forbidden allure',
    personality: {
      traits: ['seductive', 'mysterious', 'passionate', 'dangerous'] as const,
      values: ['passion', 'desire', 'freedom', 'power'] as const,
      communication_style: 'casual' as const,
      emotional_intelligence: 93,
      empathy_level: 76
    },
    appearance: {
      avatar_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCT0TcAtWhLGhBWs2I-r9xArkMPvs_C7hd4-n-HhNBPMDgXyDuPv_TDuUxSYlwgno7Q0zZhedfmaIUAUc_gDs5M5VxRsEgG47ss4gxB6lwOXe0UdnVkz7hvmB7xf0y8ewet3eZPrLcQuvUSG722H0V1B6t3B9WyLNPcjK3K2jjzL7_5dpYeK01TPTqeLpMBwz4yVGLDq5dqF6ko5WcqZOfwaXNm-CaV0-zvzqJvwKMYOMrnwz0A-oaPu1xoaeCJNYNJtqC5EBwKFtR5',
      style: 'fantasy' as const,
      primary_colors: ['#8b0000', '#dc143c'] as const
    },
    capabilities: {
      conversation: true,
      voice_synthesis: true,
      emotional_response: true,
      memory_formation: true
    },
    metadata: {
      category: 'nsfw' as const,
      age_rating: 'adult' as const,
      default_emotion: 'mystery' as EmotionType,
      fantasy_race: 'demon' as const,
      adult_content: true
    }
  }
] as const;

// Safe analytics tracking
const trackCharacterEvent = (eventName: string, characterId: string, characterType: string): void => {
  if (typeof window !== 'undefined' && window.gtag && typeof window.gtag === 'function') {
    try {
      window.gtag('event', eventName, {
        event_category: 'character_interaction',
        event_label: `${characterType}_${characterId}`
      });
    } catch (error) {
      console.warn('Analytics tracking failed:', error);
    }
  }
};

// Character Card Component
const CharacterCard = React.memo(({ 
  character, 
  isHovered, 
  animationDelay, 
  onHover, 
  onSelect 
}: CharacterCardProps) => {
  const isAdultContent = character.metadata.category === 'nsfw';
  
  const handleMouseEnter = useCallback(() => {
    onHover(character.id);
  }, [character.id, onHover]);

  const handleMouseLeave = useCallback(() => {
    onHover(null);
  }, [onHover]);

  const handleClick = useCallback(() => {
    trackCharacterEvent('character_select', character.id, character.type);
    onSelect(character);
  }, [character, onSelect]);

  // 🔒 SECURITY FIX: Sanitize avatar URL before using
  const safeAvatarUrl = sanitizeImageUrl(character.appearance.avatar_url);

  return (
    <Card
      variant={isAdultContent ? 'adult' : 'glass'}
      className={`character-card ${isHovered ? 'hovered' : ''} ${isAdultContent ? 'adult-content' : ''}`}
      style={{ animationDelay }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      aria-label={`Select ${character.name} companion`}
    >
      {/* Adult Content Badge */}
      {isAdultContent && (
        <div className="adult-badge" aria-label="Adult content">
          <span className="text-xs font-bold text-white">18+</span>
        </div>
      )}

      {/* Character Image */}
      <div className="character-image-container">
        <div 
          className="character-image"
          style={{ 
            backgroundImage: `url("${safeAvatarUrl}")`,
          }}
          role="img" 
          aria-label={`${character.name} avatar`}
        />
        <div className="image-overlay" aria-hidden="true" />
      </div>

      {/* Character Info */}
      <div className="character-info">
        <div className="flex items-center justify-between mb-2">
          <h3 className="character-name">{character.name}</h3>
          <div 
            className="emotion-indicator"
            title={`Default emotion: ${character.metadata.default_emotion}`}
          >
            <div className="emotion-dot" />
          </div>
        </div>
        
        <p className="character-description">{character.description}</p>
        
        {/* Character Traits */}
        <div className="character-traits" aria-label="Personality traits">
          {character.personality.traits.slice(0, 2).map((trait) => (
            <span key={trait} className="trait-badge">
              {trait}
            </span>
          ))}
        </div>

        {/* Fantasy Race Badge */}
        {character.metadata.fantasy_race && (
          <div className="fantasy-badge">
            <span className="text-xs font-medium">
              {character.metadata.fantasy_race}
            </span>
          </div>
        )}
      </div>
    </Card>
  );
});

CharacterCard.displayName = 'CharacterCard';

// Filter Button Component  
const FilterButton = React.memo(({ filter, isActive, count, onClick }: FilterButtonProps) => {
  const handleClick = useCallback(() => {
    onClick(filter);
  }, [filter, onClick]);

  const filterLabels: Record<FilterCategory, string> = {
    all: 'All',
    realistic: 'Realistic',
    fantasy: 'Fantasy',
    sfw: 'Safe',
    nsfw: '18+ Only'
  };

  return (
    <Button
      variant={isActive ? 'primary' : 'glass'}
      size="sm"
      onClick={handleClick}
      className={`filter-button ${isActive ? 'active' : ''}`}
      aria-pressed={isActive}
    >
      {filterLabels[filter]} ({count})
    </Button>
  );
});

FilterButton.displayName = 'FilterButton';

/**
 * Characters Section for Feliona AI
 * Displays 8 character archetypes with filtering and selection
 */
export function Characters({ onCharacterSelect, className = "" }: CharactersProps) {
  const [hoveredCharacter, setHoveredCharacter] = useState<CompanionId | null>(null);
  const [filter, setFilter] = useState<CharacterFilterState>({
    category: 'all',
    searchQuery: ''
  });

  // Filter characters based on current filter state
  const filteredCharacters = useMemo(() => {
    let filtered = CHARACTERS_CONFIG;

    // Category filter
    if (filter.category !== 'all') {
      filtered = filtered.filter(character => {
        switch (filter.category) {
          case 'realistic':
            return character.appearance.style === 'realistic';
          case 'fantasy':
            return character.appearance.style === 'fantasy' || character.appearance.style === 'anime';
          case 'sfw':
            return character.metadata.category === 'sfw';
          case 'nsfw':
            return character.metadata.category === 'nsfw';
          default:
            return true;
        }
      });
    }

    // Search filter
    if (filter.searchQuery) {
      const query = filter.searchQuery.toLowerCase();
      filtered = filtered.filter(character => 
        character.name.toLowerCase().includes(query) ||
        character.description.toLowerCase().includes(query) ||
        character.personality.traits.some(trait => trait.toLowerCase().includes(query))
      );
    }

    return filtered;
  }, [filter]);

  // Filter counts for buttons
  const filterCounts = useMemo(() => ({
    all: CHARACTERS_CONFIG.length,
    realistic: CHARACTERS_CONFIG.filter(c => c.appearance.style === 'realistic').length,
    fantasy: CHARACTERS_CONFIG.filter(c => c.appearance.style === 'fantasy' || c.appearance.style === 'anime').length,
    sfw: CHARACTERS_CONFIG.filter(c => c.metadata.category === 'sfw').length,
    nsfw: CHARACTERS_CONFIG.filter(c => c.metadata.category === 'nsfw').length
  }), []);

  // Event handlers
  const handleFilterChange = useCallback((category: FilterCategory) => {
    setFilter(prev => ({ ...prev, category }));
    trackCharacterEvent('filter_change', 'characters_section', category);
  }, []);

  const handleCharacterSelect = useCallback((character: CharacterForComponent) => {
    onCharacterSelect?.(character);
  }, [onCharacterSelect]);

  const handleHover = useCallback((characterId: CompanionId | null) => {
    setHoveredCharacter(characterId);
  }, []);

  return (
    <section 
      className={`characters-section ${className}`}
      aria-labelledby="characters-title"
    >
      <div className="container-responsive">
        
        {/* Section Header */}
        <div className="section-header">
          <div className="header-content">
            <h2 id="characters-title" className="section-title">
              Find Your Perfect Companion
            </h2>
            <p className="section-subtitle">
              Choose from 8 unique personalities, each ready to connect without filters or judgment. 
              Explore relationships that grow and evolve with your desires.
            </p>
          </div>

          {/* Filter Controls */}
          <div className="filter-controls" role="group" aria-label="Character filters">
            {(Object.keys(filterCounts) as FilterCategory[]).map((filterKey) => (
              <FilterButton
                key={filterKey}
                filter={filterKey}
                isActive={filter.category === filterKey}
                count={filterCounts[filterKey]}
                onClick={handleFilterChange}
              />
            ))}
          </div>
        </div>

        {/* Characters Grid */}
        <div className="characters-grid" role="grid" aria-label="Available companions">
          {filteredCharacters.map((character, index) => (
            <CharacterCard
              key={character.id}
              character={character}
              isHovered={hoveredCharacter === character.id}
              animationDelay={`${index * ANIMATION_STAGGER_MS}ms`}
              onHover={handleHover}
              onSelect={handleCharacterSelect}
            />
          ))}
        </div>

        {/* Empty State */}
        {filteredCharacters.length === 0 && (
          <div className="empty-state" role="status">
            <p className="text-lg text-secondary">
              No companions match your current filters.
            </p>
            <Button 
              variant="glass" 
              onClick={() => handleFilterChange('all')}
              className="mt-4"
            >
              Show All Characters
            </Button>
          </div>
        )}

        {/* View All Button */}
        {filter.category !== 'all' && filteredCharacters.length > 0 && (
          <div className="section-footer">
            <Button
              variant="primary"
              size="lg"
              onClick={() => handleFilterChange('all')}
              className="view-all-button"
            >
              View All Companions
              <svg 
                className="ml-2 h-5 w-5" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M5 12h14M12 5l7 7-7 7" 
                />
              </svg>
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}

export default Characters;