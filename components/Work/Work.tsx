"use client";

import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import dynamic from "next/dynamic";
import { useEffect, useMemo, useState } from "react";
import { projects } from "@/data/projects";
import type { Category, Project } from "@/data/projects";
import { useSmoothScroll } from "../SmoothScroll";
import FilterBar from "./FilterBar";
import Tile from "./Tile";

// Heavy fullscreen view — only loaded when a project is opened.
const CaseStudy = dynamic(() => import("./CaseStudy"), { ssr: false });

type Filter = Category | "all";

export default function Work() {
  const [filter, setFilter] = useState<Filter>("all");
  const [selected, setSelected] = useState<Project | null>(null);
  const { stop, start } = useSmoothScroll();

  const filtered = useMemo(
    () =>
      filter === "all"
        ? projects
        : projects.filter((p) => p.category === filter),
    [filter]
  );

  // Lock page scroll while a case study is open.
  useEffect(() => {
    if (selected) {
      stop();
      document.body.style.overflow = "hidden";
    } else {
      start();
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [selected, stop, start]);

  const selectedIndex = selected
    ? filtered.findIndex((p) => p.id === selected.id)
    : -1;

  const nav = (dir: 1 | -1) => {
    if (selectedIndex < 0) return;
    const next = filtered[selectedIndex + dir];
    if (next) setSelected(next);
  };

  return (
    <section id="work" className="relative scroll-mt-24 py-24 md:py-32">
      <div className="mx-auto max-w-shell px-[var(--gutter)]">
        <header className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-accent">
              Selected Work
            </p>
            <h2 className="display mt-4 text-5xl leading-none md:text-7xl">
              Frames worth
              <br />
              remembering.
            </h2>
          </div>
          <p className="max-w-sm text-muted">
            A cross-section of recent films across every discipline we run.
            Hover to preview, click to step inside the case study.
          </p>
        </header>

        <div className="mt-12">
          <FilterBar active={filter} onChange={setFilter} />
        </div>

        {/* Grid — featured tiles span full width and break the rhythm */}
        <LayoutGroup>
          <motion.div
            layout
            className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
          >
            <AnimatePresence mode="popLayout">
              {filtered.map((p) => (
                <motion.div
                  key={p.id}
                  layout
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className={p.featured ? "sm:col-span-2 lg:col-span-3" : ""}
                >
                  <Tile project={p} onOpen={setSelected} featured={p.featured} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {/* Case study overlay — shares layoutId with the tile media */}
          <AnimatePresence>
            {selected && (
              <CaseStudy
                key={selected.id}
                project={selected}
                onClose={() => setSelected(null)}
                onNav={nav}
                hasPrev={selectedIndex > 0}
                hasNext={selectedIndex < filtered.length - 1}
              />
            )}
          </AnimatePresence>
        </LayoutGroup>
      </div>
    </section>
  );
}
