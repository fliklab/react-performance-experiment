import { onCLS, onFCP, onFID, onLCP, onTTFB, onINP } from "web-vitals";

export interface PerformanceMetrics {
  fcp?: number;
  lcp?: number;
  fid?: number;
  cls?: number;
  ttfb?: number;
  inp?: number;
  timestamp: number;
  url: string;
}

export interface PerformanceReport {
  metrics: PerformanceMetrics;
  score: number;
  grade: "A" | "B" | "C" | "D" | "F";
  recommendations: string[];
}

class PerformanceAnalyzer {
  private metrics: Partial<PerformanceMetrics> = {};

  constructor() {
    this.initializeWebVitals();
  }

  private initializeWebVitals() {
    onFCP((metric) => {
      this.metrics.fcp = metric.value;
      console.log(`🔍 FCP: ${metric.value.toFixed(2)}ms`);
    });

    onLCP((metric) => {
      this.metrics.lcp = metric.value;
      console.log(`🔍 LCP: ${metric.value.toFixed(2)}ms`);
    });

    onFID((metric) => {
      this.metrics.fid = metric.value;
      console.log(`🔍 FID: ${metric.value.toFixed(2)}ms`);
    });

    onCLS((metric) => {
      this.metrics.cls = metric.value;
      console.log(`🔍 CLS: ${metric.value.toFixed(3)}`);
    });

    onTTFB((metric) => {
      this.metrics.ttfb = metric.value;
      console.log(`🔍 TTFB: ${metric.value.toFixed(2)}ms`);
    });

    onINP((metric) => {
      this.metrics.inp = metric.value;
      console.log(`🔍 INP: ${metric.value.toFixed(2)}ms`);
    });
  }

  public getCurrentMetrics(): PerformanceMetrics {
    return {
      ...this.metrics,
      timestamp: Date.now(),
      url: window.location.href,
    } as PerformanceMetrics;
  }

  public generateReport(): PerformanceReport {
    const metrics = this.getCurrentMetrics();
    const score = this.calculateScore(metrics);
    const grade = this.calculateGrade(score);
    const recommendations = this.generateRecommendations(metrics);

    return { metrics, score, grade, recommendations };
  }

  private calculateScore(metrics: PerformanceMetrics): number {
    let score = 100;

    if (metrics.fcp && metrics.fcp > 1800)
      score -= metrics.fcp > 3000 ? 20 : 10;
    if (metrics.lcp && metrics.lcp > 2500)
      score -= metrics.lcp > 4000 ? 25 : 15;
    if (metrics.fid && metrics.fid > 100) score -= metrics.fid > 300 ? 20 : 10;
    if (metrics.cls && metrics.cls > 0.1) score -= metrics.cls > 0.25 ? 20 : 10;

    return Math.max(0, score);
  }

  private calculateGrade(score: number): "A" | "B" | "C" | "D" | "F" {
    if (score >= 90) return "A";
    if (score >= 80) return "B";
    if (score >= 70) return "C";
    if (score >= 60) return "D";
    return "F";
  }

  private generateRecommendations(metrics: PerformanceMetrics): string[] {
    const recommendations: string[] = [];

    if (metrics.fcp && metrics.fcp > 1800) {
      recommendations.push("Optimize First Contentful Paint");
    }
    if (metrics.lcp && metrics.lcp > 2500) {
      recommendations.push("Improve Largest Contentful Paint");
    }
    if (metrics.fid && metrics.fid > 100) {
      recommendations.push("Reduce First Input Delay");
    }
    if (metrics.cls && metrics.cls > 0.1) {
      recommendations.push("Minimize Cumulative Layout Shift");
    }

    return recommendations;
  }
}

export const performanceAnalyzer = new PerformanceAnalyzer();
export const getPerformanceReport = () => performanceAnalyzer.generateReport();
