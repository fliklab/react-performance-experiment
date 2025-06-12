import React, { useState } from "react";
import { cn } from "../../utils/cn";
import { AvatarProps } from "./types";

const Avatar: React.FC<AvatarProps> = ({
  src,
  alt,
  size = "medium",
  fallback,
  className,
  ...props
}) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(!!src);

  const handleImageError = () => {
    setImageError(true);
    setImageLoading(false);
  };

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  const sizes = {
    small: "h-8 w-8 text-xs",
    medium: "h-10 w-10 text-sm",
    large: "h-12 w-12 text-base",
    xl: "h-16 w-16 text-lg",
  };

  const baseStyles =
    "inline-flex items-center justify-center rounded-full bg-gray-100 font-medium text-gray-600 overflow-hidden";

  const avatarClasses = cn(baseStyles, sizes[size], className);

  // Generate initials from alt text or fallback
  const getInitials = (text: string): string => {
    return text
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const displayFallback = fallback || (alt ? getInitials(alt) : "?");

  return (
    <div className={avatarClasses} {...props}>
      {src && !imageError ? (
        <>
          <img
            src={src}
            alt={alt}
            className={cn(
              "h-full w-full object-cover",
              imageLoading ? "opacity-0" : "opacity-100"
            )}
            onError={handleImageError}
            onLoad={handleImageLoad}
          />
          {imageLoading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
            </div>
          )}
        </>
      ) : (
        <span>{displayFallback}</span>
      )}
    </div>
  );
};

Avatar.displayName = "Avatar";

export { Avatar };
