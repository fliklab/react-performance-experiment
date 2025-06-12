import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";

// Register Service Worker for PWA support (Production only)
if ("serviceWorker" in navigator && import.meta.env.PROD) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js", {
        scope: "/",
        updateViaCache: "none", // 개발 중 캐시 비활성화
      })
      .then((registration) => {
        console.log("SW registered: ", registration);

        // Check for updates every 5 minutes
        setInterval(
          () => {
            registration.update();
          },
          5 * 60 * 1000
        );
      })
      .catch((registrationError) => {
        console.log("SW registration failed: ", registrationError);
      });
  });
} else if (import.meta.env.DEV) {
  console.log("서비스워커는 프로덕션 환경에서만 활성화됩니다.");
}

// Performance observer for monitoring
if ("PerformanceObserver" in window) {
  const observer = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      // Log performance entries for debugging
      console.log("Performance entry:", entry.name, entry.duration);
    }
  });

  observer.observe({ entryTypes: ["measure", "navigation", "resource"] });
}

const container = document.getElementById("root");
if (container) {
  const root = createRoot(container);
  root.render(
    <StrictMode>
      <App />
    </StrictMode>
  );
}
