import { ProductCardProps } from "../ProductCard/types";

export interface Product extends Omit<ProductCardProps, "className"> {
  id: string;
}

export interface Filter {
  id: string;
  label: string;
  count?: number;
}

export interface SortOption {
  value: string;
  label: string;
}

export interface ProductGridProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Array of products to display */
  products?: Product[];
  /** Whether data is loading */
  loading?: boolean;
  /** Available filters */
  filters?: Filter[];
  /** Available sort options */
  sortOptions?: SortOption[];
  /** Current sort value */
  currentSort?: string;
  /** Sort change callback */
  onSortChange?: (sortValue: string) => void;
  /** Filter change callback */
  onFilterChange?: (activeFilters: string[]) => void;
  /** Load more callback */
  onLoadMore?: () => void;
  /** Whether there are more items to load */
  hasMore?: boolean;
  /** Additional CSS classes */
  className?: string;
}
