import React, { useState, useEffect, memo } from "react";
import {
  getPerformanceReport,
  type PerformanceReport,
} from "../utils/performanceAnalyzer";

const PerformanceDashboard: React.FC = memo(() => {
  const [report, setReport] = useState<PerformanceReport | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      const newReport = getPerformanceReport();
      setReport(newReport);
    }, 2000);

    setReport(getPerformanceReport());
    return () => clearInterval(interval);
  }, []);

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          background: "#3b82f6",
          color: "white",
          border: "none",
          borderRadius: "50%",
          width: "60px",
          height: "60px",
          fontSize: "24px",
          cursor: "pointer",
          boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
          zIndex: 1000,
        }}
      >
        📊
      </button>
    );
  }

  return (
    <div
      style={{
        position: "fixed",
        bottom: "20px",
        right: "20px",
        width: "320px",
        background: "white",
        borderRadius: "12px",
        boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
        border: "1px solid #e5e7eb",
        zIndex: 1000,
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      <div
        style={{
          padding: "16px",
          borderBottom: "1px solid #e5e7eb",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <h3 style={{ margin: 0, fontSize: "16px" }}>Performance</h3>
        <button
          onClick={() => setIsVisible(false)}
          style={{ background: "none", border: "none", cursor: "pointer" }}
        >
          ×
        </button>
      </div>

      <div style={{ padding: "16px" }}>
        {report ? (
          <>
            <div style={{ textAlign: "center", marginBottom: "16px" }}>
              <div
                style={{
                  fontSize: "24px",
                  fontWeight: "bold",
                  color: report.score >= 90 ? "#10b981" : "#f59e0b",
                }}
              >
                {report.score}
              </div>
              <div>Grade {report.grade}</div>
            </div>

            <div style={{ fontSize: "12px" }}>
              {report.metrics.fcp && (
                <div>FCP: {Math.round(report.metrics.fcp)}ms</div>
              )}
              {report.metrics.lcp && (
                <div>LCP: {Math.round(report.metrics.lcp)}ms</div>
              )}
              {report.metrics.fid && (
                <div>FID: {Math.round(report.metrics.fid)}ms</div>
              )}
              {report.metrics.cls && (
                <div>CLS: {report.metrics.cls.toFixed(3)}</div>
              )}
            </div>
          </>
        ) : (
          <div>Loading...</div>
        )}
      </div>
    </div>
  );
});

PerformanceDashboard.displayName = "PerformanceDashboard";
export default PerformanceDashboard;
