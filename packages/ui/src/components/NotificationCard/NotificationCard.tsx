import React from "react";
import { cn } from "../../utils/cn";
import { Avatar } from "../Avatar";
import { Button } from "../Button";
import { Icon } from "../Icon";
import { Badge } from "../Badge";
import { NotificationCardProps } from "./types";

const NotificationCard: React.FC<NotificationCardProps> = ({
  type = "info",
  title,
  message,
  timestamp,
  read = false,
  actions,
  avatar,
  onMarkAsRead,
  onDismiss,
  className,
  ...props
}) => {
  const typeStyles = {
    info: "border-blue-200 bg-blue-50",
    success: "border-green-200 bg-green-50",
    warning: "border-yellow-200 bg-yellow-50",
    error: "border-red-200 bg-red-50",
  };

  const iconMap = {
    info: "user" as const,
    success: "check" as const,
    warning: "eye" as const,
    error: "close" as const,
  };

  return (
    <div
      className={cn(
        "border rounded-lg p-4 transition-all",
        typeStyles[type],
        !read && "border-l-4",
        className
      )}
      {...props}
    >
      <div className="flex items-start space-x-3">
        {avatar ? (
          <Avatar src={avatar.src} alt={avatar.alt} size="small" />
        ) : (
          <div
            className={cn(
              "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center",
              type === "info" && "bg-blue-100 text-blue-600",
              type === "success" && "bg-green-100 text-green-600",
              type === "warning" && "bg-yellow-100 text-yellow-600",
              type === "error" && "bg-red-100 text-red-600"
            )}
          >
            <Icon name={iconMap[type]} size="small" />
          </div>
        )}

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-gray-900">{title}</h4>
            <div className="flex items-center space-x-2">
              {!read && (
                <Badge variant="primary" size="small">
                  New
                </Badge>
              )}
              <span className="text-xs text-gray-500">{timestamp}</span>
            </div>
          </div>

          <p className="mt-1 text-sm text-gray-600">{message}</p>

          {actions && actions.length > 0 && (
            <div className="mt-3 flex space-x-2">
              {actions.map((action, index) => (
                <Button
                  key={index}
                  variant={action.variant || "outline"}
                  size="small"
                  onClick={action.onClick}
                >
                  {action.label}
                </Button>
              ))}
            </div>
          )}
        </div>

        <div className="flex-shrink-0 flex space-x-1">
          {!read && onMarkAsRead && (
            <button
              onClick={onMarkAsRead}
              className="text-gray-400 hover:text-gray-600"
              title="읽음으로 표시"
            >
              <Icon name="check" size="small" />
            </button>
          )}

          {onDismiss && (
            <button
              onClick={onDismiss}
              className="text-gray-400 hover:text-gray-600"
              title="알림 닫기"
            >
              <Icon name="close" size="small" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

NotificationCard.displayName = "NotificationCard";

export { NotificationCard };
