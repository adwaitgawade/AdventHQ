"use client";

import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { useInView } from "@/lib/useInView";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { useMutedSync } from "./AudioProvider";

type Props = {
  src: string;
  poster: string;
  className?: string;
  /** Autoplay a muted loop while in view (grid previews, ambient clips). */
  autoLoop?: boolean;
  /** When true, only attach src once in view, and don't autoplay (case study). */
  manual?: boolean;
  /** Hold autoplay while true, even if in view (e.g. until the preloader lifts). */
  paused?: boolean;
  /**
   * Load eagerly and with the highest priority: attach the source on mount
   * (ignoring in-view) and set `preload="auto"` so the file downloads right
   * away instead of waiting for scroll or play. Used for the hero.
   */
  priority?: boolean;
  /** Fires once the source has buffered enough to play through. */
  onReady?: () => void;
  muted?: boolean;
  loop?: boolean;
  playsInline?: boolean;
  objectFit?: "cover" | "contain";
};

export type LazyVideoHandle = {
  play: () => void;
  pause: () => void;
  el: HTMLVideoElement | null;
};

/**
 * In-view, lazy <video>. Sets poster, preload="none", and only loads/plays the
 * source when scrolled into view. Pauses when out of view. Under reduced motion
 * it shows the poster only and never autoplays.
 */
const LazyVideo = forwardRef<LazyVideoHandle, Props>(function LazyVideo(
  {
    src,
    poster,
    className = "",
    autoLoop = false,
    manual = false,
    paused = false,
    priority = false,
    onReady,
    muted = true,
    loop = true,
    playsInline = true,
    objectFit = "cover",
  },
  ref
) {
  const [containerRef, inView] = useInView<HTMLDivElement>({
    rootMargin: "200px",
  });
  const videoRef = useRef<HTMLVideoElement>(null);
  const reduced = useReducedMotion();
  // Priority videos attach their source immediately; everything else waits
  // until it approaches the viewport.
  const [load, setLoad] = useState(priority);

  // Follow the site-wide audio master. The element only mounts once `load`
  // flips true, so re-sync on that too.
  useMutedSync(videoRef, [load]);

  useImperativeHandle(ref, () => ({
    play: () => videoRef.current?.play().catch(() => {}),
    pause: () => videoRef.current?.pause(),
    el: videoRef.current,
  }));

  // Attach the source only once the element approaches the viewport.
  useEffect(() => {
    if (inView && !load) setLoad(true);
  }, [inView, load]);

  // Autoplay/pause loops based on visibility (never under reduced motion).
  // `load` is a dep so this re-runs once the <video> actually mounts — the
  // element doesn't exist on the render when `inView` first flips true.
  useEffect(() => {
    const v = videoRef.current;
    if (!v || !autoLoop || reduced || manual) return;
    if (inView && !paused) {
      v.play().catch(() => {});
    } else {
      v.pause();
    }
  }, [inView, load, autoLoop, reduced, manual, paused]);

  return (
    <div ref={containerRef} className={`relative h-full w-full overflow-hidden ${className}`}>
      {/* Poster always rendered underneath to avoid layout shift / flashes */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={poster}
        alt=""
        aria-hidden
        className="absolute inset-0 h-full w-full"
        style={{ objectFit }}
      />
      {load && !reduced && (
        <video
          ref={videoRef}
          src={src}
          poster={poster}
          muted={muted}
          loop={loop}
          playsInline={playsInline}
          preload={priority ? "auto" : "none"}
          onCanPlayThrough={onReady}
          className="absolute inset-0 h-full w-full"
          style={{ objectFit }}
        />
      )}
    </div>
  );
});

export default LazyVideo;
