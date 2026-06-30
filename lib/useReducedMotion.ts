"use client";

import { useEffect, useState } from "react";

/**
 * Reactive `prefers-reduced-motion`. Defaults to `true` (the safe, motionless
 * path) during SSR / first paint so we never flash heavy animation before we
 * know the user's preference.
 */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(true);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return reduced;
}

/** Non-reactive read for one-off imperative checks (e.g. inside GSAP setup). */
export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return true;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
