import { defaultApiClient, slowApiClient } from "@perf-mono/utils";
import { mockProducts } from "./products";
import { mockUsers } from "./users";

// 느린 API 응답 시뮬레이션 (Before 앱용)
export const createSlowApiDelay = (ms: number = 2000) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

// 상품 API
export const productApi = {
  // 빠른 버전 (After 앱용)
  fast: {
    getAll: async () => {
      await new Promise((resolve) => setTimeout(resolve, 100));
      return mockProducts;
    },
    getById: async (id: string) => {
      await new Promise((resolve) => setTimeout(resolve, 50));
      return mockProducts.find((p) => p.id === id);
    },
  },

  // 느린 버전 (Before 앱용)
  slow: {
    getAll: async () => {
      await createSlowApiDelay(3000);
      return mockProducts;
    },
    getById: async (id: string) => {
      await createSlowApiDelay(1500);
      return mockProducts.find((p) => p.id === id);
    },
  },
};

// 사용자 API
export const userApi = {
  fast: {
    getAll: async () => {
      await new Promise((resolve) => setTimeout(resolve, 100));
      return mockUsers;
    },
  },
  slow: {
    getAll: async () => {
      await createSlowApiDelay(2000);
      return mockUsers;
    },
  },
};
