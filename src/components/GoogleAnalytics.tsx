/**
 * ============================================
 * Google Analytics 4 Setup Script
 * 🎯 Production-ready GA4 initialization
 * ============================================
 */

'use client';

import { useEffect } from 'react';
import Script from 'next/script';
import { configureGA4 } from '@/lib/analytics';

interface GoogleAnalyticsProps {
  measurementId: string;
  debugMode?: boolean;
}

/**
 * Google Analytics 4 Component
 * Handles GA4 script loading and initialization
 *
 * @example
 * ```tsx
 * <GoogleAnalytics
 *   measurementId="G-XXXXXXXXXX"
 *   debugMode={process.env.NODE_ENV === 'development'}
 * />
 * ```
 */
export function GoogleAnalytics({ measurementId, debugMode = false }: GoogleAnalyticsProps) {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Initialize dataLayer
      window.dataLayer = window.dataLayer || [];
      
      // Define gtag function
      window.gtag = function gtag() {
        // eslint-disable-next-line prefer-rest-params
        window.dataLayer?.push(arguments);
      };

      // Configure GA4
      window.gtag('js', new Date());
      configureGA4(measurementId, {
        send_page_view: true
      });
    }
  }, [measurementId, debugMode]);

  return (
    <>
      {/* GA4 Global Site Tag */}
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
        strategy="afterInteractive"
        async
      />
    </>
  );
}

/**
 * HOC для автоматического отслеживания page views
 */
export function withPageTracking<T extends object>(
  Component: React.ComponentType<T>,
  pageName?: string
) {
  return function TrackedComponent(props: T) {
    useEffect(() => {
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'page_view', {
          page_title: pageName || document.title,
          page_location: window.location.href,
          event_category: 'navigation'
        });
      }
    }, []);

    return <Component {...props} />;
  };
}

export default GoogleAnalytics;
