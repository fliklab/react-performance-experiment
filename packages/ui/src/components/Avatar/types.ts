export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Image source URL */
  src?: string;
  /** Alt text for the image */
  alt?: string;
  /** Avatar size */
  size?: "small" | "medium" | "large" | "xl";
  /** Fallback text to display when image fails to load */
  fallback?: string;
  /** Additional CSS classes */
  className?: string;
}
