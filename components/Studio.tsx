"use client";

import { motion } from "framer-motion";
import { studioStats } from "@/data/clients";
import CountUp from "./CountUp";

const GLIDE = [0.16, 1, 0.3, 1] as const;

// TODO: replace with real AdventHQ team members + portraits.
const team = [
  { name: "Ravi Menon", role: "Founder / ECD" },
  { name: "Lena Park", role: "Head of 3D" },
  { name: "Marco Vidal", role: "Design Director" },
  { name: "Aisha Bello", role: "Lead Animator" },
  { name: "Sora Tan", role: "Producer" },
];

export default function Studio() {
  return (
    <section id="studio" className="relative scroll-mt-24 py-24 md:py-32">
      <div className="mx-auto max-w-shell px-[var(--gutter)]">
        <p className="text-sm uppercase tracking-[0.3em] text-accent">Studio</p>

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-15% 0px" }}
          transition={{ duration: 0.9, ease: GLIDE }}
          className="display mt-6 max-w-4xl text-3xl leading-[1.1] tracking-tight md:text-5xl"
        >
          AdventHQ is a small, senior studio obsessed with{" "}
          <span className="text-muted">motion with intent</span>. We don&apos;t
          decorate — we direct attention, build feeling, and move a metric. Every
          frame earns its place.
        </motion.h2>

        {/* Stats */}
        <div className="mt-20 grid grid-cols-2 gap-8 border-y border-line py-12 md:grid-cols-4">
          {studioStats.map((s) => (
            <div key={s.label}>
              <p className="display text-4xl md:text-6xl">
                <CountUp value={s.value} suffix={s.suffix} />
              </p>
              <p className="mt-2 text-sm text-muted">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Team strip — hover reveals names */}
        <div className="mt-16">
          <h3 className="text-xs uppercase tracking-widest text-muted">
            The team
          </h3>
          <ul className="mt-6 divide-y divide-line border-y border-line">
            {team.map((m) => (
              <li
                key={m.name}
                className="group flex items-center justify-between py-5 transition-colors hover:bg-surface/40"
                data-cursor="link"
              >
                <span className="display text-2xl text-muted transition-colors group-hover:text-ink md:text-4xl">
                  {m.name}
                </span>
                <span className="text-sm text-muted opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  {m.role}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
