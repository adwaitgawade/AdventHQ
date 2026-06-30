"use client";

import Lenis from "lenis";
import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  ReactNode,
} from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/useReducedMotion";

type ScrollTarget = string | number | HTMLElement;

type LenisCtx = {
  scrollTo: (target: ScrollTarget, opts?: { offset?: number }) => void;
  stop: () => void;
  start: () => void;
};

const Ctx = createContext<LenisCtx>({
  scrollTo: () => {},
  stop: () => {},
  start: () => {},
});

/** Access smooth-scroll controls (anchor nav, back-to-top, scroll lock). */
export const useSmoothScroll = () => useContext(Ctx);

export default function SmoothScroll({ children }: { children: ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Reduced motion: skip Lenis entirely, fall back to native scrolling.
    if (prefersReducedMotion()) {
      setReady(true);
      return;
    }

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.5,
    });
    lenisRef.current = lenis;

    // Keep ScrollTrigger frame-perfect with Lenis.
    lenis.on("scroll", ScrollTrigger.update);

    const onRaf = (time: number) => {
      // GSAP ticker time is in seconds; Lenis expects ms.
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(onRaf);
    gsap.ticker.lagSmoothing(0);

    setReady(true);

    return () => {
      gsap.ticker.remove(onRaf);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  // Refresh ScrollTrigger once everything (and fonts) settle.
  useEffect(() => {
    if (!ready) return;
    const id = window.setTimeout(() => ScrollTrigger.refresh(), 300);
    return () => window.clearTimeout(id);
  }, [ready]);

  const value: LenisCtx = {
    scrollTo: (target, opts) => {
      const lenis = lenisRef.current;
      if (lenis) {
        lenis.scrollTo(target, {
          offset: opts?.offset ?? 0,
          duration: 1.2,
        });
        return;
      }
      // Reduced-motion / no-Lenis fallback.
      if (typeof target === "string") {
        document
          .querySelector(target)
          ?.scrollIntoView({ behavior: "auto", block: "start" });
      } else if (typeof target === "number") {
        window.scrollTo(0, target);
      } else {
        target.scrollIntoView({ behavior: "auto", block: "start" });
      }
    },
    stop: () => lenisRef.current?.stop(),
    start: () => lenisRef.current?.start(),
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
