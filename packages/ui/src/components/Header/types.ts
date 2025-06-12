import { IconName } from "../Icon/types";
import { BadgeProps } from "../Badge/types";

export interface HeaderProps extends React.HTMLAttributes<HTMLElement> {
  /** Logo configuration */
  logo?: {
    image?: string;
    text?: string;
    alt?: string;
    href?: string;
  };
  /** Navigation items */
  navigation?: Array<{
    label: string;
    href?: string;
    icon?: IconName;
    active?: boolean;
    badge?: {
      count: string | number;
      variant?: BadgeProps["variant"];
    };
  }>;
  /** Current user information */
  user?: {
    name: string;
    avatar?: string;
  };
  /** Cart item count */
  cartCount?: number;
  /** Notification count */
  notificationCount?: number;
  /** Search callback */
  onSearch?: (query: string) => void;
  /** Cart click callback */
  onCartClick?: () => void;
  /** Notification click callback */
  onNotificationClick?: () => void;
  /** Profile click callback */
  onProfileClick?: () => void;
  /** Logout callback */
  onLogout?: () => void;
  /** Additional CSS classes */
  className?: string;
}
