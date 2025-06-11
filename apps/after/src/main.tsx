import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";

// Register Service Worker for PWA support
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js")
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

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
