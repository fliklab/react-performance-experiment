import React, { Suspense, lazy, useMemo } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { PerformanceProvider } from "./contexts/PerformanceContext";
import { startVitalsCollection } from "@perf-mono/utils";
import "./App.css";
import PerformanceDashboard from "./components/PerformanceDashboard";
import { CartProvider } from "./contexts/CartContext";

// Lazy load components for code splitting
const Header = lazy(() => import("./components/Header"));
const ProductList = lazy(() => import("./components/ProductList"));
const ProductDetail = lazy(() => import("./components/ProductDetail"));
const Cart = lazy(() => import("./components/Cart"));
const Footer = lazy(() => import("./components/Footer"));

// Loading component
const LoadingSpinner = React.memo(() => (
  <div className="loading-container">
    <div className="loading-spinner">
      <div className="spinner-ring"></div>
    </div>
    <p>Loading...</p>
  </div>
));
LoadingSpinner.displayName = "LoadingSpinner";

// Create QueryClient outside component to prevent recreation
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Cache for 5 minutes
      staleTime: 5 * 60 * 1000,
      // Keep in cache for 10 minutes
      gcTime: 10 * 60 * 1000,
      // Retry failed requests 3 times
      retry: 3,
      // Refetch on window focus
      refetchOnWindowFocus: false,
    },
  },
});

const App: React.FC = () => {
  // Initialize performance monitoring once
  useMemo(() => {
    const reporter = startVitalsCollection(
      "after-basic",
      (metric) => {
        // Send to analytics
        console.log("Optimized App - Web Vital collected:", metric);

        // Store in localStorage for comparison
        const existingMetrics = JSON.parse(
          localStorage.getItem("after-metrics") || "[]"
        );
        existingMetrics.push({
          ...metric,
          timestamp: Date.now(),
          userAgent: navigator.userAgent,
        });
        localStorage.setItem("after-metrics", JSON.stringify(existingMetrics));
      },
      (event) => {
        console.log("Optimized App - Performance event:", event);
      }
    );

    // Cleanup function
    return () => {
      reporter.saveToStorage();
    };
  }, []);

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <PerformanceProvider>
          <CartProvider>
            <Router>
              <div className="app-container">
                <Suspense fallback={<LoadingSpinner />}>
                  <Header />
                </Suspense>

                <main className="main-content">
                  <Suspense fallback={<LoadingSpinner />}>
                    <Routes>
                      <Route path="/" element={<ProductList />} />
                      <Route path="/product/:id" element={<ProductDetail />} />
                      <Route path="/cart" element={<Cart />} />
                    </Routes>
                  </Suspense>
                </main>

                <Suspense fallback={<LoadingSpinner />}>
                  <Footer />
                </Suspense>

                {/* Performance Dashboard */}
                <PerformanceDashboard />
              </div>
            </Router>
          </CartProvider>
        </PerformanceProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;
