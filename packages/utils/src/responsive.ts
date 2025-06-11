export const breakpoints = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
} as const;

export type Breakpoint = keyof typeof breakpoints;

export const useMediaQuery = (query: string): boolean => {
  if (typeof window === "undefined") return false;
  return window.matchMedia(query).matches;
};

export const getScreenSize = (): Breakpoint | "xs" => {
  if (typeof window === "undefined") return "md";

  const width = window.innerWidth;

  if (width >= breakpoints["2xl"]) return "2xl";
  if (width >= breakpoints.xl) return "xl";
  if (width >= breakpoints.lg) return "lg";
  if (width >= breakpoints.md) return "md";
  if (width >= breakpoints.sm) return "sm";
  return "xs";
};

export const isDesktop = () => {
  const screen = getScreenSize();
  return ["lg", "xl", "2xl"].includes(screen);
};

export const isMobile = () => {
  const screen = getScreenSize();
  return ["xs", "sm"].includes(screen);
};

export const isTablet = () => {
  return getScreenSize() === "md";
};
