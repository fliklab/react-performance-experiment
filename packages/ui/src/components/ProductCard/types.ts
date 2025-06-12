import { BadgeProps } from "../Badge/types";

export interface ProductCardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Product image URL */
  image: string;
  /** Product title */
  title: string;
  /** Current price */
  price: number;
  /** Original price (for showing discount) */
  originalPrice?: number;
  /** Product rating (0-5) */
  rating?: number;
  /** Number of reviews */
  reviewCount?: number;
  /** Discount information */
  discount?: number;
  /** Badge information */
  badge?: {
    text: string;
    variant?: BadgeProps["variant"];
  };
  /** Whether the product is favorited */
  isFavorite?: boolean;
  /** Callback for adding to cart */
  onAddToCart?: () => void;
  /** Callback for toggling favorite */
  onToggleFavorite?: () => void;
  /** Additional CSS classes */
  className?: string;
}
