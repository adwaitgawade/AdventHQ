"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/useReducedMotion";
import { SHOWREEL } from "@/data/projects";
import LazyVideo from "./LazyVideo";
import Lightbox from "./Work/Lightbox";
import MagneticButton from "./MagneticButton";
import { useSmoothScroll } from "./SmoothScroll";
import { useAudio } from "./AudioProvider";
import { PRELOAD_DONE_EVENT } from "./Preloader";
import { HERO_READY_EVENT } from "./VideoPreloader";

const HEADLINE = ["Motion that", "moves the needle."];

export default function Hero() {
  const root = useRef<HTMLElement>(null);
  const linesRef = useRef<HTMLSpanElement[]>([]);
  const subRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const mediaRef = useRef<HTMLDivElement>(null);
  const [reelOpen, setReelOpen] = useState(false);
  // Hold the hero video until the preloader lifts, then let it play.
  const [revealed, setRevealed] = useState(false);
  const { scrollTo } = useSmoothScroll();
  const { soundOn, toggle: toggleSound } = useAudio();

  useEffect(() => {
    // Returning / reduced-motion visitors never see the preloader — the inline
    // script marks that before paint, so start playing right away.
    if (document.documentElement.hasAttribute("data-skip-preloader")) {
      setRevealed(true);
      return;
    }
    const onDone = () => setRevealed(true);
    window.addEventListener(PRELOAD_DONE_EVENT, onDone);
    return () => window.removeEventListener(PRELOAD_DONE_EVENT, onDone);
  }, []);

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
          src="/hero-montage.mp4"
          poster={SHOWREEL.poster}
          autoLoop
          priority
          paused={!revealed}
          onReady={() => window.dispatchEvent(new Event(HERO_READY_EVENT))}
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

      {/* Scroll cue + neon master-audio toggle */}
      <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 flex-col items-center gap-3">
        <button
          onClick={toggleSound}
          data-cursor="link"
          aria-pressed={soundOn}
          aria-label={
            soundOn ? "Mute all videos" : "Enable sound for all videos"
          }
          title={soundOn ? "Mute all videos" : "Enable sound for all videos"}
          className={`group relative flex h-14 w-14 items-center justify-center rounded-full border bg-base/40 backdrop-blur transition-all duration-500 ${
            soundOn
              ? "border-accent text-accent shadow-[0_0_28px_-2px_var(--accent)]"
              : "border-line text-ink/80 hover:border-accent hover:text-accent hover:shadow-[0_0_22px_-4px_var(--accent)]"
          }`}
        >
          {/* Pulsing neon ring while sound is live */}
          {soundOn && (
            <span className="absolute inset-0 animate-ping rounded-full border border-accent/50" />
          )}
          <SoundIcon on={soundOn} />
        </button>
        <span className="pointer-events-none text-[11px] uppercase tracking-[0.3em] text-muted">
          <span className="inline-block animate-pulse">Scroll</span>
        </span>
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

/** Speaker glyph — sound waves when on, a muted slash when off. */
function SoundIcon({ on }: { on: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-5 w-5"
      aria-hidden
    >
      <path d="M11 5 6 9H3v6h3l5 4V5z" fill="currentColor" stroke="none" />
      {on ? (
        <>
          <path d="M15.5 8.5a5 5 0 0 1 0 7" />
          <path d="M18.5 6a8 8 0 0 1 0 12" />
        </>
      ) : (
        <path d="m16 9 5 6m0-6-5 6" />
      )}
    </svg>
  );
}
