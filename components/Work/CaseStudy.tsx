"use client";

import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import type { Project } from "@/data/projects";
import { CATEGORY_LABELS } from "@/data/projects";
import CountUp from "../CountUp";

const GLIDE = [0.16, 1, 0.3, 1] as const;

const ASPECT: Record<Project["aspectRatio"], string> = {
  "16:9": "16 / 9",
  "9:16": "9 / 16",
  "1:1": "1 / 1",
  "4:5": "4 / 5",
};

type Props = {
  project: Project;
  onClose: () => void;
  onNav: (dir: 1 | -1) => void;
  hasPrev: boolean;
  hasNext: boolean;
};

/**
 * Fullscreen case-study view. The hero media shares a `layoutId` with its grid
 * tile, so it morphs seamlessly open and closed. Esc / close button exit; the
 * parent locks page scroll while this is mounted.
 */
export default function CaseStudy({
  project,
  onClose,
  onNav,
  hasPrev,
  hasNext,
}: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);
  const cs = project.caseStudy;
  const portrait =
    project.aspectRatio === "9:16" || project.aspectRatio === "4:5";

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight" && hasNext) onNav(1);
      if (e.key === "ArrowLeft" && hasPrev) onNav(-1);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose, onNav, hasNext, hasPrev]);

  return (
    <motion.div
      className="fixed inset-0 z-[110] overflow-y-auto overscroll-contain bg-base"
      data-lenis-prevent
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      role="dialog"
      aria-modal="true"
      aria-label={`${project.title} case study`}
    >
      {/* Sticky close bar */}
      <div className="sticky top-0 z-20 flex items-center justify-between bg-gradient-to-b from-base to-transparent px-[var(--gutter)] py-5">
        <span className="text-sm uppercase tracking-widest text-muted">
          {CATEGORY_LABELS[project.category]}
        </span>
        <button
          onClick={onClose}
          data-cursor="link"
          aria-label="Close case study"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-line text-ink transition-colors hover:bg-surface"
        >
          ✕
        </button>
      </div>

      <div className="mx-auto -mt-16 max-w-shell px-[var(--gutter)] pb-24">
        {/* Hero clip — morphs from the tile. Box follows the project's real
            aspect ratio; portrait clips are capped to a centered column. */}
        <motion.div
          layoutId={`media-${project.id}`}
          style={{ aspectRatio: ASPECT[project.aspectRatio] }}
          className={`relative w-full overflow-hidden rounded-xl bg-surface ${
            portrait ? "mx-auto max-w-sm" : ""
          }`}
        >
          <video
            ref={videoRef}
            src={project.fullSrc}
            poster={project.poster}
            autoPlay
            muted={muted}
            loop
            playsInline
            className="h-full w-full object-cover"
          />
          <button
            onClick={() => setMuted((m) => !m)}
            data-cursor="link"
            aria-label={muted ? "Unmute" : "Mute"}
            className="absolute bottom-4 right-4 rounded-full border border-line bg-base/60 px-4 py-2 text-xs uppercase tracking-widest text-ink backdrop-blur"
          >
            {muted ? "Sound on" : "Sound off"}
          </button>
        </motion.div>

        {/* Title block */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: GLIDE, delay: 0.15 }}
          className="mt-10 flex flex-col justify-between gap-6 md:flex-row md:items-end"
        >
          <h2 className="display max-w-2xl text-4xl leading-none md:text-6xl">
            {project.title}
          </h2>
          <div className="text-sm text-muted">
            <p>
              Client — <span className="text-ink">{project.client}</span>
            </p>
            <p>
              Year — <span className="text-ink">{project.year}</span>
            </p>
          </div>
        </motion.div>

        {cs && (
          <div className="mt-16 grid gap-12 md:grid-cols-12">
            {/* Brief + approach */}
            <div className="md:col-span-7 md:col-start-1">
              <Block label="The brief" body={cs.brief} />
              <div className="mt-10">
                <Block label="Our approach" body={cs.approach} />
              </div>
            </div>

            {/* Role / deliverables */}
            <div className="md:col-span-4 md:col-start-9">
              <h4 className="text-xs uppercase tracking-widest text-muted">
                Role &amp; deliverables
              </h4>
              <ul className="mt-4 flex flex-wrap gap-2">
                {cs.role.map((r) => (
                  <li
                    key={r}
                    className="rounded-full border border-line px-3 py-1.5 text-sm text-ink"
                  >
                    {r}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Stats */}
        {cs?.stats && cs.stats.length > 0 && (
          <div className="mt-20 grid grid-cols-1 gap-8 border-y border-line py-12 sm:grid-cols-3">
            {cs.stats.map((s) => (
              <div key={s.label}>
                <p className="display text-5xl md:text-6xl">
                  <CountUp value={s.value} suffix={s.suffix} />
                </p>
                <p className="mt-2 text-sm text-muted">{s.label}</p>
              </div>
            ))}
          </div>
        )}

        {/* Vertical gallery of stills + secondary clips */}
        {cs && (cs.stills.length > 0 || cs.clips?.length) && (
          <div className="mt-20 space-y-6">
            {cs.clips?.map((clip, i) => (
              <div
                key={`clip-${i}`}
                className="aspect-video w-full overflow-hidden rounded-xl bg-surface"
              >
                <video
                  src={clip}
                  poster={project.poster}
                  muted
                  loop
                  autoPlay
                  playsInline
                  preload="none"
                  className="h-full w-full object-cover"
                />
                {/* TODO: add <track kind="captions"> when real assets land */}
              </div>
            ))}
            {/* Portrait stills tile into a grid; landscape stills stack full-width. */}
            <div
              className={
                portrait ? "grid grid-cols-2 gap-4 sm:grid-cols-3" : "space-y-6"
              }
            >
              {cs.stills.map((still, i) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={`still-${i}`}
                  src={still}
                  alt={`${project.title} still ${i + 1}`}
                  className="w-full rounded-xl"
                />
              ))}
            </div>
          </div>
        )}

        {/* Prev / next */}
        <div className="mt-20 flex items-center justify-between border-t border-line pt-8">
          <button
            onClick={() => hasPrev && onNav(-1)}
            disabled={!hasPrev}
            data-cursor="link"
            className="text-sm uppercase tracking-widest text-muted transition-colors enabled:hover:text-ink disabled:opacity-30"
          >
            ← Previous
          </button>
          <button
            onClick={onClose}
            data-cursor="link"
            className="text-sm uppercase tracking-widest text-muted hover:text-ink"
          >
            All work
          </button>
          <button
            onClick={() => hasNext && onNav(1)}
            disabled={!hasNext}
            data-cursor="link"
            className="text-sm uppercase tracking-widest text-muted transition-colors enabled:hover:text-ink disabled:opacity-30"
          >
            Next →
          </button>
        </div>
      </div>
    </motion.div>
  );
}

function Block({ label, body }: { label: string; body: string }) {
  return (
    <div>
      <h4 className="text-xs uppercase tracking-widest text-muted">{label}</h4>
      <p className="mt-4 text-xl leading-relaxed text-ink md:text-2xl">{body}</p>
    </div>
  );
}
