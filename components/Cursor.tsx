"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Custom cursor: a dot that lerps toward the pointer and morphs based on the
 * hovered element's `data-cursor` attribute:
 *   data-cursor="play" -> "PLAY" pill (over video tiles)
 *   data-cursor="link" -> larger ring (links / buttons)
 * Hidden entirely on touch devices and under reduced-motion.
 */
type Variant = "default" | "link" | "play";

export default function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const [variant, setVariant] = useState<Variant>("default");
  const [enabled, setEnabled] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduced) return;

    setEnabled(true);
    document.documentElement.classList.add("has-custom-cursor");

    const pos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const target = { ...pos };
    let raf = 0;

    const onMove = (e: PointerEvent) => {
      target.x = e.clientX;
      target.y = e.clientY;
      if (!visibleRef.current) {
        visibleRef.current = true;
        setVisible(true);
      }
      const el = (e.target as HTMLElement | null)?.closest?.("[data-cursor]");
      const v = (el?.getAttribute("data-cursor") as Variant) || "default";
      if (v !== variantRef.current) {
        variantRef.current = v;
        setVariant(v);
      }
    };

    const onLeave = () => {
      visibleRef.current = false;
      setVisible(false);
    };

    const render = () => {
      pos.x += (target.x - pos.x) * 0.18;
      pos.y += (target.y - pos.y) * 0.18;
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0) translate(-50%, -50%)`;
      }
      raf = requestAnimationFrame(render);
    };

    // refs to avoid stale closures inside the listener
    const variantRef = { current: "default" as Variant };
    const visibleRef = { current: false };

    raf = requestAnimationFrame(render);
    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
      document.documentElement.classList.remove("has-custom-cursor");
    };
  }, []);

  if (!enabled) return null;

  return (
    <div
      ref={dotRef}
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[200] flex items-center justify-center rounded-full text-[10px] font-semibold uppercase tracking-widest transition-[width,height,background-color,color] duration-300 ease-glide"
      style={{
        width: variant === "play" ? 84 : variant === "link" ? 56 : 12,
        height: variant === "play" ? 84 : variant === "link" ? 56 : 12,
        backgroundColor:
          variant === "play"
            ? "var(--accent)"
            : variant === "link"
            ? "transparent"
            : "var(--accent)",
        border: variant === "link" ? "1.5px solid var(--accent)" : "none",
        color: "var(--accent-ink)",
        opacity: visible ? 1 : 0,
        mixBlendMode: variant === "default" ? "difference" : "normal",
      }}
    >
      {variant === "play" ? "Play" : null}
    </div>
  );
}
