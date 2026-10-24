"use client";

import { motion } from "framer-motion";
import { Truck, ShieldCheck, Sprout, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

// Hardcoded defaults (used when content prop is null/missing)
const DEFAULTS = {
  badge: "Dipetik pagi, sampai rumah siang",
  titleA: "Sayur & Buah",
  titleHighlight: "Segar Harian",
  titleB: "dari Petani Lokal",
  subtitle: "Belanja sayuran organik dan buah-buahan pilihan langsung dari kebun. Tanpa perantara, harga jujur, kualitas terjamin.",
  ctaPrimary: "Mulai Belanja",
  ctaSecondary: "Lihat Promo",
};

interface HeroProps {
  onShopNow: () => void;
  onViewPromo?: () => void;
  /** Admin-editable content from DB. Null fields fall back to defaults. */
  content?: {
    heroBadge: string | null;
    heroTitleA: string | null;
    heroTitleHighlight: string | null;
    heroTitleB: string | null;
    heroSubtitle: string | null;
    heroCtaPrimary: string | null;
    heroCtaSecondary: string | null;
  };
}

export function Hero({ onShopNow, onViewPromo, content }: HeroProps) {
  const badge = content?.heroBadge ?? DEFAULTS.badge;
  const titleA = content?.heroTitleA ?? DEFAULTS.titleA;
  const titleHighlight = content?.heroTitleHighlight ?? DEFAULTS.titleHighlight;
  const titleB = content?.heroTitleB ?? DEFAULTS.titleB;
  const subtitle = content?.heroSubtitle ?? DEFAULTS.subtitle;
  const ctaPrimary = content?.heroCtaPrimary ?? DEFAULTS.ctaPrimary;
  const ctaSecondary = content?.heroCtaSecondary ?? DEFAULTS.ctaSecondary;

  const handleViewPromo = () => {
    if (onViewPromo) {
      onViewPromo();
    } else {
      // Default: scroll to #promo section
      const el = document.getElementById("promo");
      el?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <section id="beranda" className="relative overflow-hidden border-b border-border/40 scroll-mt-24">
      {/* Decorative gradient blobs */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute top-20 right-0 h-80 w-80 rounded-full bg-amber-300/20 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-64 w-64 rounded-full bg-lime-300/20 blur-3xl" />
      </div>

      <div className="mx-auto grid max-w-7xl items-center gap-8 px-4 py-12 md:grid-cols-2 md:py-20">
        {/* Left content */}
        <div className="flex flex-col gap-5">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex w-fit items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary"
          >
            <Sprout className="h-3.5 w-3.5" />
            {badge}
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="text-4xl font-extrabold leading-tight tracking-tight text-balance md:text-6xl"
          >
            {titleA}{" "}
            <span className="bg-gradient-to-r from-primary to-emerald-500 bg-clip-text text-transparent">
              {titleHighlight}
            </span>{" "}
            {titleB}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="max-w-prose text-base text-muted-foreground md:text-lg text-balance"
          >
            {subtitle}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="flex flex-wrap gap-3"
          >
            <Button size="lg" className="rounded-full px-7 h-12 text-base shadow-md" onClick={onShopNow}>
              {ctaPrimary}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="rounded-full px-7 h-12 text-base"
              onClick={handleViewPromo}
            >
              {ctaSecondary}
            </Button>
          </motion.div>

          {/* Trust badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.25 }}
            className="mt-2 grid grid-cols-3 gap-3 text-center"
          >
            <div className="flex flex-col items-center gap-1 rounded-xl border border-border/60 bg-card p-3">
              <Truck className="h-5 w-5 text-primary" />
              <span className="text-xs font-medium">Antar Cepat</span>
              <span className="text-[10px] text-muted-foreground">2 jam sampai</span>
            </div>
            <div className="flex flex-col items-center gap-1 rounded-xl border border-border/60 bg-card p-3">
              <ShieldCheck className="h-5 w-5 text-primary" />
              <span className="text-xs font-medium">Kualitas</span>
              <span className="text-[10px] text-muted-foreground">100% segar</span>
            </div>
            <div className="flex flex-col items-center gap-1 rounded-xl border border-border/60 bg-card p-3">
              <Sprout className="h-5 w-5 text-primary" />
              <span className="text-xs font-medium">Petani Lokal</span>
              <span className="text-[10px] text-muted-foreground">Dari kebun</span>
            </div>
          </motion.div>
        </div>

        {/* Right visual — emoji collage */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="relative hidden md:block"
        >
          <div className="relative mx-auto aspect-square w-full max-w-md">
            {/* Central circle */}
            <div className="absolute inset-8 rounded-full bg-gradient-to-br from-primary/15 via-lime-200/30 to-amber-200/20" />
            <div className="absolute inset-16 rounded-full bg-gradient-to-tr from-emerald-300/30 to-primary/10" />

            {/* Floating emoji "produce" */}
            {[
              { e: "🥬", x: "8%", y: "15%", s: "text-6xl", d: 0 },
              { e: "🍅", x: "65%", y: "8%", s: "text-5xl", d: 0.2 },
              { e: "🍎", x: "78%", y: "45%", s: "text-6xl", d: 0.4 },
              { e: "🥕", x: "60%", y: "75%", s: "text-5xl", d: 0.6 },
              { e: "🍇", x: "18%", y: "78%", s: "text-5xl", d: 0.8 },
              { e: "🌽", x: "2%", y: "48%", s: "text-4xl", d: 1 },
              { e: "🥦", x: "40%", y: "40%", s: "text-7xl", d: 0.3 },
              { e: "🍓", x: "42%", y: "5%", s: "text-4xl", d: 0.5 },
            ].map((item, i) => (
              <motion.div
                key={i}
                className={`absolute ${item.s}`}
                style={{ left: item.x, top: item.y }}
                initial={{ opacity: 0, y: 20, rotate: -10 }}
                animate={{ opacity: 1, y: 0, rotate: 0 }}
                transition={{ delay: 0.3 + item.d * 0.15, duration: 0.5 }}
              >
                <motion.span
                  className="inline-block drop-shadow-md"
                  animate={{ y: [0, -8, 0] }}
                  transition={{
                    duration: 3 + item.d,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  {item.e}
                </motion.span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
