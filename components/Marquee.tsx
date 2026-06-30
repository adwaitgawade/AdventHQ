"use client";

import { useEffect, useRef } from "react";
import { capabilities } from "@/data/clients";
import { prefersReducedMotion, useReducedMotion } from "@/lib/useReducedMotion";

/**
 * Infinite marquee whose speed and direction react to scroll velocity.
 * Doubles as a quiet capability / logo strip. Under reduced motion it renders
 * as a static, wrapped row.
 */
export default function Marquee() {
  const trackRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const track = trackRef.current;
    if (!track) return;

    let raf = 0;
    let offset = 0;
    const baseSpeed = 0.6; // px per frame, drift
    let velocity = 0;
    let lastScroll = window.scrollY;

    const onScroll = () => {
      const delta = window.scrollY - lastScroll;
      lastScroll = window.scrollY;
      // scroll feeds the marquee; clamp so it never goes wild
      velocity = Math.max(-40, Math.min(40, delta));
    };

    const half = () => track.scrollWidth / 2;

    const tick = () => {
      velocity *= 0.9; // ease velocity back to rest
      offset -= baseSpeed + velocity;
      const h = half();
      if (h > 0) {
        if (offset <= -h) offset += h;
        if (offset > 0) offset -= h;
      }
      track.style.transform = `translate3d(${offset}px,0,0)`;
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const items = [...capabilities, ...capabilities];

  return (
    <section
      aria-label="Capabilities"
      className="border-y border-line bg-base py-6 md:py-8"
    >
      <div className={reduced ? "px-[var(--gutter)]" : "flex overflow-hidden"}>
        <div
          ref={trackRef}
          className={
            reduced
              ? "mx-auto flex max-w-shell flex-wrap items-center justify-center gap-x-10 gap-y-3"
              : "flex shrink-0 flex-nowrap items-center gap-10 whitespace-nowrap will-change-transform md:gap-16"
          }
        >
          {items.map((cap, i) => (
            <span key={i} className="flex items-center gap-10 md:gap-16">
              <span className="display text-3xl text-muted md:text-5xl">
                {cap}
              </span>
              <span className="text-accent" aria-hidden>
                ✦
              </span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
