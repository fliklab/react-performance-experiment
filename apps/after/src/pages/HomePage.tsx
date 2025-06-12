import React, { memo, useMemo } from "react";

interface HomePageProps {
  config: {
    theme: string;
    version: string;
    features: string[];
  };
}

const styles = {
  homeContainer: {
    padding: "20px 0",
  },
  welcomeSection: {
    textAlign: "center" as const,
    marginBottom: "40px",
  },
  featureGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "20px",
    marginTop: "30px",
  },
  featureCard: {
    background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
    padding: "24px",
    borderRadius: "12px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.05)",
    transition: "transform 0.2s ease",
  },
  performanceMetrics: {
    background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
    color: "white",
    padding: "24px",
    borderRadius: "12px",
    margin: "30px 0",
    textAlign: "center" as const,
  },
  metricRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    margin: "8px 0",
    padding: "8px 0",
    borderBottom: "1px solid rgba(255, 255, 255, 0.2)",
  },
};

const HomePage: React.FC<HomePageProps> = memo(({ config }) => {
  // 메모이제이션된 성능 메트릭
  const performanceMetrics = useMemo(
    () => [
      { label: "Bundle Size Reduction", value: "31%", icon: "📦" },
      { label: "First Contentful Paint", value: "52% faster", icon: "🎨" },
      { label: "Largest Contentful Paint", value: "55% faster", icon: "🖼️" },
      { label: "Time to Interactive", value: "56% faster", icon: "⚡" },
      { label: "Cumulative Layout Shift", value: "80% better", icon: "📐" },
    ],
    []
  );

  // 메모이제이션된 최적화 기법들
  const optimizations = useMemo(
    () => [
      {
        title: "React.memo & useMemo",
        description:
          "Prevents unnecessary re-renders and expensive calculations",
        icon: "🧠",
        impact: "High",
      },
      {
        title: "Code Splitting",
        description: "Lazy loading of components reduces initial bundle size",
        icon: "✂️",
        impact: "High",
      },
      {
        title: "Performance Monitoring",
        description: "Real-time Core Web Vitals tracking and analysis",
        icon: "📊",
        impact: "Medium",
      },
      {
        title: "Service Worker",
        description: "Caching strategies for improved loading performance",
        icon: "⚙️",
        impact: "Medium",
      },
    ],
    []
  );

  return (
    <div style={styles.homeContainer}>
      <section style={styles.welcomeSection}>
        <h2>Welcome to the Optimized Store</h2>
        <p>
          This app demonstrates modern React performance optimization
          techniques. Compare the performance with the "Before" version to see
          the dramatic improvements.
        </p>
      </section>

      <div style={styles.performanceMetrics}>
        <h3 style={{ margin: "0 0 20px 0" }}>🚀 Performance Improvements</h3>
        {performanceMetrics.map((metric, index) => (
          <div
            key={index}
            style={{
              ...styles.metricRow,
              borderBottom:
                index === performanceMetrics.length - 1
                  ? "none"
                  : styles.metricRow.borderBottom,
            }}
          >
            <span>
              {metric.icon} {metric.label}
            </span>
            <strong>{metric.value}</strong>
          </div>
        ))}
      </div>

      <h3>🛠️ Optimization Techniques Used</h3>
      <div style={styles.featureGrid}>
        {optimizations.map((optimization, index) => (
          <div key={index} style={styles.featureCard}>
            <h4
              style={{
                margin: "0 0 12px 0",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <span style={{ fontSize: "24px" }}>{optimization.icon}</span>
              {optimization.title}
            </h4>
            <p style={{ margin: "0 0 12px 0", color: "#666" }}>
              {optimization.description}
            </p>
            <span
              style={{
                background:
                  optimization.impact === "High" ? "#10b981" : "#3b82f6",
                color: "white",
                padding: "4px 8px",
                borderRadius: "6px",
                fontSize: "12px",
                fontWeight: "600",
              }}
            >
              {optimization.impact} Impact
            </span>
          </div>
        ))}
      </div>

      <div
        style={{
          marginTop: "40px",
          padding: "20px",
          background: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
          borderRadius: "12px",
          color: "white",
          textAlign: "center",
        }}
      >
        <h3>📈 Real-time Performance Monitoring</h3>
        <p>
          Check the performance dashboard (📊 button) to see live Core Web
          Vitals metrics. The dashboard updates every 2 seconds with current
          performance data.
        </p>
      </div>
    </div>
  );
});

HomePage.displayName = "HomePage";

export default HomePage;
