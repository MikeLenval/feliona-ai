/**
 * ============================================
 * reCAPTCHA Validator
 * 🤖 reCAPTCHA verification service
 * ============================================
 */

import { LRUCache } from 'lru-cache';
import { EXTERNAL_APIS, SECURITY_CONSTANTS } from '../../config/security';
import type { Environment } from '../env';

// =====================================================
// RECAPTCHA VALIDATOR CLASS
// =====================================================

export class RecaptchaValidator {
  private static cache = new LRUCache<string, boolean>({ 
    max: SECURITY_CONSTANTS.RECAPTCHA_CACHE_MAX, 
    ttl: SECURITY_CONSTANTS.RECAPTCHA_CACHE_TTL 
  });

  static async verify(token: string, ip: string, env: Environment): Promise<boolean> {
    if (!env.RECAPTCHA_SECRET_KEY) {
      console.error('RECAPTCHA_SECRET_KEY not configured');
      return false;
    }

    const cacheKey = `${token}:${ip}`;
    const cachedResult = this.cache.get(cacheKey);
    if (cachedResult !== undefined) {
      return cachedResult;
    }

    try {
      const response = await fetch(EXTERNAL_APIS.RECAPTCHA_VERIFY_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          secret: env.RECAPTCHA_SECRET_KEY,
          response: token,
          remoteip: ip,
        }),
      });

      if (!response.ok) {
        console.error(`reCAPTCHA API returned ${response.status}`);
        this.cache.set(cacheKey, false);
        return false;
      }

      const data = await response.json();
      const result = data.success && data.score >= env.RECAPTCHA_SCORE_THRESHOLD;
      this.cache.set(cacheKey, result);
      return result;
    } catch (error) {
      console.error('reCAPTCHA verification failed:', error);
      this.cache.set(cacheKey, false);
      return false;
    }
  }

  static clearCache(): void {
    this.cache.clear();
  }
}
