// In-memory cache for serverless environments
// This replaces Redis for basic caching needs

interface CacheItem {
  value: any;
  expires: number;
}

class MemoryCache {
  private cache = new Map<string, CacheItem>();
  private maxSize = 1000; // Maximum number of items

  set(key: string, value: any, ttlSeconds: number = 300): void {
    // Clean expired items if cache is getting full
    if (this.cache.size >= this.maxSize) {
      this.cleanExpired();
    }

    const expires = Date.now() + (ttlSeconds * 1000);
    this.cache.set(key, { value, expires });
  }

  get(key: string): any | null {
    const item = this.cache.get(key);
    
    if (!item) {
      return null;
    }

    if (Date.now() > item.expires) {
      this.cache.delete(key);
      return null;
    }

    return item.value;
  }

  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  private cleanExpired(): void {
    const now = Date.now();
    for (const [key, item] of this.cache.entries()) {
      if (now > item.expires) {
        this.cache.delete(key);
      }
    }
  }

  // Get cache statistics
  getStats() {
    return {
      size: this.cache.size,
      maxSize: this.maxSize
    };
  }
}

// Export singleton instance
export const cache = new MemoryCache();

// Rate limiting using in-memory cache
export const rateLimitCache = new MemoryCache();

// Session storage using in-memory cache (for development)
// In production, use Supabase or external session store
export const sessionCache = new MemoryCache();
