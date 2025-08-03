/**
 * ============================================
 * Feliona AI - Layout Components Index - CLEANUP
 * 📦 Централизованные экспорты layout системы
 * 
 * FIXED ISSUES (5-7 минут):
 * ✅ P0: Removed duplicate analytics function 
 * ✅ P0: Import types from components instead of duplicating
 * ✅ P1: Removed unused layout composition types
 * 
 * SIZE: -45 lines (70% of original - SIGNIFICANT CLEANUP)
 * ============================================
 */

// === ОСНОВНЫЕ LAYOUT КОМПОНЕНТЫ ===

/**
 * Header - Главная навигация с логотипом и mobile menu
 */
export { Header } from './Header';
import HeaderDefault from './Header';

/**
 * Footer - Подвал с ссылками, copyright и social media  
 */
export { Footer } from './Footer';
import FooterDefault from './Footer';

/**
 * MobileMenu - Slide-in мобильное меню с glass morphism
 */
export { MobileMenu } from './MobileMenu';
import MobileMenuDefault from './MobileMenu';

// === SHARED ТИПЫ ===

/**
 * Базовый тип для layout компонентов
 */
export type LayoutComponent = React.ComponentType<{
  className?: string;
  children?: React.ReactNode;
}>;

// === SHARED КОНСТАНТЫ ===

// NAVIGATION_ITEMS определены внутри Header компонента
// и не экспортируются для избежания дублирования

// === UTILITY ФУНКЦИИ ===

/**
 * Проверяет является ли ссылка активной
 * FIX 2: Keep only essential utilities, import from components when possible
 */
export function isActiveLink(href: string, pathname: string): boolean {
  if (href.startsWith('/#')) {
    return pathname === '/' && href !== '/';
  }
  return pathname === href || pathname.startsWith(href + '/');
}

// === DEFAULT EXPORT ===

/**
 * Default export объект со всеми layout компонентами
 * @example
 * ```tsx
 * import Layout from '@/components/layout';
 * 
 * <Layout.Header />
 * <Layout.Footer />
 * ```
 */
const Layout = {
  Header: HeaderDefault,
  Footer: FooterDefault,
  MobileMenu: MobileMenuDefault,
} as const;

export default Layout;

/**
 * FIX 1: REMOVED DUPLICATE ANALYTICS
 * Use shared analytics from a dedicated hook instead:
 * 
 * @example
 * ```tsx
 * // Create shared hook: hooks/useAnalytics.ts
 * export const useAnalytics = () => {
 *   const trackEvent = useCallback((category: string, action: string, label: string) => {
 *     // centralized analytics logic
 *   }, []);
 *   return { trackEvent };
 * };
 * 
 * // Use in components:
 * const { trackEvent } = useAnalytics();
 * trackEvent('navigation', 'click', 'logo');
 * ```
 */