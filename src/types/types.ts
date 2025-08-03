/**
 * ============================================
 * ⚠️  DEPRECATED FILE - DO NOT USE ⚠️
 * ============================================
 * 
 * Этот файл был разделен на модульную структуру для лучшей организации.
 * Используйте новые импорты:
 * 
 * // Вместо: import { EIC } from './types'
 * // Используйте:
 * import type { 
 *   EmotionType, 
 *   CompanionType, 
 *   Character 
 * } from './types'
 * 
 * // Или импорт конкретных модулей:
 * import type { EmotionType } from './types/core/emotions'
 * import type { Character } from './types/core/companions'
 * import type { AIModelConfig } from './types/ai/models'
 * 
 * НОВАЯ СТРУКТУРА:
 * ├── base.ts                    # Базовые типы, CSS, утилити
 * ├── core/                      # Основные системы EIC
 * │   ├── emotions.ts           # Эмоциональная система
 * │   ├── companions.ts         # Компаньоны и персонажи
 * │   ├── relationships.ts      # Система отношений
 * │   └── memory.ts             # Память и разговоры
 * ├── ai/                        # AI системы
 * │   ├── models.ts             # AI модели и инференс
 * │   ├── langgraph.ts          # LangGraph интеграция
 * │   ├── mcp.ts                # Model Context Protocol
 * │   └── streaming.ts          # Потоковая передача
 * ├── platform/                 # Платформенные системы
 * │   ├── core.ts               # Основная платформа
 * │   ├── analytics.ts          # Аналитика
 * │   └── performance.ts        # Производительность
 * ├── ui/                        # UI компоненты
 * │   ├── components.ts         # React компоненты
 * │   ├── themes.ts             # Темы и стили
 * │   └── interactions.ts       # Взаимодействия
 * └── utils/                     # Утилиты
 *     ├── constants.ts          # Константы и Web APIs
 *     └── validation.ts         # Валидация и ошибки
 * 
 * Этот файл будет удален в следующем релизе.
 * ============================================
 */

// Временный re-export для совместимости
export type * from './index';
