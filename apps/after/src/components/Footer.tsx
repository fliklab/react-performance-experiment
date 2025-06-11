import React, { memo, useMemo } from "react";
import { usePerformance } from "../contexts/PerformanceContext";

const Footer: React.FC = () => {
  const { state } = usePerformance();

  // Memoized performance stats display
  const performanceStats = useMemo(() => {
    const avgRenderTime =
      state.metrics.renderCount > 0
        ? (state.metrics.totalRenderTime / state.metrics.renderCount).toFixed(2)
        : "0";

    return {
      renderCount: state.metrics.renderCount,
      avgRenderTime,
      cartItems: state.cart.length,
    };
  }, [state.metrics, state.cart.length]);

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h3>After Store</h3>
          <p>Optimized for Performance</p>
          <div className="performance-metrics">
            <small>
              Renders: {performanceStats.renderCount} | Avg:{" "}
              {performanceStats.avgRenderTime}ms | Cart:{" "}
              {performanceStats.cartItems}
            </small>
          </div>
        </div>

        <div className="footer-section">
          <h4>Performance Features</h4>
          <ul>
            <li>✅ React.memo optimization</li>
            <li>✅ Virtual scrolling</li>
            <li>✅ Image lazy loading</li>
            <li>✅ Code splitting</li>
            <li>✅ Optimized state management</li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Tech Stack</h4>
          <ul>
            <li>Vite + React + TypeScript</li>
            <li>React Query (data fetching)</li>
            <li>React Window (virtualization)</li>
            <li>Intersection Observer API</li>
            <li>Web Vitals monitoring</li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; 2024 Performance Measurement Demo. Built for speed.</p>
      </div>
    </footer>
  );
};

export default memo(Footer);
