export interface AnimationOptions {
  duration?: number;
  easing?: string;
  delay?: number;
  fill?: "forwards" | "backwards" | "both" | "none";
}

export const easings = {
  linear: "linear",
  easeIn: "ease-in",
  easeOut: "ease-out",
  easeInOut: "ease-in-out",
  bounce: "cubic-bezier(0.68, -0.55, 0.265, 1.55)",
  elastic: "cubic-bezier(0.175, 0.885, 0.32, 1.275)",
} as const;

export const fadeIn = (
  element: HTMLElement,
  options: AnimationOptions = {}
) => {
  return element.animate([{ opacity: 0 }, { opacity: 1 }], {
    duration: options.duration || 300,
    easing: options.easing || easings.easeOut,
    delay: options.delay || 0,
    fill: options.fill || "forwards",
  });
};

export const slideIn = (
  element: HTMLElement,
  direction: "up" | "down" | "left" | "right" = "up",
  options: AnimationOptions = {}
) => {
  const transforms = {
    up: ["translateY(100%)", "translateY(0)"],
    down: ["translateY(-100%)", "translateY(0)"],
    left: ["translateX(100%)", "translateX(0)"],
    right: ["translateX(-100%)", "translateX(0)"],
  };

  return element.animate(
    [
      { transform: transforms[direction][0], opacity: 0 },
      { transform: transforms[direction][1], opacity: 1 },
    ],
    {
      duration: options.duration || 400,
      easing: options.easing || easings.easeOut,
      delay: options.delay || 0,
      fill: options.fill || "forwards",
    }
  );
};
