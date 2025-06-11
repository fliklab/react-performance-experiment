export interface CacheItem<T> {
  data: T;
  expiry: number;
  size?: number;
}

export interface CacheConfig {
  maxSize?: number;
  defaultTTL?: number;
  storage?: "memory" | "localStorage" | "sessionStorage";
}

export class Cache<T = any> {
  private cache: Map<string, CacheItem<T>> = new Map();
  private config: Required<CacheConfig>;
  private currentSize = 0;

  constructor(config: CacheConfig = {}) {
    this.config = {
      maxSize: config.maxSize || 100,
      defaultTTL: config.defaultTTL || 300000, // 5분
      storage: config.storage || "memory",
    };

    // 브라우저 환경에서 기존 데이터 복원
    if (typeof window !== "undefined" && this.config.storage !== "memory") {
      this.loadFromStorage();
    }
  }

  // 데이터 저장
  set(key: string, data: T, ttl?: number): void {
    const expiry = Date.now() + (ttl || this.config.defaultTTL);
    const size = this.calculateSize(data);

    // 용량 초과 시 오래된 항목 제거
    while (
      this.currentSize + size > this.config.maxSize &&
      this.cache.size > 0
    ) {
      this.evictOldest();
    }

    const item: CacheItem<T> = { data, expiry, size };

    // 기존 항목이 있으면 크기에서 제외
    const existing = this.cache.get(key);
    if (existing) {
      this.currentSize -= existing.size || 0;
    }

    this.cache.set(key, item);
    this.currentSize += size;

    // 외부 스토리지에 저장
    this.saveToStorage();
  }

  // 데이터 조회
  get(key: string): T | null {
    const item = this.cache.get(key);

    if (!item) {
      return null;
    }

    // 만료된 항목 제거
    if (item.expiry < Date.now()) {
      this.delete(key);
      return null;
    }

    return item.data;
  }

  // 데이터 삭제
  delete(key: string): boolean {
    const item = this.cache.get(key);
    if (item) {
      this.currentSize -= item.size || 0;
      this.cache.delete(key);
      this.saveToStorage();
      return true;
    }
    return false;
  }

  // 데이터 존재 확인
  has(key: string): boolean {
    const item = this.cache.get(key);
    if (item && item.expiry >= Date.now()) {
      return true;
    }
    if (item) {
      this.delete(key);
    }
    return false;
  }

  // 캐시 전체 삭제
  clear(): void {
    this.cache.clear();
    this.currentSize = 0;
    this.saveToStorage();
  }

  // 만료된 항목들 정리
  cleanup(): number {
    const now = Date.now();
    let cleaned = 0;

    for (const [key, item] of this.cache.entries()) {
      if (item.expiry < now) {
        this.delete(key);
        cleaned++;
      }
    }

    return cleaned;
  }

  // 캐시 통계
  getStats() {
    const now = Date.now();
    let validItems = 0;
    let expiredItems = 0;

    for (const [, item] of this.cache.entries()) {
      if (item.expiry >= now) {
        validItems++;
      } else {
        expiredItems++;
      }
    }

    return {
      totalItems: this.cache.size,
      validItems,
      expiredItems,
      currentSize: this.currentSize,
      maxSize: this.config.maxSize,
      usagePercentage: (this.currentSize / this.config.maxSize) * 100,
    };
  }

  // 모든 키 조회
  keys(): string[] {
    const now = Date.now();
    const validKeys: string[] = [];

    for (const [key, item] of this.cache.entries()) {
      if (item.expiry >= now) {
        validKeys.push(key);
      }
    }

    return validKeys;
  }

  // TTL로 데이터 가져오기 또는 생성
  async getOrSet<R = T>(
    key: string,
    factory: () => Promise<R>,
    ttl?: number
  ): Promise<R> {
    const existing = this.get(key);
    if (existing !== null) {
      return existing as unknown as R;
    }

    const data = await factory();
    this.set(key, data as unknown as T, ttl);
    return data;
  }

  // Private methods
  private calculateSize(data: T): number {
    try {
      return JSON.stringify(data).length;
    } catch {
      return 1; // 기본 크기
    }
  }

  private evictOldest(): void {
    let oldestKey: string | null = null;
    let oldestTime = Date.now();

    for (const [key, item] of this.cache.entries()) {
      if (item.expiry < oldestTime) {
        oldestTime = item.expiry;
        oldestKey = key;
      }
    }

    if (oldestKey) {
      this.delete(oldestKey);
    }
  }

  private loadFromStorage(): void {
    if (typeof window === "undefined") return;

    try {
      const storage =
        this.config.storage === "localStorage" ? localStorage : sessionStorage;

      const data = storage.getItem(`cache-${this.constructor.name}`);
      if (data) {
        const parsed = JSON.parse(data);
        const now = Date.now();

        for (const [key, item] of Object.entries(parsed)) {
          const cacheItem = item as CacheItem<T>;
          if (cacheItem.expiry > now) {
            this.cache.set(key, cacheItem);
            this.currentSize += cacheItem.size || 0;
          }
        }
      }
    } catch (error) {
      console.warn("Failed to load cache from storage:", error);
    }
  }

  private saveToStorage(): void {
    if (typeof window === "undefined" || this.config.storage === "memory") {
      return;
    }

    try {
      const storage =
        this.config.storage === "localStorage" ? localStorage : sessionStorage;

      const data = Object.fromEntries(this.cache.entries());
      storage.setItem(`cache-${this.constructor.name}`, JSON.stringify(data));
    } catch (error) {
      console.warn("Failed to save cache to storage:", error);
    }
  }
}

// 특화된 캐시 인스턴스들
export const memoryCache = new Cache({ storage: "memory", maxSize: 50 });
export const persistentCache = new Cache({
  storage: "localStorage",
  maxSize: 100,
});
export const sessionCache = new Cache({
  storage: "sessionStorage",
  maxSize: 25,
});

// 편의 함수들
export const createCache = <T = any>(config?: CacheConfig) =>
  new Cache<T>(config);

// LRU Cache 구현
export class LRUCache<T = any> {
  private cache: Map<string, { data: T; timestamp: number }> = new Map();
  private maxSize: number;

  constructor(maxSize: number = 100) {
    this.maxSize = maxSize;
  }

  get(key: string): T | null {
    const item = this.cache.get(key);
    if (item) {
      // 최근 사용으로 업데이트
      this.cache.delete(key);
      this.cache.set(key, { ...item, timestamp: Date.now() });
      return item.data;
    }
    return null;
  }

  set(key: string, data: T): void {
    // 용량 초과 시 가장 오래된 항목 제거
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      if (firstKey) {
        this.cache.delete(firstKey);
      }
    }

    this.cache.set(key, { data, timestamp: Date.now() });
  }

  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  size(): number {
    return this.cache.size;
  }
}
