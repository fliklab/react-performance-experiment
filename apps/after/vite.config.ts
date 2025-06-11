import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@perf-mono/types": path.resolve(__dirname, "../../packages/types/src"),
      "@perf-mono/utils": path.resolve(__dirname, "../../packages/utils/src"),
      "@perf-mono/data": path.resolve(__dirname, "../../packages/data/src"),
    },
  },

  // Optimized build configuration
  build: {
    // Target modern browsers for better optimization
    target: "es2020",

    // Enable minification
    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ["console.log"],
      },
    },

    // Code splitting configuration
    rollupOptions: {
      output: {
        // Optimize chunk splitting
        manualChunks: {
          // Vendor chunks
          "react-vendor": ["react", "react-dom"],
          "router-vendor": ["react-router-dom"],
          "query-vendor": ["@tanstack/react-query"],
          "utils-vendor": ["date-fns", "clsx"],
          "virtual-vendor": ["react-window"],
          // Shared packages
          "mono-types": ["@perf-mono/types"],
          "mono-utils": ["@perf-mono/utils"],
          "mono-data": ["@perf-mono/data"],
        },
        // Optimize chunk file names
        chunkFileNames: "assets/js/[name]-[hash].js",
        assetFileNames: (assetInfo) => {
          const extType = assetInfo.name!.split(".").pop();
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(extType!)) {
            return "assets/images/[name]-[hash][extname]";
          }
          if (/css/i.test(extType!)) {
            return "assets/css/[name]-[hash][extname]";
          }
          return "assets/[name]-[hash][extname]";
        },
      },
    },

    // Source map only in development
    sourcemap: process.env.NODE_ENV === "development",

    // Chunk size warning limit
    chunkSizeWarningLimit: 600,

    // CSS code splitting
    cssCodeSplit: true,
  },

  // Optimized dependency pre-bundling
  optimizeDeps: {
    include: [
      "react",
      "react-dom",
      "react-router-dom",
      "@tanstack/react-query",
      "date-fns",
      "clsx",
      "react-window",
      "react-intersection-observer",
      "web-vitals",
    ],
  },

  server: {
    port: 3002,
    host: true,
  },

  // Preview server configuration
  preview: {
    port: 4002,
    host: true,
  },

  // Define environment variables
  define: {
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version || "1.0.0"),
    __BUILD_TIME__: JSON.stringify(new Date().toISOString()),
  },
});
