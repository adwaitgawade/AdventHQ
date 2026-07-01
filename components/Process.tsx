"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { processSteps } from "@/data/clients";
import { prefersReducedMotion } from "@/lib/useReducedMotion";

/**
 * Process timeline. A vertical line draws in (scaleY) as you scroll past it,
 * and each node + step reveals on enter. Reduced motion: everything shown.
 */
export default function Process() {
  const root = useRef<HTMLDivElement>(null);
  const line = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      // Draw the line as the section scrolls through.
      gsap.fromTo(
        line.current,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: "none",
          transformOrigin: "top",
          scrollTrigger: {
            trigger: root.current,
            start: "top 60%",
            end: "bottom 80%",
            scrub: true,
          },
        }
      );

      // Reveal each step + light up its node.
      gsap.utils.toArray<HTMLElement>(".process-step").forEach((step) => {
        gsap.from(step, {
          opacity: 0,
          y: 30,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: { trigger: step, start: "top 80%" },
        });
        const node = step.querySelector(".process-node");
        if (node) {
          gsap.fromTo(
            node,
            { backgroundColor: "var(--surface-2)", scale: 1 },
            {
              backgroundColor: "var(--accent)",
              scale: 1.15,
              duration: 0.4,
              ease: "power2.out",
              scrollTrigger: { trigger: step, start: "top 65%" },
            }
          );
        }
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section className="relative scroll-mt-24 bg-surface/30 py-24 md:py-32">
      <div className="mx-auto max-w-shell px-[var(--gutter)]">
        <p className="text-sm uppercase tracking-[0.3em] text-accent">Process</p>
        <h2 className="display mt-4 text-5xl leading-none md:text-7xl">
          A smooth way
          <br />
          to work.
        </h2>

        <div ref={root} className="relative mt-20 pl-10 md:pl-16">
          {/* track + drawn line — centered under the nodes (dot center sits at x=8px on both breakpoints) */}
          <div className="absolute left-2 top-2 h-[calc(100%-1rem)] w-px -translate-x-1/2 bg-line" />
          <div
            ref={line}
            className="absolute left-2 top-2 h-[calc(100%-1rem)] w-px origin-top -translate-x-1/2 bg-accent"
          />

          <div className="space-y-16">
            {processSteps.map((step) => (
              <div key={step.index} className="process-step relative">
                <span className="process-node absolute -left-10 top-1.5 h-4 w-4 rounded-full bg-surface-2 ring-4 ring-base md:-left-16" />
                <div className="flex flex-col gap-2 md:flex-row md:gap-12">
                  <span className="display text-sm text-accent md:w-16">
                    {step.index}
                  </span>
                  <div className="max-w-2xl">
                    <h3 className="display text-3xl md:text-5xl">{step.title}</h3>
                    <p className="mt-3 text-muted md:text-lg">
                      {step.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
