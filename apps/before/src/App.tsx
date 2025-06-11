import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import styled from "styled-components";
import _ from "lodash";
import moment from "moment";

// 의도적으로 무거운 import들
import { startVitalsCollection } from "@perf-mono/utils";
import { productApi } from "@perf-mono/data";
import type { Product } from "@perf-mono/types";

// 컴포넌트들
import Header from "./components/Header";
import ProductList from "./components/ProductList";
import ProductDetail from "./components/ProductDetail";
import Cart from "./components/Cart";
import Footer from "./components/Footer";

// 의도적으로 무거운 스타일링
const AppContainer = styled.div`
  font-family: "Arial", sans-serif;
  background: linear-gradient(45deg, #ff6b6b, #4ecdc4, #95e1d3, #ffa8a8);
  background-size: 400% 400%;
  animation: gradient 15s ease infinite;
  min-height: 100vh;

  @keyframes gradient {
    0% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
    100% {
      background-position: 0% 50%;
    }
  }

  /* 의도적으로 무거운 그림자와 효과들 */
  box-shadow:
    0 0 20px rgba(0, 0, 0, 0.1),
    0 0 40px rgba(0, 0, 0, 0.1),
    0 0 80px rgba(0, 0, 0, 0.1);
`;

const MainContent = styled.main`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  margin-top: 20px;
  margin-bottom: 20px;

  /* 의도적으로 무거운 애니메이션 */
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.01);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
  }
`;

// 의도적으로 성능을 낮추는 전역 상태 관리
interface AppState {
  products: Product[];
  loading: boolean;
  cart: Product[];
  user: any;
  theme: string;
  language: string;
  notifications: any[];
  history: any[];
}

const App: React.FC = () => {
  // 의도적으로 너무 많은 state들
  const [state, setState] = useState<AppState>({
    products: [],
    loading: true,
    cart: [],
    user: null,
    theme: "light",
    language: "en",
    notifications: [],
    history: [],
  });

  // 의도적으로 비효율적인 state 업데이트들
  const [currentTime, setCurrentTime] = useState(
    moment().format("YYYY-MM-DD HH:mm:ss")
  );
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [scrollPosition, setScrollPosition] = useState(0);

  // 성능 측정 시작
  useEffect(() => {
    const reporter = startVitalsCollection(
      "before",
      (metric) => {
        console.log("Web Vital collected:", metric);
      },
      (event) => {
        console.log("Performance event:", event);
      }
    );

    return () => {
      reporter.saveToStorage();
    };
  }, []);

  // 의도적으로 너무 빈번한 업데이트들
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(moment().format("YYYY-MM-DD HH:mm:ss"));
    }, 1000); // 매초마다 렌더링 유발

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // 의도적으로 느린 데이터 로딩
  useEffect(() => {
    const loadData = async () => {
      setState((prev) => ({ ...prev, loading: true }));

      try {
        // 느린 API 사용
        const products = await productApi.slow.getAll();

        // 의도적으로 무거운 데이터 처리
        const processedProducts = products.map((product) => {
          return {
            ...product,
            // 의도적으로 무거운 계산들
            processedDescription: _.repeat(product.description, 3),
            formattedDate: moment(product.createdAt).format(
              "MMMM Do YYYY, h:mm:ss a"
            ),
            calculations: {
              discountPercent: product.originalPrice
                ? Math.round(
                    ((product.originalPrice - product.price) /
                      product.originalPrice) *
                      100
                  )
                : 0,
              priceInWords: product.price
                .toString()
                .split("")
                .map(
                  (d) =>
                    [
                      "zero",
                      "one",
                      "two",
                      "three",
                      "four",
                      "five",
                      "six",
                      "seven",
                      "eight",
                      "nine",
                    ][parseInt(d)]
                )
                .join(" "),
              randomCalculations: _.range(100).map(
                () => Math.random() * product.price
              ),
            },
          };
        });

        setState((prev) => ({
          ...prev,
          products: processedProducts,
          loading: false,
          history: [
            ...prev.history,
            { action: "loaded_products", time: currentTime },
          ],
        }));
      } catch (error) {
        console.error("Failed to load products:", error);
        setState((prev) => ({ ...prev, loading: false }));
      }
    };

    loadData();
  }, []); // 의도적으로 dependency 누락

  // 의도적으로 무거운 render 계산들
  const renderCalculations = () => {
    // 매 렌더링마다 무거운 계산
    const expensiveCalculation = _.range(1000).reduce((acc, num) => {
      return acc + Math.sqrt(num) * Math.sin(num);
    }, 0);

    return (
      <div
        style={{
          position: "fixed",
          top: 10,
          right: 10,
          background: "rgba(0,0,0,0.5)",
          color: "white",
          padding: "10px",
          borderRadius: "5px",
          fontSize: "12px",
          zIndex: 1000,
        }}
      >
        <div>Time: {currentTime}</div>
        <div>
          Window: {windowSize.width}x{windowSize.height}
        </div>
        <div>
          Mouse: ({mousePosition.x}, {mousePosition.y})
        </div>
        <div>Scroll: {scrollPosition}px</div>
        <div>Calc: {expensiveCalculation.toFixed(2)}</div>
        <div>Products: {state.products.length}</div>
      </div>
    );
  };

  const addToCart = (product: Product) => {
    setState((prev) => ({
      ...prev,
      cart: [...prev.cart, product],
      history: [
        ...prev.history,
        { action: "add_to_cart", product: product.id, time: currentTime },
      ],
    }));
  };

  return (
    <Router>
      <AppContainer>
        {renderCalculations()}

        <Header
          cartCount={state.cart.length}
          currentTime={currentTime}
          user={state.user}
        />

        <MainContent>
          <Routes>
            <Route
              path="/"
              element={
                <ProductList
                  products={state.products}
                  loading={state.loading}
                  onAddToCart={addToCart}
                  mousePosition={mousePosition}
                />
              }
            />
            <Route
              path="/product/:id"
              element={
                <ProductDetail
                  products={state.products}
                  onAddToCart={addToCart}
                />
              }
            />
            <Route
              path="/cart"
              element={
                <Cart
                  items={state.cart}
                  onUpdateCart={(newCart: Product[]) =>
                    setState((prev) => ({ ...prev, cart: newCart }))
                  }
                />
              }
            />
          </Routes>
        </MainContent>

        <Footer scrollPosition={scrollPosition} windowSize={windowSize} />
      </AppContainer>
    </Router>
  );
};

export default App;
