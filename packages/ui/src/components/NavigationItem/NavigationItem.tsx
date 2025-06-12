import React from "react";
import { cn } from "../../utils/cn";
import { Icon } from "../Icon";
import { Badge } from "../Badge";
import { NavigationItemProps } from "./types";

const NavigationItem: React.FC<NavigationItemProps> = ({
  children,
  href,
  icon,
  badge,
  active = false,
  disabled = false,
  onClick,
  className,
  ...props
}) => {
  const Component = href ? "a" : "button";

  return (
    <Component
      href={href}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors",
        active
          ? "bg-blue-100 text-blue-700"
          : "text-gray-600 hover:text-gray-900 hover:bg-gray-50",
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
      {...props}
    >
      {icon && <Icon name={icon} size="small" className="mr-2" />}
      <span className="flex-1">{children}</span>
      {badge && (
        <Badge variant={badge.variant} size="small">
          {badge.count}
        </Badge>
      )}
    </Component>
  );
};

NavigationItem.displayName = "NavigationItem";

export { NavigationItem };
