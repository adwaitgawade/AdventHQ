"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";

const GLIDE = [0.16, 1, 0.3, 1] as const;

type Props = {
  open: boolean;
  src: string;
  poster: string;
  title?: string;
  onClose: () => void;
};

/**
 * Reusable fullscreen video player: sound on by default, scrub bar, Esc /
 * click-out close, focus trap, and play/pause + mute keyboard shortcuts.
 * Used by the hero "Watch the reel" CTA and case-study hero clips.
 */
export default function Lightbox({ open, src, poster, title, onClose }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const [playing, setPlaying] = useState(true);
  const [muted, setMuted] = useState(false);
  const [progress, setProgress] = useState(0);

  const close = useCallback(() => onClose(), [onClose]);

  useEffect(() => {
    if (!open) return;
    const v = videoRef.current;
    v?.play().catch(() => {});
    setPlaying(true);

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === " ") {
        e.preventDefault();
        toggle();
      }
      if (e.key.toLowerCase() === "m") setMuted((m) => !m);
      if (e.key === "Tab" && panelRef.current) {
        // simple focus trap within the panel
        const focusable = panelRef.current.querySelectorAll<HTMLElement>(
          "button, [href], input, video"
        );
        if (focusable.length) {
          const first = focusable[0];
          const last = focusable[focusable.length - 1];
          if (e.shiftKey && document.activeElement === first) {
            e.preventDefault();
            last.focus();
          } else if (!e.shiftKey && document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const toggle = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      v.play();
      setPlaying(true);
    } else {
      v.pause();
      setPlaying(false);
    }
  };

  const onTime = () => {
    const v = videoRef.current;
    if (v && v.duration) setProgress((v.currentTime / v.duration) * 100);
  };

  const seek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = videoRef.current;
    if (v && v.duration) v.currentTime = (Number(e.target.value) / 100) * v.duration;
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[110] flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm md:p-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35, ease: GLIDE }}
          onClick={close}
          role="dialog"
          aria-modal="true"
          aria-label={title ? `${title} — video player` : "Video player"}
        >
          <motion.div
            ref={panelRef}
            className="relative w-full max-w-5xl"
            initial={{ scale: 0.96, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.96, opacity: 0 }}
            transition={{ duration: 0.4, ease: GLIDE }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative aspect-video overflow-hidden rounded-xl bg-black">
              <video
                ref={videoRef}
                src={src}
                poster={poster}
                muted={muted}
                playsInline
                onClick={toggle}
                onTimeUpdate={onTime}
                onEnded={() => setPlaying(false)}
                className="h-full w-full object-contain"
              />
            </div>

            {/* Controls */}
            <div className="mt-4 flex items-center gap-4">
              <button
                onClick={toggle}
                data-cursor="link"
                aria-label={playing ? "Pause" : "Play"}
                className="text-sm uppercase tracking-widest text-ink"
              >
                {playing ? "Pause" : "Play"}
              </button>
              <input
                type="range"
                min={0}
                max={100}
                value={progress}
                onChange={seek}
                aria-label="Seek"
                className="h-1 flex-1 cursor-pointer appearance-none rounded-full bg-line accent-accent"
              />
              <button
                onClick={() => setMuted((m) => !m)}
                data-cursor="link"
                aria-label={muted ? "Unmute" : "Mute"}
                className="text-sm uppercase tracking-widest text-muted hover:text-ink"
              >
                {muted ? "Sound off" : "Sound on"}
              </button>
            </div>

            <button
              onClick={close}
              data-cursor="link"
              aria-label="Close player"
              className="absolute -top-12 right-0 flex h-10 w-10 items-center justify-center rounded-full border border-line text-ink transition-colors hover:bg-surface md:-right-2"
            >
              ✕
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
