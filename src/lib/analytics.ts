/**
 * ============================================
 * Google Analytics 4 Setup Script
 * 🎯 Production-ready GA4 initialization
 * ============================================
 */

'use client';

// Простые типы для Google Analytics
interface CustomWindow extends Window {
  gtag?: (...args: unknown[]) => void;
  dataLayer?: unknown[];
}

// Объявляем глобальную переменную
declare const window: CustomWindow;

// Типы для GA4 событий
interface GA4Config {
  send_page_view?: boolean;
  debug_mode?: boolean;
  custom_parameters?: Record<string, string | number | boolean>;
}

interface GA4Event {
  event_category?: string;
  event_label?: string;
  value?: number;
  custom_parameters?: Record<string, string | number | boolean>;
}

/**
 * Конфигурация Google Analytics 4
 */
export function configureGA4(measurementId: string, config: GA4Config = {}) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', measurementId, {
      send_page_view: config.send_page_view ?? true,
      debug_mode: config.debug_mode ?? false,
      ...config.custom_parameters
    });
  }
}

/**
 * Отправка кастомных событий в GA4
 */
export function trackEvent(eventName: string, parameters: GA4Event = {}) {
  if (typeof window !== 'undefined' && window.gtag) {
    const eventParams: Record<string, string | number | boolean> = {};
    
    if (parameters.event_category) eventParams.event_category = parameters.event_category;
    if (parameters.event_label) eventParams.event_label = parameters.event_label;
    if (parameters.value !== undefined) eventParams.value = parameters.value;
    if (parameters.custom_parameters) {
      Object.assign(eventParams, parameters.custom_parameters);
    }

    window.gtag('event', eventName, eventParams);
  }
}

/**
 * Отслеживание page views
 */
export function trackPageView(pagePath?: string, pageTitle?: string) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'page_view', {
      page_title: pageTitle || document.title,
      page_location: pagePath || window.location.href,
      event_category: 'navigation'
    });
  }
}

/**
 * Специфические события для навигации
 * Используется в Header компоненте
 */
export const trackNavigation = {
  logoClick: () => trackEvent('logo_click', {
    event_category: 'navigation',
    event_label: 'header_logo'
  }),

  navClick: (itemName: string) => trackEvent('nav_click', {
    event_category: 'navigation',
    event_label: `nav_${itemName.toLowerCase()}`
  }),

  ctaClick: () => trackEvent('cta_click', {
    event_category: 'conversion',
    event_label: 'early_access_header'
  }),

  mobileMenuToggle: (isOpen: boolean) => trackEvent('mobile_menu_toggle', {
    event_category: 'ui_interaction',
    event_label: isOpen ? 'menu_opened' : 'menu_closed'
  })
};

/**
 * События для компаньонов
 */
export const trackCompanions = {
  viewCompanion: (companionId: string) => trackEvent('view_companion', {
    event_category: 'companions',
    event_label: companionId
  }),

  interactWithCompanion: (companionId: string, interactionType: string) => trackEvent('companion_interaction', {
    event_category: 'companions',
    event_label: `${companionId}_${interactionType}`
  }),

  startChat: (companionId: string) => trackEvent('start_chat', {
    event_category: 'engagement',
    event_label: companionId
  })
};

/**
 * События для чата
 */
export const trackChat = {
  sendMessage: (companionId: string) => trackEvent('send_message', {
    event_category: 'chat',
    event_label: companionId
  }),

  receiveMessage: (companionId: string) => trackEvent('receive_message', {
    event_category: 'chat',
    event_label: companionId
  }),

  endChat: (companionId: string, duration: number) => trackEvent('end_chat', {
    event_category: 'chat',
    event_label: companionId,
    value: duration
  })
};

/**
 * События для пользовательского опыта
 */
export const trackUserExperience = {
  pageLoad: (pageName: string, loadTime: number) => trackEvent('page_load_time', {
    event_category: 'performance',
    event_label: pageName,
    value: loadTime
  }),

  errorOccurred: (errorType: string, errorMessage: string) => trackEvent('error_occurred', {
    event_category: 'errors',
    event_label: `${errorType}: ${errorMessage}`
  }),

  featureUsed: (featureName: string) => trackEvent('feature_used', {
    event_category: 'features',
    event_label: featureName
  })
};

const analytics = {
  configureGA4,
  trackEvent,
  trackPageView,
  trackNavigation,
  trackCompanions,
  trackChat,
  trackUserExperience
};

export default analytics;
