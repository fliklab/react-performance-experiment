export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Badge content */
  children: React.ReactNode;
  /** Badge variant style */
  variant?:
    | "default"
    | "primary"
    | "secondary"
    | "success"
    | "warning"
    | "error"
    | "outline";
  /** Badge size */
  size?: "small" | "medium" | "large";
  /** Additional CSS classes */
  className?: string;
}
