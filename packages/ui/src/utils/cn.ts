type ClassValue = string | number | boolean | undefined | null;

/**
 * Utility function to combine CSS classes
 * Similar to clsx but simplified for our needs
 */
export function cn(...classes: ClassValue[]): string {
  return classes.filter(Boolean).join(" ").trim();
}
