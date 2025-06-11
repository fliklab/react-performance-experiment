import React, { memo, useCallback, useState } from "react";
import { FixedSizeList as List } from "react-window";
import { useQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import { mockProducts } from "@perf-mono/data";
import { usePerformance } from "../contexts/PerformanceContext";
import type { Product } from "@perf-mono/types";
import OptimizedImage from "./OptimizedImage";

// Optimized product card component
const ProductCard = memo<{
  product: Product;
  style?: React.CSSProperties;
  onAddToCart: (product: Product) => void;
}>(({ product, style, onAddToCart }) => {
  const handleAddToCart = useCallback(() => {
    onAddToCart(product);
  }, [product, onAddToCart]);

  return (
    <div
      style={{
        ...style,
        background: "white",
        borderRadius: "12px",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        overflow: "hidden",
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
        contain: "layout style paint",
        cursor: "pointer",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-4px)";
        e.currentTarget.style.boxShadow = "0 8px 15px rgba(0, 0, 0, 0.15)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.1)";
      }}
    >
      {/* Optimized Image */}
      <OptimizedImage
        src={product.images[0]}
        alt={product.name}
        width={280}
        height={200}
        className="product-image"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        placeholder="blur"
        quality={80}
      />

      {/* Product Info */}
      <div style={{ padding: "15px" }}>
        <h3
          style={{
            margin: "0 0 8px 0",
            fontSize: "16px",
            fontWeight: "600",
            color: "#1f2937",
            lineHeight: "1.4",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {product.name}
        </h3>

        <p
          style={{
            margin: "0 0 12px 0",
            fontSize: "14px",
            color: "#6b7280",
            lineHeight: "1.4",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {product.description}
        </p>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "12px",
          }}
        >
          <span
            style={{
              fontSize: "18px",
              fontWeight: "700",
              color: "#059669",
            }}
          >
            ${product.price.toFixed(2)}
          </span>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "4px",
            }}
          >
            <span style={{ color: "#fbbf24" }}>★</span>
            <span style={{ fontSize: "14px", color: "#6b7280" }}>
              {product.rating.toFixed(1)}
            </span>
          </div>
        </div>

        <button
          onClick={handleAddToCart}
          style={{
            width: "100%",
            padding: "8px 16px",
            background: "#3b82f6",
            color: "white",
            border: "none",
            borderRadius: "6px",
            fontSize: "14px",
            fontWeight: "500",
            cursor: "pointer",
            transition: "background-color 0.2s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#2563eb";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "#3b82f6";
          }}
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
});
ProductCard.displayName = "ProductCard";

// Virtualized row renderer
const Row = memo<{
  index: number;
  style: React.CSSProperties;
  data: {
    products: Product[];
    itemsPerRow: number;
    onAddToCart: (product: Product) => void;
  };
}>(({ index, style, data }) => {
  const { products, itemsPerRow, onAddToCart } = data;
  const startIndex = index * itemsPerRow;
  const rowProducts = products.slice(startIndex, startIndex + itemsPerRow);

  return (
    <div
      style={{
        ...style,
        display: "flex",
        gap: "20px",
        padding: "0 20px",
      }}
    >
      {rowProducts.map((product) => (
        <div key={product.id} style={{ flex: 1, minWidth: "280px" }}>
          <ProductCard product={product} onAddToCart={onAddToCart} />
        </div>
      ))}
    </div>
  );
});

// Filter component
const ProductFilters = memo<{
  onFilterChange: (filters: {
    category: string;
    sortBy: string;
    maxPrice: number;
  }) => void;
}>(({ onFilterChange }) => {
  const [category, setCategory] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [maxPrice, setMaxPrice] = useState(1000);

  const handleFilterChange = useCallback(() => {
    onFilterChange({ category, sortBy, maxPrice });
  }, [category, sortBy, maxPrice, onFilterChange]);

  React.useEffect(() => {
    handleFilterChange();
  }, [handleFilterChange]);

  return (
    <div className="product-filters">
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        aria-label="Filter by category"
      >
        <option value="all">All Categories</option>
        <option value="electronics">Electronics</option>
        <option value="clothing">Clothing</option>
        <option value="books">Books</option>
      </select>

      <select
        value={sortBy}
        onChange={(e) => setSortBy(e.target.value)}
        aria-label="Sort products"
      >
        <option value="name">Sort by Name</option>
        <option value="price">Sort by Price</option>
        <option value="rating">Sort by Rating</option>
      </select>

      <div className="price-range">
        <label htmlFor="max-price">Max Price: ${maxPrice}</label>
        <input
          id="max-price"
          type="range"
          min="0"
          max="1000"
          value={maxPrice}
          onChange={(e) => setMaxPrice(Number(e.target.value))}
        />
      </div>
    </div>
  );
});
ProductFilters.displayName = "ProductFilters";

const ProductList: React.FC = () => {
  const [filters, setFilters] = useState({
    category: "all",
    sortBy: "name",
    maxPrice: 1000,
  });

  const { addToCart } = usePerformance();
  const { ref: loadMoreRef, inView } = useInView();

  // Efficient data fetching with React Query
  const {
    data: products = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["products", filters],
    queryFn: () => Promise.resolve(mockProducts),
    select: useCallback(
      (data: Product[]) => {
        // Apply filters and sorting
        let filtered = data;

        if (filters.category !== "all") {
          filtered = filtered.filter(
            (product) => product.category === filters.category
          );
        }

        filtered = filtered.filter(
          (product) => product.price <= filters.maxPrice
        );

        // Sort products
        filtered.sort((a, b) => {
          switch (filters.sortBy) {
            case "price":
              return a.price - b.price;
            case "rating":
              return b.rating - a.rating;
            default:
              return a.name.localeCompare(b.name);
          }
        });

        return filtered;
      },
      [filters]
    ),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Memoized add to cart handler
  const handleAddToCart = useCallback(
    (product: Product) => {
      addToCart(product);

      // Optional: Show toast notification
      console.log(`Added ${product.name} to cart`);
    },
    [addToCart]
  );

  // Memoized filter handler
  const handleFilterChange = useCallback((newFilters: typeof filters) => {
    setFilters(newFilters);
  }, []);

  // Calculate virtualization parameters
  const itemsPerRow = 4; // Adjust based on screen size
  const rowHeight = 400; // Height of each row
  const totalRows = Math.ceil(products.length / itemsPerRow);

  if (error) {
    return (
      <div className="error-state">
        <h2>Error loading products</h2>
        <p>Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="product-list-container">
      <div className="product-list-header">
        <h1>Products ({products.length})</h1>
        <ProductFilters onFilterChange={handleFilterChange} />
      </div>

      {isLoading ? (
        <div className="loading-state">
          <div className="loading-grid">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="product-skeleton" />
            ))}
          </div>
        </div>
      ) : (
        <div className="virtualized-grid-container">
          <List
            height={600} // Visible height
            width={1200} // Fixed width for the list
            itemCount={totalRows}
            itemSize={rowHeight}
            itemData={{
              products,
              itemsPerRow,
              onAddToCart: handleAddToCart,
            }}
          >
            {Row}
          </List>

          {/* Load more trigger */}
          <div ref={loadMoreRef} className="load-more-trigger">
            {inView && <p>Loading more products...</p>}
          </div>
        </div>
      )}
    </div>
  );
};

export default memo(ProductList);
