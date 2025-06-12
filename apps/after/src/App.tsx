import React, { Suspense, lazy, memo, useMemo, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { PerformanceProvider } from "./contexts/PerformanceContext";
import PerformanceDashboard from "./components/PerformanceDashboard";

// 코드 스플리팅을 위한 lazy loading
const HomePage = lazy(() => import("./pages/HomePage"));
const ProductsPage = lazy(() => import("./pages/ProductsPage"));
const CartPage = lazy(() => import("./pages/CartPage"));

// Optimized styles
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
      🚀 After App - UI Components Applied
    </h1>
    <p style={{ textAlign: "center", margin: "10px 0 0 0", color: "#666" }}>
      우리의 UI 컴포넌트 라이브러리를 사용한 최적화된 버전
    </p>

    <div style={styles.optimizationBadges}>
      <span style={getBadgeStyle("success")}>✅ Atomic Design</span>
      <span style={getBadgeStyle("success")}>✅ UI Components</span>
      <span style={getBadgeStyle("success")}>✅ TypeScript</span>
      <span style={getBadgeStyle("info")}>🎯 Performance Optimized</span>
      <span style={getBadgeStyle("warning")}>⚡ React.memo</span>
    </div>

    <nav style={styles.nav}>
      <a href="/" style={styles.navLink}>
        홈
      </a>
      <a href="/products" style={styles.navLink}>
        상품
      </a>
      <a href="/cart" style={styles.navLink}>
        장바구니
      </a>
    </nav>
  </header>
));

MemoizedHeader.displayName = "MemoizedHeader";

const App: React.FC = () => {
  const [cartCount, setCartCount] = useState(3);
  const [notificationCount, setNotificationCount] = useState(7);

  // 메모이제이션된 값들
  const appConfig = useMemo(
    () => ({
      theme: "optimized",
      version: "2.0.0",
      features: ["ui-components", "atomic-design", "typescript"],
      cartCount,
      notificationCount,
    }),
    [cartCount, notificationCount]
  );

  return (
    <PerformanceProvider>
      <Router>
        <div style={styles.appContainer}>
          <MemoizedHeader />

          <main style={styles.mainContent}>
            <Suspense
              fallback={
                <div style={styles.loadingSpinner}>
                  🔄 UI 컴포넌트 로딩 중...
                </div>
              }
            >
              <Routes>
                <Route
                  path="/"
                  element={
                    <div>
                      <h2>🎨 UI 컴포넌트 라이브러리 적용 완료</h2>
                      <p>
                        이 앱은 우리가 개발한 15개의 UI 컴포넌트를 사용합니다:
                      </p>

                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns:
                            "repeat(auto-fit, minmax(250px, 1fr))",
                          gap: "20px",
                          margin: "20px 0",
                        }}
                      >
                        <div
                          style={{
                            background: "#f8f9fa",
                            padding: "15px",
                            borderRadius: "8px",
                            border: "2px solid #e9ecef",
                          }}
                        >
                          <h3>⚛️ Atoms (6개)</h3>
                          <ul>
                            <li>Button</li>
                            <li>Input</li>
                            <li>Badge</li>
                            <li>Avatar</li>
                            <li>Spinner</li>
                            <li>Icon</li>
                          </ul>
                        </div>

                        <div
                          style={{
                            background: "#f8f9fa",
                            padding: "15px",
                            borderRadius: "8px",
                            border: "2px solid #e9ecef",
                          }}
                        >
                          <h3>🧩 Molecules (5개)</h3>
                          <ul>
                            <li>SearchBox</li>
                            <li>ProductCard</li>
                            <li>NavigationItem</li>
                            <li>CommentItem</li>
                            <li>NotificationCard</li>
                          </ul>
                        </div>

                        <div
                          style={{
                            background: "#f8f9fa",
                            padding: "15px",
                            borderRadius: "8px",
                            border: "2px solid #e9ecef",
                          }}
                        >
                          <h3>🏗️ Organisms (4개)</h3>
                          <ul>
                            <li>Header</li>
                            <li>ProductGrid</li>
                            <li>CommentList</li>
                            <li>LiveStreamPlayer</li>
                          </ul>
                        </div>
                      </div>

                      <div
                        style={{
                          background:
                            "linear-gradient(45deg, #667eea, #764ba2)",
                          color: "white",
                          padding: "20px",
                          borderRadius: "12px",
                          marginTop: "30px",
                        }}
                      >
                        <h3>🚀 성능 최적화 기능</h3>
                        <ul>
                          <li>✅ React.memo 적용된 모든 컴포넌트</li>
                          <li>✅ TypeScript 완전 지원</li>
                          <li>✅ Atomic Design 패턴</li>
                          <li>✅ 접근성(A11y) 지원</li>
                          <li>✅ 반응형 디자인</li>
                          <li>✅ 코드 스플리팅</li>
                        </ul>
                      </div>
                    </div>
                  }
                />
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
