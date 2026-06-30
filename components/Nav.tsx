"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import MagneticButton from "./MagneticButton";
import { useSmoothScroll } from "./SmoothScroll";

const GLIDE = [0.16, 1, 0.3, 1] as const;

const LINKS = [
  { label: "Work", href: "#work" },
  { label: "Services", href: "#services" },
  { label: "Studio", href: "#studio" },
  { label: "Contact", href: "#contact" },
];

export default function Nav() {
  const [condensed, setCondensed] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const lastY = useRef(0);
  const { scrollTo, stop, start, lenis } = useSmoothScroll();

  useEffect(() => {
    // Update condensed background + auto-hide from a scroll position and
    // travel direction. Past the hero, scrolling down hides the bar and
    // scrolling up reveals it; within the hero it always stays visible.
    const apply = (y: number, dir: number) => {
      setCondensed(y > window.innerHeight * 0.7);
      if (y < window.innerHeight) setHidden(false);
      else if (dir > 0) setHidden(true);
      else if (dir < 0) setHidden(false);
      lastY.current = y;
    };

    if (lenis) {
      // Lenis reports velocity (signed) — a clean, jitter-free direction.
      const onScroll = (e: { scroll: number; velocity: number }) => {
        const dir = e.velocity > 0.05 ? 1 : e.velocity < -0.05 ? -1 : 0;
        apply(e.scroll, dir);
      };
      lenis.on("scroll", onScroll);
      return () => lenis.off("scroll", onScroll);
    }

    // Reduced-motion / no-Lenis fallback: derive direction from window.scrollY.
    const onScroll = () => {
      const y = window.scrollY;
      const dir = y > lastY.current + 4 ? 1 : y < lastY.current - 4 ? -1 : 0;
      apply(y, dir);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [lenis]);

  useEffect(() => {
    if (menuOpen) {
      stop();
      document.body.style.overflow = "hidden";
    } else {
      start();
      document.body.style.overflow = "";
    }
  }, [menuOpen, stop, start]);

  const go = (href: string) => {
    setMenuOpen(false);
    // wait a tick so scroll-lock releases before scrolling
    requestAnimationFrame(() => scrollTo(href, { offset: -1 }));
  };

  return (
    <>
      <motion.header
        className="fixed inset-x-0 top-0 z-[80]"
        initial={false}
        animate={{
          y: hidden && !menuOpen ? "-100%" : "0%",
          backgroundColor: condensed
            ? "rgba(10,10,11,0.72)"
            : "rgba(10,10,11,0)",
          backdropFilter: condensed ? "blur(12px)" : "blur(0px)",
          borderColor: condensed ? "var(--line)" : "rgba(0,0,0,0)",
        }}
        transition={{
          y: { duration: 0.4, ease: GLIDE },
          default: { duration: 0.5, ease: GLIDE },
        }}
        style={{ borderBottomWidth: 1 }}
      >
        <div className="mx-auto flex max-w-shell items-center justify-between px-[var(--gutter)] py-4 md:py-5">
          <button
            onClick={() => scrollTo(0)}
            data-cursor="link"
            className="display text-xl tracking-tight"
            aria-label="AdventHQ — back to top"
          >
            Advent<span className="text-accent">HQ</span>
          </button>

          <nav className="hidden items-center gap-8 md:flex" aria-label="Primary">
            {LINKS.map((l) => (
              <button
                key={l.href}
                onClick={() => go(l.href)}
                data-cursor="link"
                className="group relative text-sm text-muted transition-colors hover:text-ink"
              >
                {l.label}
                <span className="absolute -bottom-1 left-0 h-px w-0 bg-accent transition-all duration-300 ease-glide group-hover:w-full" />
              </button>
            ))}
            <MagneticButton
              onClick={() => go("#contact")}
              className="rounded-full bg-accent px-5 py-2 text-sm font-medium text-accent-ink transition-transform"
            >
              Start a project
            </MagneticButton>
          </nav>

          {/* Mobile trigger */}
          <MagneticButton
            ariaLabel={menuOpen ? "Close menu" : "Open menu"}
            onClick={() => setMenuOpen((v) => !v)}
            className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 md:hidden"
          >
            <span
              className="block h-px w-6 bg-ink transition-transform duration-300"
              style={{ transform: menuOpen ? "translateY(3px) rotate(45deg)" : "none" }}
            />
            <span
              className="block h-px w-6 bg-ink transition-transform duration-300"
              style={{ transform: menuOpen ? "translateY(-3px) rotate(-45deg)" : "none" }}
            />
          </MagneticButton>
        </div>
      </motion.header>

      {/* Mobile fullscreen menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="fixed inset-0 z-[79] flex flex-col justify-center gap-2 bg-base px-[var(--gutter)] md:hidden"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: GLIDE }}
          >
            {LINKS.map((l, i) => (
              <motion.button
                key={l.href}
                onClick={() => go(l.href)}
                className="display text-left text-5xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.06 * i + 0.1, ease: GLIDE }}
              >
                {l.label}
              </motion.button>
            ))}
            <button
              onClick={() => go("#contact")}
              className="mt-8 w-fit rounded-full bg-accent px-6 py-3 font-medium text-accent-ink"
            >
              Start a project
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
