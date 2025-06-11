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

  // 의도적으로 성능을 낮추는 설정 (Before 앱용)
  build: {
    // 번들 분할 비활성화 (단일 거대한 파일)
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
    // 압축 비활성화
    minify: false,
    // 소스맵 활성화 (프로덕션에서)
    sourcemap: true,
    // 대용량 에셋 워닝 임계값 높이기
    chunkSizeWarningLimit: 2000,
  },

  server: {
    port: 3001,
    // 개발 서버도 의도적으로 느리게
    middlewareMode: false,
  },

  // 의도적으로 성능을 낮추는 옵션들
  optimizeDeps: {
    // 사전 번들링 비활성화
    disabled: true,
  },
});
