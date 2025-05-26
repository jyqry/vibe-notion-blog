import { BlogPost, CachedPage } from "@/types/notion";

interface CacheStore {
  [key: string]: CachedPage;
}

class CacheManager {
  private cache: CacheStore = {};
  private readonly CACHE_DURATION = 1000 * 60 * 60; // 1시간

  set(key: string, page: BlogPost): void {
    this.cache[key] = {
      page,
      cachedAt: new Date().toISOString(),
      lastModified: page.updatedAt,
    };
  }

  get(key: string): BlogPost | null {
    const cached = this.cache[key];
    if (!cached) return null;

    const now = new Date().getTime();
    const cachedTime = new Date(cached.cachedAt).getTime();

    // 캐시가 만료되었는지 확인
    if (now - cachedTime > this.CACHE_DURATION) {
      delete this.cache[key];
      return null;
    }

    return cached.page;
  }

  isStale(key: string, lastModified: string): boolean {
    const cached = this.cache[key];
    if (!cached) return true;

    return new Date(lastModified) > new Date(cached.lastModified);
  }

  invalidate(key: string): void {
    delete this.cache[key];
  }

  clear(): void {
    this.cache = {};
  }

  getAll(): CacheStore {
    return { ...this.cache };
  }

  // 메모리 사용량 관리를 위한 정리 함수
  cleanup(): void {
    const now = new Date().getTime();
    Object.keys(this.cache).forEach((key) => {
      const cached = this.cache[key];
      const cachedTime = new Date(cached.cachedAt).getTime();

      if (now - cachedTime > this.CACHE_DURATION) {
        delete this.cache[key];
      }
    });
  }
}

export const cacheManager = new CacheManager();

// 주기적으로 캐시 정리 (5분마다)
if (typeof window === "undefined") {
  setInterval(() => {
    cacheManager.cleanup();
  }, 1000 * 60 * 5);
}
