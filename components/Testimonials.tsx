"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { testimonials } from "@/data/clients";
import { useReducedMotion } from "@/lib/useReducedMotion";

import { GLIDE_CUBIC } from "@/lib/constants";

export default function Testimonials() {
  const [i, setI] = useState(0);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const id = window.setInterval(
      () => setI((v) => (v + 1) % testimonials.length),
      6000
    );
    return () => window.clearInterval(id);
  }, [reduced]);

  const t = testimonials[i];

  return (
    <section className="relative scroll-mt-24 py-24 md:py-36">
      <div className="mx-auto max-w-shell px-[var(--gutter)]">
        <p className="text-sm uppercase tracking-[0.3em] text-accent">
          Clients
        </p>

        <div className="relative mt-10 min-h-[320px] md:min-h-[360px]">
          <AnimatePresence mode="wait">
            <motion.blockquote
              key={i}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -24 }}
              transition={{ duration: 0.6, ease: GLIDE_CUBIC }}
              className="max-w-5xl"
            >
              <p className="display text-3xl leading-[1.15] tracking-tight md:text-6xl">
                &ldquo;{t.quote}&rdquo;
              </p>
              <footer className="mt-8 text-muted">
                <span className="text-ink">{t.name}</span> — {t.role}
              </footer>
            </motion.blockquote>
          </AnimatePresence>
        </div>

        {/* Dots */}
        <div className="mt-10 flex gap-3">
          {testimonials.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setI(idx)}
              data-cursor="link"
              aria-label={`Show testimonial ${idx + 1}`}
              aria-current={idx === i}
              className={`h-2 rounded-full transition-all duration-300 ${
                idx === i ? "w-8 bg-accent" : "w-2 bg-line hover:bg-muted"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
