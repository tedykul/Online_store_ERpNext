"use client";

import { motion } from "framer-motion";
import { Truck, ShieldCheck, Sprout, ArrowRight, Star, Clock, Users } from "lucide-react";
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
      {/* Subtle noise texture */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.015]" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9'/%3E%3C/filter%3E%3Crect width='100' height='100' filter='url(%23n)'/%3E%3C/svg%3E\")" }} />

      {/* Decorative gradient blobs */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute top-20 right-0 h-80 w-80 rounded-full bg-orange-300/15 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-64 w-64 rounded-full bg-lime-300/15 blur-3xl" />
      </div>

      <div className="relative mx-auto grid max-w-7xl items-center gap-8 px-4 py-12 md:grid-cols-2 md:py-20">
        {/* Left content */}
        <div className="flex flex-col gap-5">
          {/* Badge — premium pill with border + shadow */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex w-fit items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-xs font-semibold text-primary backdrop-blur-sm shadow-sm"
          >
            <Sprout className="h-4 w-4" />
            {badge}
          </motion.div>

          {/* Headline — weight contrast: setup thin, highlight bold */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
            className="text-4xl font-extrabold leading-[1.1] tracking-tight text-balance md:text-6xl"
          >
            <span className="font-bold text-muted-foreground">{titleA}</span>{" "}
            <span className="bg-gradient-to-r from-primary to-emerald-500 bg-clip-text text-transparent font-extrabold">
              {titleHighlight}
            </span>{" "}
            <span className="font-bold">{titleB}</span>
          </motion.h1>

          {/* Body text — darker, larger, constrained width */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-xl text-base text-foreground/70 leading-relaxed md:text-lg"
          >
            {subtitle}
          </motion.p>

          {/* Social proof bar — trust signals inline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-medium text-foreground/60"
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
            className="flex flex-wrap gap-3 pt-1"
          >
            <Button size="lg" className="rounded-full px-7 h-12 text-base shadow-lg shadow-orange-500/30 bg-gradient-to-b from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white border-0 group" onClick={onShopNow}>
              {ctaPrimary}
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
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

          {/* Trust badges — colored icon circles */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="mt-2 grid grid-cols-3 gap-3 text-center"
          >
            <div className="group relative flex flex-col items-center gap-1.5 overflow-hidden rounded-xl bg-gradient-to-br from-card via-card to-muted p-3 text-center ring-1 ring-border shadow-[0_2px_4px_rgba(0,0,0,0.05),0_8px_24px_-8px_rgba(0,0,0,0.18)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(0,0,0,0.08),0_16px_40px_-8px_rgba(0,0,0,0.24)] hover:ring-primary/30">
              <div className="absolute inset-x-0 top-0 h-1 bg-primary" />
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 ring-1 ring-inset ring-primary/10">
                <Truck className="h-4 w-4 text-primary" />
              </div>
              <span className="text-xs font-bold">Antar Cepat</span>
              <span className="text-[10px] text-muted-foreground">2 jam sampai</span>
            </div>
            <div className="group relative flex flex-col items-center gap-1.5 overflow-hidden rounded-xl bg-gradient-to-br from-card via-card to-muted p-3 text-center ring-1 ring-border shadow-[0_2px_4px_rgba(0,0,0,0.05),0_8px_24px_-8px_rgba(0,0,0,0.18)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(0,0,0,0.08),0_16px_40px_-8px_rgba(0,0,0,0.24)] hover:ring-orange-500/30">
              <div className="absolute inset-x-0 top-0 h-1 bg-orange-500" />
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-orange-500/10 ring-1 ring-inset ring-orange-500/10">
                <ShieldCheck className="h-4 w-4 text-orange-500" />
              </div>
              <span className="text-xs font-bold">Kualitas</span>
              <span className="text-[10px] text-muted-foreground">100% segar</span>
            </div>
            <div className="group relative flex flex-col items-center gap-1.5 overflow-hidden rounded-xl bg-gradient-to-br from-card via-card to-muted p-3 text-center ring-1 ring-border shadow-[0_2px_4px_rgba(0,0,0,0.05),0_8px_24px_-8px_rgba(0,0,0,0.18)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(0,0,0,0.08),0_16px_40px_-8px_rgba(0,0,0,0.24)] hover:ring-amber-500/30">
              <div className="absolute inset-x-0 top-0 h-1 bg-amber-500" />
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-500/10 ring-1 ring-inset ring-amber-500/10">
                <Sprout className="h-4 w-4 text-amber-600" />
              </div>
              <span className="text-xs font-bold">Petani Lokal</span>
              <span className="text-[10px] text-muted-foreground">Dari kebun</span>
            </div>
          </motion.div>
        </div>

        {/* Right visual — full image (no circular crop) with subtle animation */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="relative order-1 mb-2 hidden md:block md:order-2"
        >
          <div className="relative mx-auto w-full max-w-sm">
            {/* Gradient glow behind */}
            <div className="pointer-events-none absolute inset-0 -z-10 scale-110">
              <div className="absolute top-1/2 left-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-primary/20 via-orange-300/15 to-amber-200/10 blur-3xl" />
            </div>

            {/* Full image with rounded corners + breathing animation */}
            <motion.div
              animate={{ scale: [1, 1.03, 1], y: [0, -6, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="relative"
            >
              <div className="overflow-hidden rounded-3xl shadow-2xl ring-1 ring-white/40 shadow-primary/20">
                <img
                  src="/hero-produce-full.png"
                  alt="Sayur dan buah segar dari petani lokal"
                  className="w-full h-auto object-cover"
                  loading="eager"
                />
              </div>
            </motion.div>

            {/* Badge — "100% Segar" integrated as overlay sticker */}
            <motion.div
              initial={{ opacity: 0, scale: 0, rotate: -20 }}
              animate={{ opacity: 1, scale: 1, rotate: -8 }}
              transition={{ delay: 0.6, duration: 0.5, type: "spring", stiffness: 200 }}
              className="absolute -top-4 -right-4 z-10"
            >
              <motion.div
                animate={{ rotate: [-8, -5, -8] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="flex flex-col items-center justify-center rounded-2xl bg-orange-500 px-3.5 py-2.5 text-white shadow-xl ring-2 ring-white"
              >
                <span className="text-base font-extrabold leading-none">100%</span>
                <span className="text-[9px] font-semibold leading-tight mt-0.5">SEGAR</span>
              </motion.div>
            </motion.div>

            {/* Badge — "Antar 2 Jam" as overlay card */}
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8, duration: 0.5, type: "spring", stiffness: 200 }}
              className="absolute -bottom-4 -left-4 z-10"
            >
              <motion.div
                animate={{ y: [0, 6, 0] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
                className="flex items-center gap-1.5 rounded-2xl bg-white/95 backdrop-blur-md px-3.5 py-2.5 shadow-xl border border-orange-200/60"
              >
                <Truck className="h-4 w-4 text-orange-500" />
                <span className="text-xs font-bold text-foreground">Antar 2 Jam</span>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
