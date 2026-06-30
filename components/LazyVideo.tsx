"use client";

import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { useInView } from "@/lib/useInView";
import { useReducedMotion } from "@/lib/useReducedMotion";

type Props = {
  src: string;
  poster: string;
  className?: string;
  /** Autoplay a muted loop while in view (grid previews, ambient clips). */
  autoLoop?: boolean;
  /** When true, only attach src once in view, and don't autoplay (case study). */
  manual?: boolean;
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
  const [load, setLoad] = useState(false);

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
    if (inView) {
      v.play().catch(() => {});
    } else {
      v.pause();
    }
  }, [inView, load, autoLoop, reduced, manual]);

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
          preload="none"
          className="absolute inset-0 h-full w-full"
          style={{ objectFit }}
        />
      )}
    </div>
  );
});

export default LazyVideo;
