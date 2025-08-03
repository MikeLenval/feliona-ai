/**
 * ============================================
 * Session Cache
 * 💾 Session caching service
 * ============================================
 */

import { LRUCache } from 'lru-cache';
import type { SessionUser, CachedSession } from '../../types/platform/auth';
import type { Environment } from '../env';

// =====================================================
// SESSION CACHE CLASS
// =====================================================

export class SessionCache {
  private cache: LRUCache<string, CachedSession>;

  constructor(env: Environment) {
    this.cache = new LRUCache<string, CachedSession>({
      max: env.SESSION_CACHE_SIZE,
      ttl: env.SESSION_CACHE_TTL,
    });
  }

  set(sessionToken: string, user: SessionUser): void {
    const expiresAt = Date.now() + this.cache.ttl;
    this.cache.set(sessionToken, {
      user,
      expiresAt,
      lastVerified: Date.now(),
    });
  }

  get(sessionToken: string): SessionUser | null {
    const cached = this.cache.get(sessionToken);
    if (!cached || Date.now() > cached.expiresAt) {
      this.cache.delete(sessionToken);
      return null;
    }
    return cached.user;
  }

  invalidate(sessionToken: string): void {
    this.cache.delete(sessionToken);
  }

  clear(): void {
    this.cache.clear();
  }
}
