import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export { gsap, ScrollTrigger };

export function cleanupScrollTriggers(ctx: gsap.Context) {
  ctx.revert();
}

export function createScrubTimeline(
  trigger: string | Element,
  animations: (tl: gsap.core.Timeline) => void,
  options?: {
    pin?: boolean;
    scrub?: number | boolean;
    start?: string;
    end?: string;
  }
) {
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger,
      pin: options?.pin ?? false,
      scrub: options?.scrub ?? 1,
      start: options?.start ?? "top top",
      end: options?.end ?? "bottom bottom",
    },
  });

  animations(tl);
  return tl;
}
