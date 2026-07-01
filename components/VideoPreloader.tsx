"use client";

import { useEffect } from "react";
import { projects, SHOWREEL } from "@/data/projects";
import { services } from "@/data/services";
import { prefersReducedMotion } from "@/lib/useReducedMotion";

/** Dispatched by the hero once its video has buffered enough to play. */
export const HERO_READY_EVENT = "adventhq:hero-ready";

/** Fetch two clips at a time; enough to stay warm without saturating bandwidth. */
const CONCURRENCY = 2;
/** If the hero never signals ready, start warming anyway after this long. */
const FALLBACK_START_MS = 6000;

/**
 * Warms the browser cache for every non-hero clip. Runs once the hero video is
 * ready so the priority download finishes first, then pulls the rest in the
 * background — so a work tile or service card plays instantly instead of
 * downloading on hover / scroll-in. Renders nothing.
 */
export default function VideoPreloader() {
  useEffect(() => {
    // Reduced-motion visitors never see the video loops — don't spend their data.
    if (prefersReducedMotion()) return;

    const urls = Array.from(
      new Set([
        ...projects.map((p) => p.previewSrc),
        ...services.map((s) => s.clip),
        SHOWREEL.src,
      ])
    ).filter(Boolean);

    let cancelled = false;
    let cursor = 0;
    const active = new Set<HTMLVideoElement>();

    const pump = () => {
      if (cancelled) return;
      while (active.size < CONCURRENCY && cursor < urls.length) {
        const url = urls[cursor++];
        const v = document.createElement("video");
        v.preload = "auto";
        v.muted = true;
        // A detached element still downloads with preload="auto" + load(),
        // populating the HTTP cache the real <video> will reuse.
        const done = () => {
          active.delete(v);
          v.removeAttribute("src");
          v.load(); // release the element; cached bytes remain
          pump();
        };
        v.addEventListener("canplaythrough", done, { once: true });
        v.addEventListener("error", done, { once: true });
        active.add(v);
        v.src = url;
        v.load();
      }
    };

    let timer = 0;
    const start = () => {
      if (cancelled) return;
      window.clearTimeout(timer);
      pump();
    };

    window.addEventListener(HERO_READY_EVENT, start, { once: true });
    timer = window.setTimeout(start, FALLBACK_START_MS);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
      window.removeEventListener(HERO_READY_EVENT, start);
      active.forEach((v) => {
        v.removeAttribute("src");
        v.load();
      });
      active.clear();
    };
  }, []);

  return null;
}
