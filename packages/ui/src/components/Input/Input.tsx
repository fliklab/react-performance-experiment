import React from "react";
import { cn } from "../../utils/cn";
import { InputProps } from "./types";

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      type = "text",
      label,
      placeholder,
      error,
      disabled = false,
      required = false,
      className,
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

    const baseStyles =
      "block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500";

    const variantStyles = {
      default: "border-gray-300 focus:border-blue-500 focus:ring-blue-500",
      error:
        "border-red-300 text-red-900 placeholder-red-300 focus:border-red-500 focus:ring-red-500",
      success:
        "border-green-300 text-green-900 placeholder-green-300 focus:border-green-500 focus:ring-green-500",
    };

    const inputClasses = cn(
      baseStyles,
      error ? variantStyles.error : variantStyles.default,
      className
    );

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className={cn(
              "block text-sm font-medium mb-1",
              error ? "text-red-700" : "text-gray-700"
            )}
          >
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        <input
          ref={ref}
          id={inputId}
          type={type}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          className={inputClasses}
          aria-invalid={error ? "true" : "false"}
          aria-describedby={error ? `${inputId}-error` : undefined}
          {...props}
        />

        {error && (
          <p
            id={`${inputId}-error`}
            className="mt-1 text-sm text-red-600"
            role="alert"
          >
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };
