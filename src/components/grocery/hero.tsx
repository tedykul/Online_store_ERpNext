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
        <div className="flex flex-col gap-5 order-2 md:order-1">
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
            <Button size="lg" className="rounded-full px-7 h-12 text-base shadow-lg bg-gradient-to-b from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white border-0" onClick={onShopNow}>
              {ctaPrimary}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="rounded-full px-7 h-12 text-base border-orange-300 text-orange-600 hover:bg-orange-50 hover:text-orange-700 hover:border-orange-400 dark:hover:bg-orange-950/30"
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

        {/* Right visual — clean masonry grid of product photos */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="relative order-1 md:order-2"
        >
          <div className="relative mx-auto w-full max-w-xs sm:max-w-sm md:max-w-md">
            {/* Grid 3×2 — staggered fade-in, no floating */}
            <div className="grid grid-cols-3 gap-2.5">
              {[
                { src: "/products/tomat.png",   alt: "Tomat Merah Segar",  badge: "-18%", badgeColor: "bg-orange-500" },
                { src: "/products/apel.png",    alt: "Apel Fuji",           badge: "-18%", badgeColor: "bg-orange-500" },
                { src: "/products/brokoli.png", alt: "Brokoli Segar",       badge: "-17%", badgeColor: "bg-orange-500" },
                { src: "/products/anggur.png",  alt: "Anggur Merah",        badge: "-13%", badgeColor: "bg-orange-500" },
                { src: "/products/wortel.png",  alt: "Wortel Lokal",        badge: null,   badgeColor: "" },
                { src: "/products/bayam.png",   alt: "Bayam Hijau Organik", badge: "Organik", badgeColor: "bg-primary" },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay: 0.2 + i * 0.08, duration: 0.5, ease: "easeOut" }}
                  className="relative aspect-square overflow-hidden rounded-2xl border-2 border-white shadow-lg bg-white group"
                >
                  <img
                    src={item.src}
                    alt={item.alt}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="eager"
                  />
                  {/* Badge */}
                  {item.badge && (
                    <div className={`absolute top-1.5 left-1.5 rounded-lg ${item.badgeColor} px-1.5 py-0.5 text-[9px] font-bold text-white shadow-md`}>
                      {item.badge}
                    </div>
                  )}
                </motion.div>
              ))}
            </div>

            {/* Subtle gradient glow behind grid */}
            <div className="pointer-events-none absolute inset-0 -z-10 rounded-3xl bg-gradient-to-br from-primary/10 via-orange-300/10 to-amber-200/10 blur-xl" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
