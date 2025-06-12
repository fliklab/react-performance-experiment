import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// CSS-in-JS 스타일 객체 (의도적으로 무거운 스타일링)
const styles = {
  appContainer: {
    fontFamily: "Arial, sans-serif",
    background: "linear-gradient(45deg, #ff6b6b, #4ecdc4, #95e1d3, #ffa8a8)",
    backgroundSize: "400% 400%",
    animation: "gradient 15s ease infinite",
    minHeight: "100vh",
    boxShadow: "0 0 20px rgba(0, 0, 0, 0.1), 0 0 40px rgba(0, 0, 0, 0.1)",
  },
  mainContent: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "20px",
    background: "rgba(255, 255, 255, 0.9)",
    backdropFilter: "blur(10px)",
    borderRadius: "20px",
    marginTop: "20px",
    marginBottom: "20px",
    transition: "all 0.3s ease",
  },
  header: {
    background: "rgba(255, 255, 255, 0.95)",
    padding: "20px",
    borderRadius: "15px",
    marginBottom: "20px",
    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
  },
  nav: {
    display: "flex",
    gap: "20px",
    justifyContent: "center",
    marginTop: "15px",
  },
  navLink: {
    padding: "10px 20px",
    background: "linear-gradient(45deg, #667eea, #764ba2)",
    color: "white",
    textDecoration: "none",
    borderRadius: "25px",
    transition: "all 0.3s ease",
    display: "inline-block",
  },
  performanceInfo: {
    position: "fixed" as const,
    top: "10px",
    right: "10px",
    background: "rgba(0, 0, 0, 0.8)",
    color: "white",
    padding: "15px",
    borderRadius: "10px",
    fontSize: "12px",
    zIndex: 1000,
    minWidth: "200px",
  },
};

const App: React.FC = () => {
  // 의도적으로 많은 state들
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleString());
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [scrollPosition, setScrollPosition] = useState(0);
  const [renderCount, setRenderCount] = useState(0);

  // 의도적으로 빈번한 업데이트
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleString());
      setRenderCount((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // 의도적으로 무거운 계산 (lodash 없이)
  const expensiveCalculation = Array.from({ length: 100 }, (_, i) => i).reduce(
    (acc, num) => {
      return (
        acc +
        Math.sqrt(num) *
          Math.sin(num) *
          Math.cos(renderCount) *
          Math.tan(num + renderCount)
      );
    },
    0
  );

  return (
    <Router>
      <div style={styles.appContainer}>
        <div style={styles.performanceInfo}>
          <div>
            <strong>Before App - Unoptimized</strong>
          </div>
          <div>Time: {currentTime}</div>
          <div>
            Mouse: ({mousePosition.x}, {mousePosition.y})
          </div>
          <div>Scroll: {scrollPosition}px</div>
          <div>Renders: {renderCount}</div>
          <div>Heavy Calc: {expensiveCalculation.toFixed(2)}</div>
        </div>

        <header style={styles.header}>
          <h1 style={{ textAlign: "center", margin: 0, fontSize: "2.5rem" }}>
            🐌 Before App - Intentionally Slow
          </h1>
          <p style={{ textAlign: "center", margin: "10px 0 0 0" }}>
            This version demonstrates poor performance patterns
          </p>

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

        <main style={styles.mainContent}>
          <Routes>
            <Route
              path="/"
              element={
                <div>
                  <h2>Welcome to the Slow Store</h2>
                  <p>
                    This app is intentionally built with performance
                    anti-patterns:
                  </p>
                  <ul>
                    <li>❌ No React.memo or useMemo</li>
                    <li>❌ Heavy calculations on every render</li>
                    <li>❌ Frequent unnecessary re-renders</li>
                    <li>❌ Large bundle with no code splitting</li>
                    <li>❌ Heavy animations and effects</li>
                  </ul>

                  <div
                    style={{
                      marginTop: "30px",
                      padding: "20px",
                      background: "linear-gradient(45deg, #ff9a9e, #fecfef)",
                      borderRadius: "15px",
                      animation: "pulse 2s infinite",
                    }}
                  >
                    <h3>Performance Impact Demo</h3>
                    <p>
                      Every second this page re-renders with heavy calculations!
                    </p>
                    <p>Mouse tracking: Real-time position updates</p>
                    <p>
                      Scroll tracking: Continuous scroll position monitoring
                    </p>
                  </div>
                </div>
              }
            />

            <Route
              path="/products"
              element={
                <div>
                  <h2>Product List (Coming Soon)</h2>
                  <p>This will show 1000+ products without virtualization</p>
                </div>
              }
            />

            <Route
              path="/cart"
              element={
                <div>
                  <h2>Shopping Cart (Coming Soon)</h2>
                  <p>This will have inefficient cart management</p>
                </div>
              }
            />
          </Routes>
        </main>

        <style>{`
          @keyframes gradient {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
          @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.05); }
            100% { transform: scale(1); }
          }
        `}</style>
      </div>
    </Router>
  );
};

export default App;
