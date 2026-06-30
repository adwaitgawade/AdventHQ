"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "@/lib/useInView";
import { prefersReducedMotion } from "@/lib/useReducedMotion";

type Props = {
  value: number;
  suffix?: string;
  prefix?: string;
  /** decimals to show (auto-detected from value if omitted) */
  decimals?: number;
  duration?: number;
  className?: string;
};

/** Counts from 0 → value when scrolled into view. Instant under reduced motion. */
export default function CountUp({
  value,
  suffix = "",
  prefix = "",
  decimals,
  duration = 1600,
  className = "",
}: Props) {
  const [ref, inView] = useInView<HTMLSpanElement>({ once: true, threshold: 0.4 });
  const [display, setDisplay] = useState(0);
  const started = useRef(false);

  const dp = decimals ?? (Number.isInteger(value) ? 0 : 1);

  useEffect(() => {
    if (!inView || started.current) return;
    started.current = true;

    if (prefersReducedMotion()) {
      setDisplay(value);
      return;
    }

    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(value * eased);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, value, duration]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {display.toFixed(dp)}
      {suffix}
    </span>
  );
}
