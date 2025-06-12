import { IconName } from "../Icon/types";
import { BadgeProps } from "../Badge/types";

export interface NavigationItemProps extends React.HTMLAttributes<HTMLElement> {
  /** Navigation item content */
  children: React.ReactNode;
  /** Link href (makes it an anchor) */
  href?: string;
  /** Icon to display */
  icon?: IconName;
  /** Badge to display */
  badge?: {
    count: string | number;
    variant?: BadgeProps["variant"];
  };
  /** Whether the item is active */
  active?: boolean;
  /** Whether the item is disabled */
  disabled?: boolean;
  /** Click handler */
  onClick?: () => void;
  /** Additional CSS classes */
  className?: string;
}
