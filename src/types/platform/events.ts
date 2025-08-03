/**
 * ============================================
 * Google Analytics 4 Event Types - Unified
 * 🎯 Production-ready GA4 integration
 * ============================================
 */

// Legacy GtagEvent interface for backward compatibility
export interface GtagEvent {
  event_category?: string;
  event_label?: string;
  value?: number;
  [key: string]: string | number | boolean | undefined;
}

// Google Analytics 4 Event Parameters (Enhanced)
export interface GA4EventParams {
  /** Category for the event */
  event_category?: string;
  /** Label for the event */
  event_label?: string;
  /** Numeric value for the event */
  value?: number;
  /** Custom parameters */
  [key: string]: string | number | boolean | undefined;
}

// Google Analytics 4 Config Parameters
export interface GA4ConfigParams {
  /** Page title */
  page_title?: string;
  /** Page location URL */
  page_location?: string;
  /** Custom dimensions and metrics */
  [key: string]: string | number | boolean | undefined;
}

// Set and Consent parameters
export interface GA4SetParams {
  [key: string]: string | number | boolean;
}

export interface GA4ConsentParams {
  ad_storage?: 'granted' | 'denied';
  analytics_storage?: 'granted' | 'denied';
  [key: string]: string | 'granted' | 'denied' | undefined;
}

// Gtag Commands
export type GtagCommand = 'config' | 'event' | 'set' | 'consent' | 'js';

// Main gtag function signature (GA4 compatible)
export type GtagFunction = {
  (command: 'config', targetId: string, config?: GA4ConfigParams): void;
  (command: 'event', eventName: string, params?: GA4EventParams): void;
  (command: 'set', config: GA4SetParams): void;
  (command: 'consent', action: string, params: GA4ConsentParams): void;
  (command: 'js', date: Date): void;
};

// Global Window interface extension
declare global {
  interface Window {
    gtag?: GtagFunction;
    dataLayer?: unknown[];
  }
}