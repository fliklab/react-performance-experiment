import type { Product } from "@perf-mono/types";

// 상품 카테고리
export const categories = [
  "Electronics",
  "Clothing",
  "Home & Garden",
  "Sports & Outdoors",
  "Books",
  "Beauty & Health",
  "Toys & Games",
  "Automotive",
  "Food & Beverage",
  "Office Supplies",
];

// 태그 목록
export const tags = [
  "bestseller",
  "new-arrival",
  "limited-edition",
  "eco-friendly",
  "premium",
  "budget-friendly",
  "trending",
  "seasonal",
  "imported",
  "handmade",
];

// 상품 이름 예시
const productNames = [
  "Premium Wireless Headphones",
  "Organic Cotton T-Shirt",
  "Smart Home Hub",
  "Professional Running Shoes",
  "Bestselling Novel",
  "Natural Skincare Set",
  "Educational Board Game",
  "Car Phone Mount",
  "Gourmet Coffee Beans",
  "Ergonomic Office Chair",
];

// 상품 설명 예시
const descriptions = [
  "High-quality product with excellent features and durability.",
  "Made from premium materials with attention to detail.",
  "Perfect for everyday use with modern design.",
  "Innovative technology meets elegant style.",
  "Trusted by professionals and enthusiasts worldwide.",
];

// 랜덤 선택 헬퍼
const randomChoice = <T>(array: T[]): T =>
  array[Math.floor(Math.random() * array.length)];
const randomChoices = <T>(array: T[], count: number): T[] => {
  const result: T[] = [];
  for (let i = 0; i < count; i++) {
    result.push(randomChoice(array));
  }
  return [...new Set(result)]; // 중복 제거
};

// UUID 생성 (간단한 버전)
const generateId = (): string => {
  return "xxxx-xxxx-4xxx-yxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

// 날짜 생성 헬퍼
const randomPastDate = (days: number): string => {
  const now = new Date();
  const past = new Date(
    now.getTime() - Math.random() * days * 24 * 60 * 60 * 1000
  );
  return past.toISOString();
};

// 단일 상품 생성
export const createProduct = (id?: string): Product => {
  const price = Math.floor(Math.random() * 990) + 10; // 10-1000
  const originalPrice =
    Math.random() > 0.7
      ? price + Math.floor(Math.random() * 100) + 10
      : undefined;

  return {
    id: id || generateId(),
    name: randomChoice(productNames),
    description: randomChoice(descriptions),
    price,
    originalPrice,
    images: Array.from(
      { length: Math.floor(Math.random() * 5) + 1 },
      (_, i) =>
        `https://picsum.photos/800/600?random=${Math.floor(Math.random() * 1000)}`
    ),
    category: randomChoice(categories),
    tags: randomChoices(tags, Math.floor(Math.random() * 3) + 1),
    rating: parseFloat((Math.random() * 4 + 1).toFixed(1)), // 1.0-5.0
    reviewCount: Math.floor(Math.random() * 500),
    inStock: Math.random() > 0.1, // 90% 확률로 재고 있음
    featured: Math.random() > 0.8, // 20% 확률로 추천 상품
    createdAt: randomPastDate(730), // 2년 전까지
    updatedAt: randomPastDate(30), // 30일 전까지
  };
};

// 대량 상품 생성 (성능 테스트용)
export const createProducts = (count: number = 1000): Product[] => {
  return Array.from({ length: count }, (_, index) =>
    createProduct(`product-${index + 1}`)
  );
};

// 추천 상품 생성
export const createFeaturedProducts = (count: number = 20): Product[] => {
  return Array.from({ length: count }, (_, index) => ({
    ...createProduct(`featured-${index + 1}`),
    featured: true,
    rating: parseFloat((Math.random() * 1 + 4).toFixed(1)), // 4.0-5.0
    reviewCount: Math.floor(Math.random() * 450) + 50, // 50-500
  }));
};

// 카테고리별 상품 생성
export const createProductsByCategory = (
  category: string,
  count: number = 50
): Product[] => {
  return Array.from({ length: count }, (_, index) => ({
    ...createProduct(`${category.toLowerCase()}-${index + 1}`),
    category,
  }));
};

// 가격대별 상품 생성
export const createProductsByPriceRange = (
  minPrice: number,
  maxPrice: number,
  count: number = 30
): Product[] => {
  return Array.from({ length: count }, (_, index) => {
    const product = createProduct(`price-${minPrice}-${maxPrice}-${index + 1}`);
    product.price =
      Math.floor(Math.random() * (maxPrice - minPrice)) + minPrice;
    return product;
  });
};

// 기본 상품 데이터 세트
export const mockProducts = createProducts(1000);
export const featuredProducts = createFeaturedProducts(20);

// 성능 테스트용 대용량 데이터
export const generateLargeProductDataset = (
  size: number = 10000
): Product[] => {
  console.log(`Generating ${size} products for performance testing...`);
  return createProducts(size);
};

// 상품 검색 시뮬레이션
export const searchProducts = (
  products: Product[],
  query: string,
  category?: string,
  minPrice?: number,
  maxPrice?: number
): Product[] => {
  return products.filter((product) => {
    const matchesQuery =
      !query ||
      product.name.toLowerCase().includes(query.toLowerCase()) ||
      product.description.toLowerCase().includes(query.toLowerCase()) ||
      product.tags.some((tag) =>
        tag.toLowerCase().includes(query.toLowerCase())
      );

    const matchesCategory = !category || product.category === category;
    const matchesPrice =
      (!minPrice || product.price >= minPrice) &&
      (!maxPrice || product.price <= maxPrice);

    return matchesQuery && matchesCategory && matchesPrice;
  });
};

// 상품 정렬
export const sortProducts = (
  products: Product[],
  sortBy: string,
  order: "asc" | "desc" = "asc"
): Product[] => {
  return [...products].sort((a, b) => {
    let aValue: any, bValue: any;

    switch (sortBy) {
      case "name":
        aValue = a.name.toLowerCase();
        bValue = b.name.toLowerCase();
        break;
      case "price":
        aValue = a.price;
        bValue = b.price;
        break;
      case "rating":
        aValue = a.rating;
        bValue = b.rating;
        break;
      case "createdAt":
        aValue = new Date(a.createdAt).getTime();
        bValue = new Date(b.createdAt).getTime();
        break;
      default:
        return 0;
    }

    if (aValue < bValue) return order === "asc" ? -1 : 1;
    if (aValue > bValue) return order === "asc" ? 1 : -1;
    return 0;
  });
};
