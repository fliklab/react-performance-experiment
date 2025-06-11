import type {
  WebVitalsMetric,
  CoreWebVitals,
  PerformanceData,
} from "@perf-mono/types";

// Performance 측정 유틸리티
export class PerformanceMetrics {
  private static instance: PerformanceMetrics;
  private metrics: Map<string, WebVitalsMetric> = new Map();
  private observers: PerformanceObserver[] = [];

  static getInstance(): PerformanceMetrics {
    if (!PerformanceMetrics.instance) {
      PerformanceMetrics.instance = new PerformanceMetrics();
    }
    return PerformanceMetrics.instance;
  }

  // Core Web Vitals 수집
  collectWebVitals(): Promise<CoreWebVitals> {
    return new Promise((resolve) => {
      const vitals: CoreWebVitals = {};
      let collected = 0;
      const expected = 5; // LCP, FID, CLS, FCP, TTFB

      const checkComplete = () => {
        collected++;
        if (collected >= expected) {
          resolve(vitals);
        }
      };

      // LCP (Largest Contentful Paint)
      this.observeMetric("largest-contentful-paint", (entry) => {
        vitals.lcp = this.createMetric(
          "LCP",
          entry.startTime,
          this.rateMetric("LCP", entry.startTime)
        );
        checkComplete();
      });

      // FID (First Input Delay) - 실제 사용자 상호작용 필요
      this.observeMetric("first-input", (entry) => {
        vitals.fid = this.createMetric(
          "FID",
          entry.processingStart - entry.startTime,
          this.rateMetric("FID", entry.processingStart - entry.startTime)
        );
        checkComplete();
      });

      // CLS (Cumulative Layout Shift)
      this.observeLayoutShift((value) => {
        vitals.cls = this.createMetric(
          "CLS",
          value,
          this.rateMetric("CLS", value)
        );
        checkComplete();
      });

      // FCP (First Contentful Paint)
      this.observeMetric("paint", (entry) => {
        if (entry.name === "first-contentful-paint") {
          vitals.fcp = this.createMetric(
            "FCP",
            entry.startTime,
            this.rateMetric("FCP", entry.startTime)
          );
          checkComplete();
        }
      });

      // TTFB (Time to First Byte)
      this.observeTTFB().then((ttfb) => {
        vitals.ttfb = this.createMetric(
          "TTFB",
          ttfb,
          this.rateMetric("TTFB", ttfb)
        );
        checkComplete();
      });

      // Fallback: resolve after 5 seconds
      setTimeout(() => resolve(vitals), 5000);
    });
  }

  // Bundle 크기 분석
  async analyzeBundleSize(): Promise<PerformanceData["bundleSize"]> {
    if (!("performance" in window) || !performance.getEntriesByType) {
      return { javascript: 0, css: 0, images: 0, total: 0 };
    }

    const resources = performance.getEntriesByType(
      "resource"
    ) as PerformanceResourceTiming[];

    let javascript = 0;
    let css = 0;
    let images = 0;

    resources.forEach((resource) => {
      const size = resource.transferSize || 0;

      if (
        resource.name.includes(".js") ||
        resource.name.includes("javascript")
      ) {
        javascript += size;
      } else if (
        resource.name.includes(".css") ||
        resource.name.includes("stylesheet")
      ) {
        css += size;
      } else if (resource.name.match(/\.(jpg|jpeg|png|gif|webp|svg|avif)$/i)) {
        images += size;
      }
    });

    const total = javascript + css + images;
    return { javascript, css, images, total };
  }

  // 네트워크 요청 분석
  analyzeNetworkRequests(): PerformanceData["networkRequests"] {
    if (!("performance" in window) || !performance.getEntriesByType) {
      return { count: 0, totalSize: 0, cacheable: 0 };
    }

    const resources = performance.getEntriesByType(
      "resource"
    ) as PerformanceResourceTiming[];

    let totalSize = 0;
    let cacheable = 0;

    resources.forEach((resource) => {
      const size = resource.transferSize || 0;
      totalSize += size;

      // 캐시에서 온 리소스 판별
      if (resource.transferSize === 0 && resource.decodedBodySize > 0) {
        cacheable++;
      }
    });

    return {
      count: resources.length,
      totalSize,
      cacheable,
    };
  }

