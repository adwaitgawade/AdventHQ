"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/useReducedMotion";
import { SHOWREEL } from "@/data/projects";
import LazyVideo from "./LazyVideo";
import Lightbox from "./Work/Lightbox";
import MagneticButton from "./MagneticButton";
import { useSmoothScroll } from "./SmoothScroll";

const HEADLINE = ["Motion that", "moves the needle."];

export default function Hero() {
  const root = useRef<HTMLElement>(null);
  const linesRef = useRef<HTMLSpanElement[]>([]);
  const subRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const mediaRef = useRef<HTMLDivElement>(null);
  const [reelOpen, setReelOpen] = useState(false);
  const { scrollTo } = useSmoothScroll();

  useEffect(() => {
    const reduced = prefersReducedMotion();
    const ctx = gsap.context(() => {
      if (reduced) {
        gsap.set([...linesRef.current, subRef.current], {
          yPercent: 0,
          y: 0,
          opacity: 1,
        });
        return;
      }

      // Mask reveal — each line slides up from behind its clip mask.
      // Small delay so it settles in just behind / as the preloader wipes.
      gsap.from(linesRef.current, {
        yPercent: 115,
        duration: 1.1,
        ease: "power3.out",
        stagger: 0.12,
        delay: 0.35,
      });
      gsap.from(subRef.current, {
        y: 24,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        delay: 0.9,
      });

      // Parallax: the media scales/drifts; the text block (a separate element
      // from the reveal targets, to avoid transform conflicts) lifts and fades.
      gsap.to(mediaRef.current, {
        scale: 1.15,
        yPercent: 12,
        ease: "none",
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
      gsap.to(contentRef.current, {
        yPercent: -25,
        opacity: 0,
        ease: "none",
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: "bottom 40%",
          scrub: true,
        },
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={root}
      id="top"
      className="relative flex h-[100svh] min-h-[640px] w-full flex-col justify-end overflow-hidden"
    >
      {/* Hero background — looping ambient film */}
      <div ref={mediaRef} className="absolute inset-0 -z-10">
        <LazyVideo
          src="/hero-gwr.mp4"
          poster={SHOWREEL.poster}
          autoLoop
          className="h-full w-full"
        />
        {/* bottom-to-top scrim for legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-base via-base/40 to-base/10" />
      </div>

      <div
        ref={contentRef}
        className="mx-auto w-full max-w-shell px-[var(--gutter)] pb-[12vh]"
      >
        <h1 className="display text-[13vw] leading-[0.92] tracking-tightest sm:text-[11vw] md:text-[8.5vw]">
          {HEADLINE.map((line, i) => (
            <span key={i} className="reveal-mask">
              <span
                ref={(el) => {
                  if (el) linesRef.current[i] = el;
                }}
                className="reveal-line"
              >
                {line}
              </span>
            </span>
          ))}
        </h1>

        <div ref={subRef} className="mt-8 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <p className="max-w-md text-base text-muted md:text-lg">
            A motion design studio for brands that want to be remembered — ads,
            3D &amp; VFX, titles, UGC and hyper-motion, crafted frame by frame.
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <MagneticButton
              onClick={() => setReelOpen(true)}
              ariaLabel="Watch the showreel"
              className="group flex items-center gap-3 rounded-full border border-line px-6 py-3 text-sm font-medium text-ink transition-colors hover:bg-surface"
            >
              <span className="flex h-2.5 w-2.5 items-center justify-center">
                <span className="h-0 w-0 border-y-[5px] border-l-[8px] border-y-transparent border-l-accent" />
              </span>
              Watch the reel
            </MagneticButton>
            <MagneticButton
              onClick={() => scrollTo("#contact", { offset: -1 })}
              className="rounded-full bg-accent px-6 py-3 text-sm font-medium text-accent-ink"
            >
              Start a project
            </MagneticButton>
          </div>
        </div>
      </div>

      {/* Scroll cue */}
      <div className="pointer-events-none absolute bottom-6 left-1/2 -translate-x-1/2 text-[11px] uppercase tracking-[0.3em] text-muted">
        <span className="inline-block animate-pulse">Scroll</span>
      </div>

      <Lightbox
        open={reelOpen}
        src={SHOWREEL.src}
        poster={SHOWREEL.poster}
        title="AdventHQ Showreel"
        onClose={() => setReelOpen(false)}
      />
    </section>
  );
}
