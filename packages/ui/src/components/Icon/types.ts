export type IconName =
  | "search"
  | "close"
  | "chevronDown"
  | "chevronUp"
  | "chevronLeft"
  | "chevronRight"
  | "heart"
  | "star"
  | "user"
  | "cart"
  | "menu"
  | "home"
  | "check"
  | "plus"
  | "minus"
  | "edit"
  | "trash"
  | "eye"
  | "eyeOff";

export interface IconProps extends React.SVGAttributes<SVGSVGElement> {
  /** Icon name */
  name: IconName;
  /** Icon size */
  size?: "small" | "medium" | "large" | "xl";
  /** Additional CSS classes */
  className?: string;
}
