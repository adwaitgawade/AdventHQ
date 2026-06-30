"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { services } from "@/data/services";
import { useReducedMotion } from "@/lib/useReducedMotion";
import LazyVideo from "./LazyVideo";

/**
 * Five capabilities. Desktop: a GSAP-pinned horizontal scroll slides the cards
 * through while the section is pinned. Mobile / reduced-motion: a plain vertical
 * stack with the same content.
 */
export default function Services() {
  const root = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const set = () => setIsDesktop(mq.matches);
    set();
    mq.addEventListener("change", set);
    return () => mq.removeEventListener("change", set);
  }, []);

  useEffect(() => {
    if (reduced || !isDesktop) return;
    const trackEl = track.current;
    const rootEl = root.current;
    if (!trackEl || !rootEl) return;

    const ctx = gsap.context(() => {
      const getDistance = () => trackEl.scrollWidth - window.innerWidth;

      gsap.to(trackEl, {
        x: () => -getDistance(),
        ease: "none",
        scrollTrigger: {
          trigger: rootEl,
          start: "top top",
          end: () => `+=${getDistance()}`,
          scrub: 1,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });
    }, root);

    return () => ctx.revert();
  }, [reduced, isDesktop]);

  const horizontal = isDesktop && !reduced;

  return (
    <section id="services" className="relative scroll-mt-24 bg-base">
      <div ref={root} className={horizontal ? "h-screen overflow-hidden" : ""}>
        <div
          className={
            horizontal
              ? "flex h-full items-center"
              : "mx-auto max-w-shell px-[var(--gutter)] py-24"
          }
        >
          {/* Intro / title panel */}
          <div
            className={
              horizontal
                ? "flex h-full w-[80vw] shrink-0 flex-col justify-center px-[var(--gutter)]"
                : "mb-16"
            }
          >
            <p className="text-sm uppercase tracking-[0.3em] text-accent">
              Services
            </p>
            <h2 className="display mt-4 text-5xl leading-none md:text-7xl">
              Five ways we
              <br />
              make things move.
            </h2>
            {horizontal && (
              <p className="mt-6 max-w-sm text-muted">
                Scroll to move through the studio →
              </p>
            )}
          </div>

          {/* The five cards */}
          <div
            ref={track}
            className={
              horizontal
                ? "flex h-full items-center gap-8 px-[var(--gutter)]"
                : "grid grid-cols-1 gap-6"
            }
          >
            {services.map((s) => (
              <article
                key={s.id}
                className={
                  horizontal
                    ? "flex h-[68vh] w-[42vw] shrink-0 flex-col overflow-hidden rounded-2xl border border-line bg-surface"
                    : "flex flex-col overflow-hidden rounded-2xl border border-line bg-surface"
                }
              >
                <div className="relative aspect-video w-full shrink-0 overflow-hidden">
                  <LazyVideo src={s.clip} poster="/posters/showreel.svg" autoLoop />
                  <span className="absolute left-5 top-4 text-sm text-muted">
                    {s.index}
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-6 md:p-8">
                  <h3 className="display text-2xl md:text-3xl">{s.title}</h3>
                  <p className="mt-3 max-w-md text-muted">{s.description}</p>
                  <ul className="mt-auto flex flex-wrap gap-2 pt-6">
                    {s.deliverables.map((d) => (
                      <li
                        key={d}
                        className="rounded-full border border-line px-3 py-1 text-xs text-ink"
                      >
                        {d}
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
