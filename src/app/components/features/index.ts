/**
 * ============================================
 * Feliona AI - Features Components Barrel Export
 * 🎯 Production-ready модульная система экспортов
 * 
 * Путь: src/app/components/features/index.ts
 * 
 * ПРИНЦИПЫ:
 * ✅ Tree-shaking оптимизация
 * ✅ Именованные экспорты для лучшей производительности
 * ✅ Re-export паттерн для централизованного управления
 * ✅ TypeScript строгая типизация
 * ✅ Семантическое именование
 * 
 * @author Feliona AI Team
 * @version 2.0.0
 * @since 2025-08-01
 * ============================================
 */

// ============================================
// CORE FEATURE COMPONENTS
// ============================================

/**
 * Главная секция Hero с 18+ брендингом
 * @description Основная landing секция с призывом к действию
 */
export { Hero } from './Hero';
export { default as HeroSection } from './Hero';

/**
 * Секция выбора персонажей
 * @description 8 архетипов персонажей с интерактивным выбором
 */
export { Characters } from './Characters';
export { default as CharactersSection } from './Characters';

/**
 * Секция тарифных планов
 * @description 4 тарифа с правильными ценами и функциональностью
 */
export { PricingSection } from './PricingSection';
export { default as PricingComponent } from './PricingSection';

/**
 * Секция уровней отношений
 * @description 6 уровней отношений в zigzag layout
 */
export { RelationshipLevels } from './RelationshipLevels';
export { default as RelationshipLevelsSection } from './RelationshipLevels';

// ============================================
// BARREL IMPORTS (для внутреннего использования)
// ============================================

import { Hero } from './Hero';
import { Characters } from './Characters';
import { PricingSection } from './PricingSection';
import { RelationshipLevels } from './RelationshipLevels';

/**
 * Объект со всеми компонентами для динамического использования
 * @example
 * ```tsx
 * import { FeatureComponents } from '@/components/features';
 * const Component = FeatureComponents.Hero;
 * ```
 */
export const FeatureComponents = {
  Hero,
  Characters,
  PricingSection,
  RelationshipLevels,
} as const;

/**
 * Тип для ключей компонентов
 * @description Используется для type-safe динамического рендеринга
 */
export type FeatureComponentKeys = keyof typeof FeatureComponents;

// ============================================
// DEFAULT EXPORT
// ============================================

/**
 * Default export для обратной совместимости
 * @description Экспортирует HeroSection как основной компонент
 */
export { default } from './Hero';