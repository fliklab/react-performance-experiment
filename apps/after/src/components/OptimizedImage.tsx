import React, { useState, useCallback, memo } from "react";
import { useInView } from "react-intersection-observer";

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  sizes?: string;
  priority?: boolean;
  placeholder?: "blur" | "empty";
  quality?: number;
}

// Modern image format detection
const supportsWebP = (() => {
  if (typeof window === "undefined") return false;

  const canvas = document.createElement("canvas");
  canvas.width = 1;
  canvas.height = 1;
  return canvas.toDataURL("image/webp").indexOf("data:image/webp") === 0;
})();

const supportsAVIF = (() => {
  if (typeof window === "undefined") return false;

  const canvas = document.createElement("canvas");
  canvas.width = 1;
  canvas.height = 1;
  return canvas.toDataURL("image/avif").indexOf("data:image/avif") === 0;
})();

// Generate optimized image URLs
const getOptimizedImageUrl = (src: string, width?: number, quality = 75) => {
  // For picsum.photos, we can specify format and quality
  if (src.includes("picsum.photos")) {
    const baseUrl = src.split("?")[0];

    if (width) {
      // Update the URL to use specified width (maintaining aspect ratio)
      const urlParts = baseUrl.split("/");
      if (urlParts.length >= 5) {
        urlParts[4] = width.toString(); // width
        urlParts[5] = Math.round(width * 0.75).toString(); // height (4:3 ratio)
      }
      return urlParts.join("/") + `?quality=${quality}`;
    }

    return src + `?quality=${quality}`;
  }

  return src;
};

const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  width,
  height,
  className = "",
  sizes,
  priority = false,
  placeholder = "empty",
  quality = 75,
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState<string | null>(
    priority ? src : null
  );

  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
    skip: priority, // Skip intersection observer for priority images
  });

  // Load image when in view (or immediately if priority)
  React.useEffect(() => {
    if (priority || inView) {
      setCurrentSrc(getOptimizedImageUrl(src, width, quality));
    }
  }, [inView, priority, src, width, quality]);

  const handleLoad = useCallback(() => {
    setImageLoaded(true);
  }, []);

  const handleError = useCallback(() => {
    setImageError(true);
    setImageLoaded(true);

    // Fallback to original src if optimized version fails
    if (currentSrc !== src) {
      setCurrentSrc(src);
      setImageError(false);
      setImageLoaded(false);
    }
  }, [currentSrc, src]);

  // Generate blur placeholder
  const blurPlaceholder =
    placeholder === "blur"
      ? "data:image/svg+xml;base64," +
        btoa(`
      <svg width="${width || 400}" height="${height || 300}" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#f3f4f6"/>
        <text x="50%" y="50%" font-family="Arial" font-size="14" fill="#9ca3af" text-anchor="middle" dy=".3em">
          Loading...
        </text>
      </svg>
    `)
      : undefined;

  return (
    <div
      ref={ref}
      className={`image-container ${className}`}
      style={{
        position: "relative",
        width: width ? `${width}px` : "100%",
        height: height ? `${height}px` : "auto",
        overflow: "hidden",
      }}
    >
      {/* Placeholder */}
      {!imageLoaded && currentSrc && (
        <div
          className="image-placeholder"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background:
              placeholder === "blur" ? `url(${blurPlaceholder})` : "#f3f4f6",
            backgroundSize: "cover",
            backgroundPosition: "center",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#9ca3af",
            fontSize: "14px",
          }}
        >
          {placeholder === "empty" && "Loading..."}
        </div>
      )}

      {/* Main image with modern format support */}
      {currentSrc && (
        <picture>
          {/* AVIF format for maximum compression */}
          {supportsAVIF && (
            <source
              srcSet={getOptimizedImageUrl(currentSrc, width, quality)}
              type="image/avif"
              sizes={sizes}
            />
          )}

          {/* WebP format for good compression and compatibility */}
          {supportsWebP && (
            <source
              srcSet={getOptimizedImageUrl(currentSrc, width, quality)}
              type="image/webp"
              sizes={sizes}
            />
          )}

          {/* Fallback JPEG/PNG */}
          <img
            src={currentSrc}
            alt={alt}
            width={width}
            height={height}
            onLoad={handleLoad}
            onError={handleError}
            loading={priority ? "eager" : "lazy"}
            decoding="async"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              opacity: imageLoaded ? 1 : 0,
              transition: "opacity 0.3s ease",
            }}
            sizes={sizes}
          />
        </picture>
      )}

      {/* Error state */}
      {imageError && currentSrc === src && (
        <div
          className="image-error"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "#fee2e2",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#dc2626",
            fontSize: "14px",
          }}
        >
          Failed to load image
        </div>
      )}
    </div>
  );
};

export default memo(OptimizedImage);
