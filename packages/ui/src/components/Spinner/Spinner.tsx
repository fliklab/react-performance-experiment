import React from "react";
import { cn } from "../../utils/cn";
import { SpinnerProps } from "./types";

const Spinner: React.FC<SpinnerProps> = ({
  size = "medium",
  variant = "primary",
  className,
  ...props
}) => {
  const sizes = {
    small: "h-4 w-4",
    medium: "h-6 w-6",
    large: "h-8 w-8",
    xl: "h-12 w-12",
  };

  const variants = {
    primary: "text-blue-600",
    secondary: "text-gray-600",
    white: "text-white",
    current: "text-current",
  };

  const spinnerClasses = cn(
    "animate-spin",
    sizes[size],
    variants[variant],
    className
  );

  return (
    <svg
      className={spinnerClasses}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      role="status"
      aria-label="Loading"
      {...props}
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
};

Spinner.displayName = "Spinner";

export { Spinner };
