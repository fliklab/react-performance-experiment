export interface SpinnerProps extends React.SVGAttributes<SVGSVGElement> {
  /** Spinner size */
  size?: "small" | "medium" | "large" | "xl";
  /** Spinner color variant */
  variant?: "primary" | "secondary" | "white" | "current";
  /** Additional CSS classes */
  className?: string;
}
