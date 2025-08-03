/**
 * ============================================
 * Relationship Analytics Utilities
 * 💕 Analytics tracking для RelationshipLevels
 * ============================================
 */

import type { RelationshipLevel } from '@/types';

/**
 * Relationship Analytics utility class
 */
export class RelationshipAnalytics {
  /**
   * Track relationship level card clicks
   */
  static trackLevelCardClick(levelId: RelationshipLevel): void {
    if (typeof window === 'undefined') return;
    
    try {
      // Google Analytics 4
      if (window.gtag && typeof window.gtag === 'function') {
        window.gtag('event', 'relationship_level_click', {
          event_category: 'relationship_interaction',
          relationship_level: levelId,
          event_label: `level_${levelId}`
        });
      }

      // Console log для разработки
      if (process.env.NODE_ENV === 'development') {
        console.log('Relationship Analytics:', {
          event: 'relationship_level_click',
          levelId
        });
      }
    } catch (error) {
      console.warn('Relationship analytics tracking failed:', error);
    }
  }

  /**
   * Track relationship section view
   */
  static trackSectionView(): void {
    if (typeof window === 'undefined') return;
    
    try {
      if (window.gtag && typeof window.gtag === 'function') {
        window.gtag('event', 'relationship_section_view', {
          event_category: 'relationship_engagement'
        });
      }
    } catch (error) {
      console.warn('Relationship analytics tracking failed:', error);
    }
  }

  /**
   * Track relationship progress
   */
  static trackProgress(currentLevel: RelationshipLevel, points: number): void {
    if (typeof window === 'undefined') return;
    
    try {
      if (window.gtag && typeof window.gtag === 'function') {
        window.gtag('event', 'relationship_progress', {
          event_category: 'relationship_progression',
          relationship_level: currentLevel,
          points: points
        });
      }
    } catch (error) {
      console.warn('Relationship analytics tracking failed:', error);
    }
  }
}