import type { ApiResponse, PaginatedResponse } from "@perf-mono/types";

export interface ApiClientConfig {
  baseUrl: string;
  timeout: number;
  retries: number;
  headers?: Record<string, string>;
}

export interface RequestOptions {
  headers?: Record<string, string>;
  timeout?: number;
  retries?: number;
  cache?: boolean;
  cacheTTL?: number;
}

export class ApiClient {
  private config: ApiClientConfig;
  private cache: Map<string, { data: any; expiry: number }> = new Map();

  constructor(config: ApiClientConfig) {
    this.config = config;
  }

  // GET 요청
  async get<T = any>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<ApiResponse<T>> {
    const cacheKey = `GET:${endpoint}`;

    // 캐시 확인
    if (options.cache !== false) {
      const cached = this.getFromCache(cacheKey);
      if (cached) {
        return cached;
      }
    }

    try {
      const response = await this.request<T>(
        "GET",
        endpoint,
        undefined,
        options
      );

      // 성공한 응답을 캐시에 저장
      if (options.cache !== false && response.success) {
        this.setCache(cacheKey, response, options.cacheTTL);
      }

      return response;
    } catch (error) {
      return this.handleError(error);
    }
  }

  // POST 요청
  async post<T = any>(
    endpoint: string,
    data?: any,
    options: RequestOptions = {}
  ): Promise<ApiResponse<T>> {
    try {
      return await this.request<T>("POST", endpoint, data, options);
    } catch (error) {
      return this.handleError(error);
    }
  }

  // PUT 요청
  async put<T = any>(
    endpoint: string,
    data?: any,
    options: RequestOptions = {}
  ): Promise<ApiResponse<T>> {
    try {
      return await this.request<T>("PUT", endpoint, data, options);
    } catch (error) {
      return this.handleError(error);
    }
  }

  // DELETE 요청
  async delete<T = any>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<ApiResponse<T>> {
    try {
      return await this.request<T>("DELETE", endpoint, undefined, options);
    } catch (error) {
      return this.handleError(error);
    }
  }

  // Paginated GET 요청
  async getPaginated<T = any>(
    endpoint: string,
    page: number = 1,
    limit: number = 20,
    options: RequestOptions = {}
  ): Promise<PaginatedResponse<T>> {
    const url = `${endpoint}?page=${page}&limit=${limit}`;

    try {
      const response = await this.get<T[]>(url, options);

      // PaginatedResponse로 변환
      if (response.success && response.data) {
        const defaultPagination = {
          page,
          limit,
          total: Array.isArray(response.data) ? response.data.length : 0,
          totalPages: 1,
          hasNext: false,
          hasPrev: page > 1,
        };

        return {
          ...response,
          data: response.data,
          pagination: response.pagination
            ? { ...defaultPagination, ...response.pagination }
            : defaultPagination,
        };
      }

      return {
        success: false,
        error: response.error || "Failed to fetch data",
        message: response.message,
        pagination: {
          page,
          limit,
          total: 0,
          totalPages: 0,
          hasNext: false,
          hasPrev: false,
        },
      };
    } catch (error) {
      return {
        success: false,
        error: "Network error",
        message: "Failed to complete the request",
        pagination: {
          page,
          limit,
          total: 0,
          totalPages: 0,
          hasNext: false,
          hasPrev: false,
        },
      };
    }
  }

  // 파일 업로드
  async uploadFile(
    endpoint: string,
    file: File,
    options: RequestOptions = {}
  ): Promise<ApiResponse<{ url: string; filename: string }>> {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(this.getUrl(endpoint), {
        method: "POST",
        body: formData,
        headers: {
          ...this.config.headers,
          ...options.headers,
        },
        signal: this.createAbortSignal(options.timeout),
      });

      return await this.processResponse(response);
    } catch (error) {
      return this.handleError(error);
    }
  }

  // 캐시 관리
  clearCache(pattern?: string): void {
    if (pattern) {
      for (const key of this.cache.keys()) {
        if (key.includes(pattern)) {
          this.cache.delete(key);
        }
      }
    } else {
      this.cache.clear();
    }
  }

  // 요청 취소를 위한 AbortController 생성
  createAbortController(): AbortController {
    return new AbortController();
  }

  // Private methods
  private async request<T>(
    method: string,
    endpoint: string,
    data?: any,
    options: RequestOptions = {}
  ): Promise<ApiResponse<T>> {
    const maxRetries = options.retries ?? this.config.retries;
    let lastError: Error;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        const response = await fetch(this.getUrl(endpoint), {
          method,
          headers: {
            "Content-Type": "application/json",
            ...this.config.headers,
            ...options.headers,
          },
          body: data ? JSON.stringify(data) : undefined,
          signal: this.createAbortSignal(options.timeout),
        });

        return await this.processResponse<T>(response);
      } catch (error) {
        lastError = error as Error;

        // 마지막 시도가 아니면 재시도
        if (attempt < maxRetries) {
          await this.delay(Math.pow(2, attempt) * 1000); // Exponential backoff
          continue;
        }
      }
    }

    throw lastError!;
  }

  private async processResponse<T>(
    response: Response
  ): Promise<ApiResponse<T>> {
    try {
      const data = await response.json();

      if (response.ok) {
        return {
          success: true,
          data: data.data || data,
          message: data.message,
          pagination: data.pagination,
        };
      } else {
        return {
          success: false,
          error: data.error || data.message || "Unknown error",
          message: data.message,
        };
      }
    } catch (error) {
      return {
        success: false,
        error: "Failed to parse response",
        message: "Invalid JSON response",
      };
    }
  }

  private handleError(error: any): ApiResponse {
    if (error.name === "AbortError") {
      return {
        success: false,
        error: "Request timeout",
        message: "The request was aborted due to timeout",
      };
    }

    return {
      success: false,
      error: error.message || "Network error",
      message: "Failed to complete the request",
    };
  }

  private getUrl(endpoint: string): string {
    return `${this.config.baseUrl}${endpoint.startsWith("/") ? "" : "/"}${endpoint}`;
  }

  private createAbortSignal(timeout?: number): AbortSignal {
    const timeoutMs = timeout ?? this.config.timeout;
    const controller = new AbortController();

    setTimeout(() => controller.abort(), timeoutMs);

    return controller.signal;
  }

  private getFromCache(key: string): any | null {
    const cached = this.cache.get(key);

    if (cached && cached.expiry > Date.now()) {
      return cached.data;
    }

    if (cached) {
      this.cache.delete(key);
    }

    return null;
  }

  private setCache(key: string, data: any, ttl: number = 300000): void {
    // 기본 5분
    this.cache.set(key, {
      data,
      expiry: Date.now() + ttl,
    });
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

// 기본 API 클라이언트 인스턴스
export const createApiClient = (config: ApiClientConfig) =>
  new ApiClient(config);

// 편의 함수들
export const defaultApiClient = new ApiClient({
  baseUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api",
  timeout: 10000,
  retries: 3,
});

// 성능 측정을 위한 느린 API 클라이언트 (Before 앱용)
export const slowApiClient = new ApiClient({
  baseUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api",
  timeout: 30000, // 느린 타임아웃
  retries: 1, // 적은 재시도
});