  // 전체 성능 데이터 수집
  async collectPerformanceData(url: string): Promise<PerformanceData> {
    const webVitals = await this.collectWebVitals();
    const bundleSize = await this.analyzeBundleSize();
    const networkRequests = this.analyzeNetworkRequests();

    const navigation = performance.getEntriesByType(
      "navigation"
    )[0] as PerformanceNavigationTiming;
    const loadTime = navigation
      ? navigation.loadEventEnd - navigation.fetchStart
      : 0;
    const domContentLoaded = navigation
      ? navigation.domContentLoadedEventEnd - navigation.fetchStart
      : 0;

    return {
      url,
      timestamp: new Date().toISOString(),
      webVitals,
      loadTime,
      domContentLoaded,
      bundleSize,
      networkRequests,
    };
  }

  // Private helper methods
  private createMetric(
    name: string,
    value: number,
    rating: "good" | "needs-improvement" | "poor"
  ): WebVitalsMetric {
    return {
      id: `${name}-${Date.now()}`,
      name,
      value,
      rating,
      delta: value,
      entries: [],
    };
  }

  private rateMetric(
    name: string,
    value: number
  ): "good" | "needs-improvement" | "poor" {
    const thresholds = {
      LCP: { good: 2500, poor: 4000 },
      FID: { good: 100, poor: 300 },
      CLS: { good: 0.1, poor: 0.25 },
      FCP: { good: 1800, poor: 3000 },
      TTFB: { good: 800, poor: 1800 },
    };

    const threshold = thresholds[name as keyof typeof thresholds];
    if (!threshold) return "good";

    if (value <= threshold.good) return "good";
    if (value <= threshold.poor) return "needs-improvement";
    return "poor";
  }

  private observeMetric(type: string, callback: (entry: any) => void): void {
    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach(callback);
      });
      observer.observe({ entryTypes: [type] });
      this.observers.push(observer);
    } catch (error) {
      console.warn(`Failed to observe ${type}:`, error);
    }
  }

  private observeLayoutShift(callback: (value: number) => void): void {
    let clsValue = 0;
    let sessionValue = 0;
    let sessionEntries: any[] = [];

    try {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!(entry as any).hadRecentInput) {
            const firstSessionEntry = sessionEntries[0];
            const lastSessionEntry = sessionEntries[sessionEntries.length - 1];

            if (
              sessionValue &&
              entry.startTime - lastSessionEntry.startTime < 1000 &&
              entry.startTime - firstSessionEntry.startTime < 5000
            ) {
              sessionValue += (entry as any).value;
              sessionEntries.push(entry);
            } else {
              sessionValue = (entry as any).value;
              sessionEntries = [entry];
            }

            if (sessionValue > clsValue) {
              clsValue = sessionValue;
              callback(clsValue);
            }
          }
        }
      });

      observer.observe({ entryTypes: ["layout-shift"] });
      this.observers.push(observer);
    } catch (error) {
      console.warn("Failed to observe layout shifts:", error);
    }
  }

  private async observeTTFB(): Promise<number> {
    try {
      const navigation = performance.getEntriesByType(
        "navigation"
      )[0] as PerformanceNavigationTiming;
      return navigation
        ? navigation.responseStart - navigation.requestStart
        : 0;
    } catch (error) {
      console.warn("Failed to measure TTFB:", error);
      return 0;
    }
  }

  // 정리 함수
  disconnect(): void {
    this.observers.forEach((observer) => observer.disconnect());
    this.observers = [];
    this.metrics.clear();
  }
}

// 편의 함수들
export const collectWebVitals = () =>
  PerformanceMetrics.getInstance().collectWebVitals();
export const collectPerformanceData = (url: string) =>
  PerformanceMetrics.getInstance().collectPerformanceData(url);
export const analyzeBundleSize = () =>
  PerformanceMetrics.getInstance().analyzeBundleSize();
export const analyzeNetworkRequests = () =>
  PerformanceMetrics.getInstance().analyzeNetworkRequests();
