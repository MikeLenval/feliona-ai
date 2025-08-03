/**
 * ============================================
 * Localization Configuration
 * 🌍 Internationalization settings
 * ============================================
 */

// =====================================================
// LOCALIZATION CONSTANTS
// =====================================================

export const LOCALIZATION_CONFIG = {
  SUPPORTED_LOCALES: ['en', 'ru', 'es', 'fr', 'de'] as const,
  DEFAULT_LOCALE: 'en' as const,
  
  COOKIE_CONFIG: {
    NAME: 'NEXT_LOCALE',
    MAX_AGE: 365 * 24 * 60 * 60, // 1 year in seconds
    HTTP_ONLY: false,
    SAME_SITE: 'lax' as const,
    PATH: '/',
  }
} as const;

// =====================================================
// TYPE EXPORTS
// =====================================================

export type SupportedLocale = typeof LOCALIZATION_CONFIG.SUPPORTED_LOCALES[number];

// =====================================================
// UTILITY FUNCTIONS
// =====================================================

export function isSupportedLocale(locale: string): locale is SupportedLocale {
  return LOCALIZATION_CONFIG.SUPPORTED_LOCALES.includes(locale as SupportedLocale);
}
