"use client";

import { motion } from "framer-motion";
import { useRef, useState } from "react";
import type { Project } from "@/data/projects";
import { CATEGORY_LABELS } from "@/data/projects";
import { useReducedMotion } from "@/lib/useReducedMotion";

const ASPECT: Record<Project["aspectRatio"], string> = {
  "16:9": "16 / 9",
  "9:16": "9 / 16",
  "1:1": "1 / 1",
  "4:5": "4 / 5",
};

type Props = {
  project: Project;
  onOpen: (p: Project) => void;
  /** Featured tiles render larger / full-width and never hide their meta. */
  featured?: boolean;
};

/**
 * Work grid tile. Desktop: hover swaps cursor to PLAY, fades in a muted preview
 * loop, lifts the scrim and slides up the metadata. Touch: tap opens the case
 * study. The media carries a shared `layoutId` so it morphs into the detail.
 */
export default function Tile({ project, onOpen, featured }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [loadVideo, setLoadVideo] = useState(false);
  const [hover, setHover] = useState(false);
  const reduced = useReducedMotion();

  const enter = () => {
    if (reduced) return;
    setHover(true);
    setLoadVideo(true);
    requestAnimationFrame(() => videoRef.current?.play().catch(() => {}));
  };
  const leave = () => {
    setHover(false);
    videoRef.current?.pause();
  };

  return (
    <motion.button
      layout
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      onClick={() => onOpen(project)}
      onMouseEnter={enter}
      onMouseLeave={leave}
      data-cursor="play"
      aria-label={`Open case study: ${project.title}, ${project.client}`}
      className="group relative block w-full overflow-hidden rounded-lg bg-surface text-left"
    >
      <motion.div
        layoutId={`media-${project.id}`}
        className="relative w-full overflow-hidden"
        style={{ aspectRatio: featured ? "16 / 9" : ASPECT[project.aspectRatio] }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={project.poster}
          alt={`${project.title} — ${project.client}`}
          className="absolute inset-0 h-full w-full object-cover"
        />
        {loadVideo && !reduced && (
          <video
            ref={videoRef}
            src={project.previewSrc}
            poster={project.poster}
            muted
            loop
            playsInline
            preload="none"
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${
              hover ? "opacity-100" : "opacity-0"
            }`}
          />
        )}

        {/* scrim — lifts on hover */}
        <div
          className={`absolute inset-0 bg-gradient-to-t from-base/80 via-base/10 to-transparent transition-opacity duration-500 ${
            hover ? "opacity-40" : "opacity-100"
          }`}
        />
      </motion.div>

      {/* metadata */}
      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-4 md:p-5">
        <div
          className={`transition-transform duration-500 ease-glide ${
            hover || reduced || featured ? "translate-y-0" : "md:translate-y-2"
          }`}
        >
          <h3 className="display text-lg leading-tight md:text-xl">
            {project.title}
          </h3>
          <p className="mt-1 text-xs text-muted">
            {project.client} · {CATEGORY_LABELS[project.category]} · {project.year}
          </p>
        </div>
        <span
          className={`hidden shrink-0 rounded-full border border-accent px-3 py-1 text-xs text-accent transition-opacity duration-500 md:inline-block ${
            hover ? "opacity-100" : "opacity-0"
          }`}
        >
          {featured ? "View case study" : "View"}
        </span>
      </div>
    </motion.button>
  );
}
