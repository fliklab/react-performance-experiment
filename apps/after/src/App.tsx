import React, { Suspense, lazy, memo, useMemo, useCallback } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { PerformanceProvider } from "./contexts/PerformanceContext";
import PerformanceDashboard from "./components/PerformanceDashboard";

// 코드 스플리팅을 위한 lazy loading
const HomePage = lazy(() => import("./pages/HomePage"));
const ProductsPage = lazy(() => import("./pages/ProductsPage"));
const CartPage = lazy(() => import("./pages/CartPage"));

// CSS-in-JS 스타일 객체
const styles = {
  appContainer: {
    fontFamily:
      "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    minHeight: "100vh",
    color: "#333",
  },
  mainContent: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "20px",
    background: "rgba(255, 255, 255, 0.95)",
    borderRadius: "12px",
    marginTop: "20px",
    marginBottom: "20px",
    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
    backdropFilter: "blur(10px)",
  },
  header: {
    background: "rgba(255, 255, 255, 0.98)",
    padding: "20px",
    borderRadius: "12px",
    marginBottom: "20px",
    boxShadow: "0 4px 16px rgba(0, 0, 0, 0.1)",
  },
  nav: {
    display: "flex",
    gap: "15px",
    justifyContent: "center",
    marginTop: "15px",
  },
  navLink: {
    padding: "8px 16px",
    background: "linear-gradient(135deg, #667eea, #764ba2)",
    color: "white",
    textDecoration: "none",
    borderRadius: "20px",
    transition: "transform 0.2s ease",
    fontWeight: "500",
  },
  optimizationBadges: {
    display: "flex",
    flexWrap: "wrap" as const,
    gap: "10px",
    margin: "20px 0",
    justifyContent: "center",
  },
  loadingSpinner: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "200px",
    fontSize: "18px",
    color: "#667eea",
  },
};

const getBadgeStyle = (variant: "success" | "info" | "warning") => ({
  padding: "6px 12px",
  borderRadius: "16px",
  fontSize: "12px",
  fontWeight: "600",
  background:
    variant === "success"
      ? "#10b981"
      : variant === "info"
        ? "#3b82f6"
        : "#f59e0b",
  color: "white",
  display: "flex",
  alignItems: "center",
  gap: "4px",
});

// 메모이제이션된 컴포넌트들
const MemoizedHeader = memo(() => (
  <header style={styles.header}>
    <h1 style={{ textAlign: "center", margin: 0, fontSize: "2.5rem" }}>
      🚀 After App - Highly Optimized
    </h1>
    <p style={{ textAlign: "center", margin: "10px 0 0 0", color: "#666" }}>
      This is the highly optimized version with modern React patterns.
    </p>

    <div style={styles.optimizationBadges}>
      <span style={getBadgeStyle("success")}>✅ Code Splitting</span>
      <span style={getBadgeStyle("success")}>✅ React.memo</span>
      <span style={getBadgeStyle("success")}>✅ Lazy Loading</span>
      <span style={getBadgeStyle("info")}>🎯 Performance Optimized</span>
      <span style={getBadgeStyle("warning")}>⚡ Service Worker</span>
    </div>

    <nav style={styles.nav}>
      <a href="/" style={styles.navLink}>
        Home
      </a>
      <a href="/products" style={styles.navLink}>
        Products
      </a>
      <a href="/cart" style={styles.navLink}>
        Cart
      </a>
    </nav>
  </header>
));

MemoizedHeader.displayName = "MemoizedHeader";

const App: React.FC = () => {
  // 메모이제이션된 값들
  const appConfig = useMemo(
    () => ({
      theme: "optimized",
      version: "2.0.0",
      features: ["code-splitting", "memoization", "lazy-loading"],
    }),
    []
  );

  // 메모이제이션된 콜백
  const handleNavigation = useCallback((path: string) => {
    // 네비게이션 로직 (실제로는 React Router가 처리)
    console.log(`Navigating to: ${path}`);
  }, []);

  return (
    <PerformanceProvider>
      <Router>
        <div style={styles.appContainer}>
          <MemoizedHeader />

          <main style={styles.mainContent}>
            <Suspense
              fallback={
                <div style={styles.loadingSpinner}>
                  🔄 Loading optimized components...
                </div>
              }
            >
              <Routes>
                <Route path="/" element={<HomePage config={appConfig} />} />
                <Route path="/products" element={<ProductsPage />} />
                <Route path="/cart" element={<CartPage />} />
              </Routes>
            </Suspense>
          </main>

          <PerformanceDashboard />
        </div>
      </Router>
    </PerformanceProvider>
  );
};

export default memo(App);
