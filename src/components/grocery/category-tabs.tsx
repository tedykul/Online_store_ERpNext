"use client";

import { motion } from "framer-motion";
import type { Category } from "@/types/grocery";
import { cn } from "@/lib/utils";

interface CategoryTabsProps {
  categories: Category[];
  active: string | null;
  onChange: (id: string | null) => void;
}

export function CategoryTabs({ categories, active, onChange }: CategoryTabsProps) {
  return (
    <div className="flex flex-wrap gap-2 sm:gap-3">
      <CategoryPill
        active={active === null}
        onClick={() => onChange(null)}
        emoji="🛒"
        label="Semua"
        gradient="from-slate-500 to-slate-700"
      />
      {categories.map((c) => (
        <CategoryPill
          key={c.id}
          active={active === c.id}
          onClick={() => onChange(c.id)}
          emoji={c.emoji}
          label={c.name}
          gradient={c.gradient}
        />
      ))}
    </div>
  );
}

function CategoryPill({
  active,
  onClick,
  emoji,
  label,
  gradient,
}: {
  active: boolean;
  onClick: () => void;
  emoji: string;
  label: string;
  gradient: string;
}) {
  return (
    <motion.button
      whileTap={{ scale: 0.96 }}
      onClick={onClick}
      className={cn(
        "group relative flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-all",
        active
          ? "border-primary bg-primary text-primary-foreground shadow-md"
          : "border-border bg-card text-foreground hover:border-primary/50 hover:bg-accent/50"
      )}
    >
      <span
        className={cn(
          "flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br text-base transition-transform group-hover:scale-110",
          gradient
        )}
      >
        {emoji}
      </span>
      {label}
    </motion.button>
  );
}
