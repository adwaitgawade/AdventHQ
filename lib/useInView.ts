"use client";

import { RefObject, useEffect, useRef, useState } from "react";

type Options = {
  /** Stay "in view" after first intersection (good for one-shot reveals). */
  once?: boolean;
  rootMargin?: string;
  threshold?: number | number[];
};

/**
 * Thin IntersectionObserver hook. Used to lazily play/pause grid videos and
 * trigger non-GSAP reveals. Returns [ref, inView].
 */
export function useInView<T extends HTMLElement = HTMLDivElement>(
  options: Options = {}
): [RefObject<T>, boolean] {
  const { once = false, rootMargin = "0px", threshold = 0.15 } = options;
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          if (once) observer.disconnect();
        } else if (!once) {
          setInView(false);
        }
      },
      { rootMargin, threshold }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [once, rootMargin, threshold]);

  return [ref, inView];
}
