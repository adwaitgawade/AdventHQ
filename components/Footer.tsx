"use client";

import { motion } from "framer-motion";
import { useSmoothScroll } from "./SmoothScroll";

const GLIDE = [0.16, 1, 0.3, 1] as const;

const LINKS = [
  { label: "Work", href: "#work" },
  { label: "Services", href: "#services" },
  { label: "Studio", href: "#studio" },
  { label: "Contact", href: "#contact" },
];

export default function Footer() {
  const { scrollTo } = useSmoothScroll();

  return (
    <footer className="relative overflow-hidden border-t border-line bg-base pt-20">
      <div className="mx-auto max-w-shell px-[var(--gutter)]">
        <div className="flex flex-col justify-between gap-10 md:flex-row md:items-start">
          {/* status + nav */}
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-line px-3 py-1.5 text-sm text-muted">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
              </span>
              Available for work · IST (UTC+5:30)
            </span>

            <nav className="mt-8 flex flex-wrap gap-x-8 gap-y-2" aria-label="Footer">
              {LINKS.map((l) => (
                <button
                  key={l.href}
                  onClick={() => scrollTo(l.href, { offset: -1 })}
                  data-cursor="link"
                  className="text-muted transition-colors hover:text-ink"
                >
                  {l.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="text-sm md:text-right">
            {/* TODO: replace with real AdventHQ contact */}
            <a
              href="mailto:hello@adventhq.studio"
              data-cursor="link"
              className="text-ink transition-colors hover:text-accent"
            >
              hello@adventhq.studio
            </a>
            <div className="mt-3 flex gap-4 text-muted md:justify-end">
              {["Instagram", "Vimeo", "LinkedIn"].map((s) => (
                <a key={s} href="#" data-cursor="link" className="hover:text-ink">
                  {s}
                </a>
              ))}
            </div>
            <button
              onClick={() => scrollTo(0)}
              data-cursor="link"
              className="mt-6 text-muted transition-colors hover:text-ink"
            >
              Back to top ↑
            </button>
          </div>
        </div>

        {/* Big animated wordmark */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: GLIDE }}
          className="mt-16 select-none"
        >
          <h2 className="display text-[22vw] leading-[0.8] tracking-tightest md:text-[18vw]">
            Advent<span className="text-accent">HQ</span>
          </h2>
        </motion.div>

        <div className="flex flex-col justify-between gap-2 border-t border-line py-8 text-xs text-muted md:flex-row">
          <span>© {new Date().getFullYear()} AdventHQ. All rights reserved.</span>
          <span>Motion that moves the needle.</span>
        </div>
      </div>

      {/* accent baseline */}
      <div className="h-1 w-full bg-accent" />
    </footer>
  );
}
