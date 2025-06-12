import { ButtonProps } from "../Button/types";

export interface NotificationCardProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /** Notification type */
  type?: "info" | "success" | "warning" | "error";
  /** Notification title */
  title: string;
  /** Notification message */
  message: string;
  /** Timestamp string */
  timestamp: string;
  /** Whether the notification has been read */
  read?: boolean;
  /** Action buttons */
  actions?: Array<{
    label: string;
    variant?: ButtonProps["variant"];
    onClick: () => void;
  }>;
  /** Avatar information */
  avatar?: {
    src: string;
    alt: string;
  };
  /** Callback for marking as read */
  onMarkAsRead?: () => void;
  /** Callback for dismissing notification */
  onDismiss?: () => void;
  /** Additional CSS classes */
  className?: string;
}
