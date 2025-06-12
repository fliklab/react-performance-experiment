import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PerformanceDashboard from "./components/PerformanceDashboard";
import { PerformanceProvider } from "./contexts/PerformanceContext";

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

// 의도적으로 무거운 컴포넌트 (React.memo 없음)
const ExpensiveProductCard = ({ product }: { product: any }) => {
  // 매번 렌더링마다 무거운 계산
  const expensiveCalculation = Array.from(
    { length: 1000 },
    (_, i) => Math.sqrt(i) * Math.sin(i) * Math.cos(i)
  ).reduce((a, b) => a + b, 0);

  return (
    <div
      style={{
        border: "1px solid #ddd",
        borderRadius: "8px",
        padding: "15px",
        margin: "10px",
        background: "white",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        transform: `translateY(${expensiveCalculation % 2}px)`, // 의도적으로 불필요한 계산 사용
      }}
    >
      <img
        src={`https://picsum.photos/200/200?random=${product.id}`}
        alt={product.name}
        style={{ width: "100%", height: "150px", objectFit: "cover" }}
      />
      <h4>{product.name}</h4>
      <p>{product.price.toLocaleString()}원</p>
      <button
        style={{
          background: "linear-gradient(45deg, #ff6b6b, #4ecdc4)",
          color: "white",
          border: "none",
          padding: "8px 16px",
          borderRadius: "5px",
          cursor: "pointer",
        }}
        onClick={() => {
          // 의도적으로 무거운 클릭 핸들러
          for (let i = 0; i < 10000; i++) {
            Math.random();
          }
          console.log("Added to cart:", product.name);
        }}
      >
        장바구니 담기
      </button>
    </div>
  );
};

const App: React.FC = () => {
  // 의도적으로 많은 state들
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleString());
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [scrollPosition, setScrollPosition] = useState(0);
  const [renderCount, setRenderCount] = useState(0);
  const [products] = useState(
    Array.from({ length: 50 }, (_, i) => ({
      id: i,
      name: `상품 ${i + 1}`,
      price: Math.floor(Math.random() * 100000) + 10000,
    }))
  );

  // 의도적으로 빈번한 업데이트
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleString());
      setRenderCount((prev) => prev + 1);
    }, 100); // 매우 빈번한 업데이트

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

  // 의도적으로 무거운 계산 (매 렌더마다 실행)
  const expensiveCalculation = Array.from({ length: 5000 }, (_, i) => i).reduce(
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
            <strong>🐌 Before App - Unoptimized</strong>
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
            🐌 Before App - 의도적으로 느린 버전
          </h1>
          <p style={{ textAlign: "center", margin: "10px 0 0 0" }}>
            성능 안티 패턴을 보여주는 버전 (UI 컴포넌트 라이브러리 미사용)
          </p>

          <nav style={styles.nav}>
            <a href="/" style={styles.navLink}>
              홈
            </a>
            <a href="/products" style={styles.navLink}>
              상품 ({products.length}개)
            </a>
            <a href="/cart" style={styles.navLink}>
              장바구니
            </a>
          </nav>
        </header>

        <PerformanceProvider>
          <main style={styles.mainContent}>
            <Routes>
              <Route
                path="/"
                element={
                  <div>
                    <h2>🚫 성능 안티 패턴 데모</h2>
                    <p>이 앱은 의도적으로 성능 안티 패턴을 사용합니다:</p>

                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns:
                          "repeat(auto-fit, minmax(250px, 1fr))",
                        gap: "15px",
                        margin: "20px 0",
                      }}
                    >
                      <div
                        style={{
                          background: "#ffe6e6",
                          padding: "15px",
                          borderRadius: "8px",
                          border: "2px solid #ffb3b3",
                        }}
                      >
                        <h3>❌ 성능 문제들</h3>
                        <ul>
                          <li>React.memo 미사용</li>
                          <li>무거운 계산 매 렌더마다</li>
                          <li>불필요한 리렌더링</li>
                          <li>인라인 스타일 남용</li>
                          <li>이벤트 핸들러 최적화 안됨</li>
                        </ul>
                      </div>

                      <div
                        style={{
                          background: "#ffe6e6",
                          padding: "15px",
                          borderRadius: "8px",
                          border: "2px solid #ffb3b3",
                        }}
                      >
                        <h3>🔥 실시간 문제</h3>
                        <ul>
                          <li>100ms마다 시간 업데이트</li>
                          <li>마우스 추적 매 픽셀</li>
                          <li>스크롤 위치 실시간</li>
                          <li>5000번 계산 매 렌더</li>
                          <li>50개 제품 최적화 안됨</li>
                        </ul>
                      </div>
                    </div>

                    <div
                      style={{
                        marginTop: "30px",
                        padding: "20px",
                        background: "linear-gradient(45deg, #ff9a9e, #fecfef)",
                        borderRadius: "15px",
                        animation: "pulse 2s infinite",
                      }}
                    >
                      <h3>📊 성능 비교</h3>
                      <p>
                        <strong>Before App</strong>: 매 0.1초마다 리렌더링,
                        무거운 계산
                      </p>
                      <p>
                        <strong>After App</strong>: 최적화된 렌더링, UI 컴포넌트
                        라이브러리 사용
                      </p>
                      <p>개발자 도구로 성능 차이를 확인해보세요!</p>
                    </div>
                  </div>
                }
              />

              <Route
                path="/products"
                element={
                  <div>
                    <h2>🛍️ 상품 목록 (최적화 안됨)</h2>
                    <p>모든 상품이 매번 리렌더링됩니다!</p>

                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns:
                          "repeat(auto-fit, minmax(200px, 1fr))",
                        gap: "10px",
                      }}
                    >
                      {products.map((product) => (
                        <ExpensiveProductCard
                          key={product.id}
                          product={product}
                        />
                      ))}
                    </div>
                  </div>
                }
              />

              <Route
                path="/cart"
                element={
                  <div>
                    <h2>🛒 장바구니</h2>
                    <p>장바구니 기능 (성능 안티 패턴 적용)</p>
                    <div
                      style={{
                        background: "#f0f0f0",
                        padding: "20px",
                        borderRadius: "8px",
                        marginTop: "20px",
                      }}
                    >
                      <p>현재 시간: {currentTime}</p>
                      <p>
                        마우스 위치: ({mousePosition.x}, {mousePosition.y})
                      </p>
                      <p>렌더링 횟수: {renderCount}</p>
                    </div>
                  </div>
                }
              />
            </Routes>
          </main>

          <PerformanceDashboard />
        </PerformanceProvider>
      </div>
    </Router>
  );
};

export default App;
