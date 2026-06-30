"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * Central GSAP registration. Import { gsap, ScrollTrigger } from here so the
 * plugin is only registered once and tree-shaking stays predictable.
 */
let registered = false;

if (typeof window !== "undefined" && !registered) {
  gsap.registerPlugin(ScrollTrigger);
  // Custom brand ease — everything glides, nothing bounces.
  gsap.config({ nullTargetWarn: false });
  registered = true;
}

export const GLIDE = "power3.out";
export const GLIDE_CUBIC = [0.16, 1, 0.3, 1] as const;

export { gsap, ScrollTrigger };
