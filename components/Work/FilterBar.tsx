"use client";

import { motion } from "framer-motion";
import { FILTERS } from "@/data/projects";
import type { Category } from "@/data/projects";

type Filter = Category | "all";

type Props = {
  active: Filter;
  onChange: (f: Filter) => void;
};

export default function FilterBar({ active, onChange }: Props) {
  return (
    <div
      role="tablist"
      aria-label="Filter work by category"
      className="no-scrollbar -mx-[var(--gutter)] flex gap-2 overflow-x-auto px-[var(--gutter)] py-1"
    >
      {FILTERS.map((f) => {
        const isActive = active === f.id;
        return (
          <button
            key={f.id}
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(f.id)}
            data-cursor="link"
            className={`relative shrink-0 rounded-full border px-4 py-2 text-sm transition-colors ${
              isActive
                ? "border-accent text-accent-ink"
                : "border-line text-muted hover:text-ink"
            }`}
          >
            {isActive && (
              <motion.span
                layoutId="filter-pill"
                className="absolute inset-0 -z-10 rounded-full bg-accent"
                transition={{ type: "spring", stiffness: 400, damping: 35 }}
              />
            )}
            {f.label}
          </button>
        );
      })}
    </div>
  );
}
