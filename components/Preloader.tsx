"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useSmoothScroll } from "./SmoothScroll";

const GLIDE = [0.16, 1, 0.3, 1] as const;

/** Fired the moment the panel starts wiping up, so the hero can begin playback. */
export const PRELOAD_DONE_EVENT = "advent:preload-done";
const signalDone = () => {
  try {
    window.dispatchEvent(new Event(PRELOAD_DONE_EVENT));
  } catch { }
};

/**
 * Brief (~1.5s) intro: wordmark mask-reveals while a counter runs 0→100, then
 * the panel wipes up to expose the hero.
 *
 * It renders ACTIVE on the server / first paint so it covers the hero from the
 * very first frame (no flash of hero-then-preloader). Returning / reduced-motion
 * users are skipped *before paint* by the inline script in app/layout.tsx, which
 * sets `data-skip-preloader` on <html> and a CSS rule hides this panel instantly.
 */
export default function Preloader() {
  const [active, setActive] = useState(true);
  const [count, setCount] = useState(0);
  const { stop, start } = useSmoothScroll();

  useEffect(() => {
    // The blocking inline script already decided whether to skip, before paint.
    const skip = document.documentElement.hasAttribute("data-skip-preloader");
    if (skip) {
      setActive(false);
      signalDone();
      return;
    }

    stop();
    document.body.style.overflow = "hidden";

    const duration = 1400;
    const startTs = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - startTs) / duration);
      setCount(Math.round(t * 100));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const done = window.setTimeout(() => {
      setActive(false);
      signalDone();
      try {
        sessionStorage.setItem("advent-preloaded", "1");
      } catch { }
      document.body.style.overflow = "";
      start();
    }, duration + 300);

    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(done);
      document.body.style.overflow = "";
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          id="preloader"
          className="fixed inset-0 z-[120] flex items-end justify-between bg-base px-[var(--gutter)] pb-12"
          initial={{ y: 0 }}
          exit={{ y: "-100%" }}
          transition={{ duration: 0.9, ease: GLIDE }}
        >
          <div className="reveal-mask">
            <motion.span
              className="display block text-[12vw] leading-none md:text-[8vw]"
              initial={{ y: "110%" }}
              animate={{ y: 0 }}
              transition={{ duration: 1, ease: GLIDE, delay: 0.05 }}
            >
              AdventHQ
            </motion.span>
          </div>
          <span
            className="display mb-2 text-2xl tabular-nums"
            style={{ color: "var(--accent)" }}
          >
            {count}
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
