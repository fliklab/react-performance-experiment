import React, { useState } from "react";
import { cn } from "../../utils/cn";
import { ProductCard } from "../ProductCard";
import { Button } from "../Button";
import { Badge } from "../Badge";
import { Icon } from "../Icon";
import { Spinner } from "../Spinner";
import { ProductGridProps } from "./types";

const ProductGrid: React.FC<ProductGridProps> = ({
  products = [],
  loading = false,
  filters = [],
  sortOptions = [],
  currentSort,
  onSortChange,
  onFilterChange,
  onLoadMore,
  hasMore = false,
  className,
  ...props
}) => {
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  const handleFilterToggle = (filterId: string) => {
    const newFilters = activeFilters.includes(filterId)
      ? activeFilters.filter((id) => id !== filterId)
      : [...activeFilters, filterId];

    setActiveFilters(newFilters);
    onFilterChange?.(newFilters);
  };

  return (
    <div className={cn("w-full", className)} {...props}>
      {/* Filters and Sort */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 space-y-4 md:space-y-0">
        {/* Filters */}
        {filters.length > 0 && (
          <div className="flex flex-wrap gap-2">
            <span className="text-sm font-medium text-gray-700 mr-2">
              필터:
            </span>
            {filters.map((filter) => (
              <Button
                key={filter.id}
                variant={
                  activeFilters.includes(filter.id) ? "primary" : "outline"
                }
                size="small"
                onClick={() => handleFilterToggle(filter.id)}
              >
                {filter.label}
                {filter.count && (
                  <Badge variant="secondary" size="small" className="ml-2">
                    {filter.count}
                  </Badge>
                )}
              </Button>
            ))}
            {activeFilters.length > 0 && (
              <Button
                variant="ghost"
                size="small"
                onClick={() => {
                  setActiveFilters([]);
                  onFilterChange?.([]);
                }}
              >
                <Icon name="close" size="small" className="mr-1" />
                초기화
              </Button>
            )}
          </div>
        )}

        {/* Sort */}
        {sortOptions.length > 0 && (
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-700">정렬:</span>
            <select
              value={currentSort}
              onChange={(e) => onSortChange?.(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Products Grid */}
      {loading && products.length === 0 ? (
        <div className="flex justify-center items-center py-12">
          <Spinner size="large" />
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-12">
          <Icon
            name="search"
            size="xl"
            className="mx-auto text-gray-400 mb-4"
          />
          <p className="text-lg font-medium text-gray-900 mb-2">
            상품이 없습니다
          </p>
          <p className="text-gray-500">다른 검색어나 필터를 시도해보세요.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                image={product.image}
                title={product.title}
                price={product.price}
                originalPrice={product.originalPrice}
                rating={product.rating}
                reviewCount={product.reviewCount}
                badge={product.badge}
                isFavorite={product.isFavorite}
                onAddToCart={product.onAddToCart}
                onToggleFavorite={product.onToggleFavorite}
              />
            ))}
          </div>

          {/* Load More */}
          {hasMore && (
            <div className="flex justify-center mt-8">
              {loading ? (
                <Spinner size="medium" />
              ) : (
                <Button variant="outline" onClick={onLoadMore} className="px-8">
                  더 보기
                </Button>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

ProductGrid.displayName = "ProductGrid";

export { ProductGrid };
