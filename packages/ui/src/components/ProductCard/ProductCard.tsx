import React from "react";
import { cn } from "../../utils/cn";
import { Button } from "../Button";
import { Badge } from "../Badge";
import { Icon } from "../Icon";
import { ProductCardProps } from "./types";

const ProductCard: React.FC<ProductCardProps> = ({
  image,
  title,
  price,
  originalPrice,
  rating = 0,
  reviewCount = 0,
  discount,
  badge,
  onAddToCart,
  onToggleFavorite,
  isFavorite = false,
  className,
  ...props
}) => {
  const discountPercent =
    originalPrice && price
      ? Math.round(((originalPrice - price) / originalPrice) * 100)
      : 0;

  return (
    <div
      className={cn(
        "bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow",
        className
      )}
      {...props}
    >
      <div className="relative">
        <img src={image} alt={title} className="w-full h-48 object-cover" />
        {badge && (
          <div className="absolute top-2 left-2">
            <Badge variant={badge.variant || "primary"} size="small">
              {badge.text}
            </Badge>
          </div>
        )}
        {discountPercent > 0 && (
          <div className="absolute top-2 right-2">
            <Badge variant="error" size="small">
              -{discountPercent}%
            </Badge>
          </div>
        )}
        <button
          onClick={onToggleFavorite}
          className={cn(
            "absolute bottom-2 right-2 p-2 rounded-full bg-white shadow-md",
            isFavorite ? "text-red-500" : "text-gray-400"
          )}
        >
          <Icon name="heart" size="small" />
        </button>
      </div>

      <div className="p-4">
        <h3 className="font-medium text-gray-900 mb-2 line-clamp-2">{title}</h3>

        <div className="flex items-center mb-2">
          {[...Array(5)].map((_, i) => (
            <Icon
              key={i}
              name="star"
              size="small"
              className={cn(
                i < Math.floor(rating) ? "text-yellow-400" : "text-gray-200"
              )}
            />
          ))}
          <span className="ml-1 text-sm text-gray-500">({reviewCount})</span>
        </div>

        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-gray-900">
              ₩{price.toLocaleString()}
            </span>
            {originalPrice && originalPrice > price && (
              <span className="text-sm text-gray-500 line-through">
                ₩{originalPrice.toLocaleString()}
              </span>
            )}
          </div>
        </div>

        <Button
          variant="primary"
          size="small"
          className="w-full"
          onClick={onAddToCart}
        >
          장바구니 담기
        </Button>
      </div>
    </div>
  );
};

ProductCard.displayName = "ProductCard";

export { ProductCard };
