"use client";

import { motion } from "framer-motion";
import { Truck, ShieldCheck, Sprout, ArrowRight, Star, Clock, Users, Leaf } from "lucide-react";
import { Button } from "@/components/ui/button";

// Hardcoded defaults (used when content prop is null/missing)
const DEFAULTS = {
  badge: "Dipetik pagi, sampai rumah siang",
  titleA: "Sayur & Buah",
  titleHighlight: "Segar Harian",
  titleB: "dari Petani Lokal",
  subtitle: "Belanja organik langsung dari kebun. Tanpa perantara, harga jujur.",
  ctaPrimary: "Mulai Belanja",
  ctaSecondary: "Lihat Promo",
};

interface HeroProps {
  onShopNow: () => void;
  onViewPromo?: () => void;
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
      document.getElementById("promo")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <section id="beranda" className="relative overflow-hidden border-b border-border/40 scroll-mt-24">
      {/* ============ Background: scattered vegetables full-bleed ============ */}
      <div className="absolute inset-0 z-0">
        <img
          src="/hero-produce-scattered.png"
          alt="Sayur dan buah segar berlimpah dari petani lokal"
          className="h-full w-full object-cover"
          loading="eager"
        />
        {/* Gradient overlays for text legibility — dark vignette top + bottom, light center */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/85 via-background/60 to-background/85" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/70 via-transparent to-background/70" />
      </div>

      {/* Decorative gradient blobs (subtle, behind text) */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute top-20 right-0 h-80 w-80 rounded-full bg-orange-300/15 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-64 w-64 rounded-full bg-lime-300/15 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-16 md:py-24">
        <div className="flex flex-col items-center gap-5 text-center">
          {/* Badge — premium pill with border + shadow */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex w-fit items-center gap-2 rounded-full border border-primary/20 bg-background/80 backdrop-blur-md px-4 py-2 text-xs font-semibold text-primary shadow-sm"
          >
            <Sprout className="h-4 w-4" />
            {badge}
          </motion.div>

          {/* Headline — centered, large, on top of scattered vegetables */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
            className="text-4xl font-extrabold leading-[1.1] tracking-tight text-balance md:text-7xl md:tracking-tighter drop-shadow-lg"
          >
            <span className="font-bold text-foreground/90 drop-shadow-md">{titleA}</span>{" "}
            <span className="bg-gradient-to-r from-primary to-emerald-500 bg-clip-text text-transparent font-black drop-shadow-md">
              {titleHighlight}
            </span>{" "}
            <span className="font-bold text-foreground drop-shadow-md">{titleB}</span>
          </motion.h1>

          {/* Body text — centered, backdrop blur for legibility */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-xl"
          >
            <p className="text-base text-foreground/85 leading-relaxed md:text-lg rounded-xl bg-background/40 backdrop-blur-sm px-4 py-2 inline-block">
              {subtitle}
            </p>
          </motion.div>

          {/* Social proof bar — trust signals inline, glassmorphism pill */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs font-medium text-foreground/80 rounded-full bg-background/60 backdrop-blur-md px-4 py-2 shadow-sm border border-border/40"
          >
            <span className="flex items-center gap-1">
              <span className="flex">
                {[1,2,3,4,5].map(i => <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />)}
              </span>
              <strong className="text-foreground">4.9/5</strong>
              <span>· 5.000+ pelanggan</span>
            </span>
            <span className="hidden sm:inline text-border">|</span>
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5 text-orange-500" />
              <strong className="text-foreground">Antar 2 jam</strong>
            </span>
            <span className="hidden sm:inline text-border">|</span>
            <span className="flex items-center gap-1">
              <Truck className="h-3.5 w-3.5 text-primary" />
              <strong className="text-foreground">Gratis ongkir</strong> min. Rp50rb
            </span>
          </motion.div>

          {/* CTA buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-wrap justify-center gap-3 pt-1"
          >
            <Button size="lg" className="rounded-full px-7 h-12 text-base shadow-xl shadow-orange-500/40 bg-gradient-to-b from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white border-0 group" onClick={onShopNow}>
              {ctaPrimary}
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="rounded-full px-7 h-12 text-base border-orange-300 text-orange-600 hover:bg-orange-50 hover:text-orange-700 hover:border-orange-400 dark:hover:bg-orange-950/30 bg-background/80 backdrop-blur-md"
              onClick={handleViewPromo}
            >
              {ctaSecondary}
            </Button>
          </motion.div>

          {/* Trust badges — colored icon circles, glassmorphism */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="mt-4 grid w-full max-w-2xl grid-cols-3 gap-3 text-center"
          >
            <div className="group relative flex flex-col items-center gap-1.5 overflow-hidden rounded-xl bg-background/80 backdrop-blur-md p-3 text-center ring-1 ring-border shadow-[0_2px_4px_rgba(0,0,0,0.05),0_8px_24px_-8px_rgba(0,0,0,0.18)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(0,0,0,0.08),0_16px_40px_-8px_rgba(0,0,0,0.24)] hover:ring-primary/30">
              <div className="absolute inset-x-0 top-0 h-1 bg-primary" />
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 ring-1 ring-inset ring-primary/10">
                <Truck className="h-4 w-4 text-primary" />
              </div>
              <span className="text-xs font-bold">Antar Cepat</span>
              <span className="text-[10px] text-muted-foreground">2 jam sampai</span>
            </div>
            <div className="group relative flex flex-col items-center gap-1.5 overflow-hidden rounded-xl bg-background/80 backdrop-blur-md p-3 text-center ring-1 ring-border shadow-[0_2px_4px_rgba(0,0,0,0.05),0_8px_24px_-8px_rgba(0,0,0,0.18)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(0,0,0,0.08),0_16px_40px_-8px_rgba(0,0,0,0.24)] hover:ring-orange-500/30">
              <div className="absolute inset-x-0 top-0 h-1 bg-orange-500" />
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-orange-500/10 ring-1 ring-inset ring-orange-500/10">
                <ShieldCheck className="h-4 w-4 text-orange-500" />
              </div>
              <span className="text-xs font-bold">Kualitas</span>
              <span className="text-[10px] text-muted-foreground">100% segar</span>
            </div>
            <div className="group relative flex flex-col items-center gap-1.5 overflow-hidden rounded-xl bg-background/80 backdrop-blur-md p-3 text-center ring-1 ring-primary/30 shadow-[0_2px_4px_rgba(0,0,0,0.05),0_8px_24px_-8px_rgba(0,0,0,0.18)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(0,0,0,0.08),0_16px_40px_-8px_rgba(0,0,0,0.24)] hover:ring-primary/50 ring-2 ring-primary/20">
              <div className="absolute inset-x-0 top-0 h-1.5 bg-amber-500" />
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-500/15 ring-1 ring-inset ring-amber-500/20">
                <Sprout className="h-5 w-5 text-amber-600" />
              </div>
              <span className="text-xs font-extrabold">Petani Lokal</span>
              <span className="text-[10px] font-semibold text-primary">Dari kebun</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
