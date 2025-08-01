/**
 * UI Constants - Feliona AI
 * Единый источник истины для всех UI вариантов и констант
 */

// === UI ВАРИАНТЫ ===
export const UI_VARIANTS = {
  BUTTON: [
    'primary',
    'secondary', 
    'feliona',
    'pulse',
    'cta-primary',
    'cta-secondary',
    'glass'
  ] as const,
  
  CARD: [
    'default',
    'outlined',
    'elevated', 
    'glass',
    'character',
    'adult',
    'pricing',
    'relationship'
  ] as const,
  
  MODAL: [
    'default',
    'age-gate',
    'companion',
    'glass'
  ] as const
} as const;

// === ТИПЫ НА ОСНОВЕ КОНСТАНТ ===
export type ButtonVariant = typeof UI_VARIANTS.BUTTON[number];
export type CardVariant = typeof UI_VARIANTS.CARD[number]; 
export type ModalVariant = typeof UI_VARIANTS.MODAL[number];

// === УТИЛИТЫ ВАЛИДАЦИИ ===
export const isValidButtonVariant = (variant: string): variant is ButtonVariant => {
  return (UI_VARIANTS.BUTTON as readonly string[]).includes(variant);
};

export const isValidCardVariant = (variant: string): variant is CardVariant => {
  return (UI_VARIANTS.CARD as readonly string[]).includes(variant);  
};

export const isValidModalVariant = (variant: string): variant is ModalVariant => {
  return (UI_VARIANTS.MODAL as readonly string[]).includes(variant);
};

// === LEGACY SUPPORT (для обратной совместимости) ===
/** @deprecated Используйте UI_VARIANTS вместо UI_COMPONENTS */
export const UI_COMPONENTS = UI_VARIANTS;
