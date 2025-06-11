import { getCLS, getFID, getFCP, getLCP, getTTFB } from "web-vitals";
import type { WebVitalsMetric, PerformanceEvent } from "@perf-mono/types";

export interface VitalsReporter {
  onMetric: (metric: WebVitalsMetric) => void;
  onReport?: (data: PerformanceEvent) => void;
}

export class WebVitalsReporter {
  private appName: "before" | "after-basic" | "after-advanced";
  private sessionId: string;
  private metrics: Map<string, WebVitalsMetric> = new Map();

  constructor(
    appName: "before" | "after-basic" | "after-advanced",
    sessionId?: string
  ) {
    this.appName = appName;
    this.sessionId = sessionId || this.generateSessionId();
  }

  // 모든 Web Vitals 수집 시작
  startCollection(options: VitalsReporter): void {
    const handleMetric = (metric: any) => {
      const webVitalsMetric: WebVitalsMetric = {
        id: metric.id,
        name: metric.name,
        value: metric.value,
        rating: this.rateMetric(metric.name, metric.value),
        delta: metric.delta,
        entries: metric.entries || [],
      };

      this.metrics.set(metric.name, webVitalsMetric);
      options.onMetric(webVitalsMetric);

      // 성능 이벤트 생성
      if (options.onReport) {
        const performanceEvent: PerformanceEvent = {
          name: "performance_measurement",
          properties: {
            metric: metric.name,
            value: metric.value,
            rating: webVitalsMetric.rating,
            app: this.appName,
          },
          timestamp: new Date().toISOString(),
          sessionId: this.sessionId,
          url: window.location.href,
        };
        options.onReport(performanceEvent);
      }
    };

    // 각 Web Vitals 수집
    getCLS(handleMetric);
    getFID(handleMetric);
    getFCP(handleMetric);
    getLCP(handleMetric);
    getTTFB(handleMetric);
  }

  // 수집된 메트릭 가져오기
  getMetrics(): Map<string, WebVitalsMetric> {
    return new Map(this.metrics);
  }

  // 특정 메트릭 가져오기
  getMetric(name: string): WebVitalsMetric | undefined {
    return this.metrics.get(name);
  }

  // 메트릭 요약 정보
  getSummary() {
    const summary = {
      total: this.metrics.size,
      good: 0,
      needsImprovement: 0,
      poor: 0,
      metrics: {} as Record<string, any>,
    };

    this.metrics.forEach((metric, name) => {
      summary.metrics[name] = {
        value: metric.value,
        rating: metric.rating,
      };

      switch (metric.rating) {
        case "good":
          summary.good++;
          break;
        case "needs-improvement":
          summary.needsImprovement++;
          break;
        case "poor":
          summary.poor++;
          break;
      }
    });

    return summary;
  }

  // 메트릭을 로컬 스토리지에 저장
  saveToStorage(): void {
    const data = {
      appName: this.appName,
      sessionId: this.sessionId,
      timestamp: new Date().toISOString(),
      metrics: Array.from(this.metrics.entries()),
    };

    try {
      localStorage.setItem(`webvitals-${this.appName}`, JSON.stringify(data));
    } catch (error) {
      console.warn("Failed to save Web Vitals to localStorage:", error);
    }
  }

  // 로컬 스토리지에서 메트릭 로드
  static loadFromStorage(appName: string): WebVitalsReporter | null {
    try {
      const data = localStorage.getItem(`webvitals-${appName}`);
      if (!data) return null;

      const parsed = JSON.parse(data);
      const reporter = new WebVitalsReporter(parsed.appName, parsed.sessionId);

      parsed.metrics.forEach(([name, metric]: [string, WebVitalsMetric]) => {
        reporter.metrics.set(name, metric);
      });

      return reporter;
    } catch (error) {
      console.warn("Failed to load Web Vitals from localStorage:", error);
      return null;
    }
  }

  // Private helper methods
  private rateMetric(
    name: string,
    value: number
  ): "good" | "needs-improvement" | "poor" {
    const thresholds = {
      CLS: { good: 0.1, poor: 0.25 },
      FID: { good: 100, poor: 300 },
      FCP: { good: 1800, poor: 3000 },
      LCP: { good: 2500, poor: 4000 },
      TTFB: { good: 800, poor: 1800 },
    };

    const threshold = thresholds[name as keyof typeof thresholds];
    if (!threshold) return "good";

    if (value <= threshold.good) return "good";
    if (value <= threshold.poor) return "needs-improvement";
    return "poor";
  }

  private generateSessionId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}

// 편의 함수들
export const createReporter = (
  appName: "before" | "after-basic" | "after-advanced"
) => new WebVitalsReporter(appName);

export const startVitalsCollection = (
  appName: "before" | "after-basic" | "after-advanced",
  onMetric: (metric: WebVitalsMetric) => void,
  onReport?: (data: PerformanceEvent) => void
) => {
  const reporter = new WebVitalsReporter(appName);
  reporter.startCollection({ onMetric, onReport });
  return reporter;
};
