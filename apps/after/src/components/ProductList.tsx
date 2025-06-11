import React, { memo, useMemo, useCallback, useState } from "react";
import { FixedSizeGrid as Grid } from "react-window";
import { useQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import { mockProducts } from "@perf-mono/data";
import { usePerformance } from "../contexts/PerformanceContext";
import type { Product } from "@perf-mono/types";

// Optimized product card component
interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

const ProductCard = memo<ProductCardProps>(({ product, onAddToCart }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleAddToCart = useCallback(() => {
    onAddToCart(product);
  }, [product, onAddToCart]);

  const handleImageLoad = useCallback(() => {
    setImageLoaded(true);
  }, []);

  const handleImageError = useCallback(() => {
    setImageError(true);
    setImageLoaded(true);
  }, []);

  return (
    <div className="product-card">
      <div className="product-image-container">
        {!imageLoaded && <div className="image-placeholder">Loading...</div>}
        <img
          src={imageError ? "/placeholder-image.jpg" : product.images[0]}
          alt={product.name}
          className={`product-image ${imageLoaded ? "loaded" : "loading"}`}
          onLoad={handleImageLoad}
          onError={handleImageError}
          loading="lazy" // Native lazy loading
          decoding="async"
          width="200"
          height="200"
        />
      </div>

      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        <p className="product-price">${product.price.toFixed(2)}</p>
        <div className="product-rating">
          {"★".repeat(Math.floor(product.rating))}
          {"☆".repeat(5 - Math.floor(product.rating))}
          <span className="rating-value">({product.rating})</span>
        </div>
        <button
          className="add-to-cart-btn"
          onClick={handleAddToCart}
          aria-label={`Add ${product.name} to cart`}
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
});
ProductCard.displayName = "ProductCard";

// Grid item component for react-window
interface GridItemProps {
  columnIndex: number;
  rowIndex: number;
  style: React.CSSProperties;
  data: {
    products: Product[];
    columnsPerRow: number;
    onAddToCart: (product: Product) => void;
  };
}

const GridItem = memo<GridItemProps>(
  ({ columnIndex, rowIndex, style, data }) => {
    const { products, columnsPerRow, onAddToCart } = data;
    const index = rowIndex * columnsPerRow + columnIndex;
    const product = products[index];

    if (!product) {
      return <div style={style} />;
    }

    return (
      <div style={style} className="grid-item">
        <ProductCard product={product} onAddToCart={onAddToCart} />
      </div>
    );
  }
);
GridItem.displayName = "GridItem";

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

  // Calculate grid dimensions
  const { columnsPerRow, itemWidth, itemHeight } = useMemo(() => {
    const containerWidth = window.innerWidth - 40; // Account for padding
    const minItemWidth = 280;
    const cols = Math.floor(containerWidth / minItemWidth);
    const width = Math.floor(containerWidth / cols);

    return {
      columnsPerRow: Math.max(1, cols),
      itemWidth: width,
      itemHeight: 400,
    };
  }, []);

  // Calculate grid rows
  const rowCount = useMemo(() => {
    return Math.ceil(products.length / columnsPerRow);
  }, [products.length, columnsPerRow]);

  // Grid data for react-window
  const gridData = useMemo(
    () => ({
      products,
      columnsPerRow,
      onAddToCart: handleAddToCart,
    }),
    [products, columnsPerRow, handleAddToCart]
  );

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
          <Grid
            columnCount={columnsPerRow}
            columnWidth={itemWidth}
            height={600} // Fixed height for virtualization
            rowCount={rowCount}
            rowHeight={itemHeight}
            itemData={gridData}
            width={window.innerWidth - 40}
            overscanRowCount={2} // Render 2 extra rows for smooth scrolling
            overscanColumnCount={1}
          >
            {GridItem}
          </Grid>

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
