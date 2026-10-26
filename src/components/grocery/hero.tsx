"use client";

import { motion } from "framer-motion";
import { Truck, ShieldCheck, Sprout, ArrowRight, Star, Clock } from "lucide-react";
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
    <section id="beranda" className="relative overflow-hidden scroll-mt-24">
      {/* ============ Full-bleed farmer harvesting image — edge to edge, no floating ============ */}
      <div className="absolute inset-0 z-0">
        <img
          src="/hero-farmer-harvest.png"
          alt="Petani lokal memetik sayur dan buah segar dari kebun"
          className="h-full w-full object-cover"
          loading="eager"
        />
        {/* Gradient vignette for text readability — dark top + dark bottom + radial center darkening */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/85 via-black/55 to-black/85" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-black/60" />
        {/* Radial spotlight darkening behind text for max readability */}
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 60% 50% at center, rgba(0,0,0,0.45) 0%, transparent 70%)" }} />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-12 md:py-32">
        <div className="flex flex-col items-center gap-4 md:gap-6 text-center">
          {/* Badge — premium pill, glassmorphism */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex w-fit items-center gap-2 rounded-full border border-white/20 bg-white/10 backdrop-blur-md px-4 py-2 text-xs font-semibold text-white shadow-sm"
          >
            <Sprout className="h-4 w-4 text-emerald-300" />
            {badge}
          </motion.div>

          {/* Headline — centered, large, white for max contrast on foliage */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
            className="text-4xl font-extrabold leading-[1.1] tracking-tight text-balance md:text-7xl md:tracking-tighter drop-shadow-2xl text-white"
          >
            <span className="font-bold text-white/90">{titleA}</span>{" "}
            <span className="bg-gradient-to-r from-emerald-300 to-lime-300 bg-clip-text text-transparent font-black drop-shadow-md">
              {titleHighlight}
            </span>{" "}
            <span className="font-bold text-white drop-shadow-md">{titleB}</span>
          </motion.h1>

          {/* Body text — glass pill for legibility */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-xl"
          >
            <p className="text-base text-white/90 leading-relaxed md:text-lg rounded-2xl bg-black/30 backdrop-blur-md px-5 py-3 border border-white/10">
              {subtitle}
            </p>
          </motion.div>

          {/* Social proof bar — glass pill */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs font-medium text-white/90 rounded-full bg-black/40 backdrop-blur-md px-4 py-2 shadow-sm border border-white/10"
          >
            <span className="flex items-center gap-1">
              <span className="flex">
                {[1,2,3,4,5].map(i => <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />)}
              </span>
              <strong className="text-white">4.9/5</strong>
              <span className="text-white/70">· 5.000+ pelanggan</span>
            </span>
            <span className="hidden sm:inline text-white/30">|</span>
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5 text-orange-300" />
              <strong className="text-white">Antar 2 jam</strong>
            </span>
            <span className="hidden sm:inline text-white/30">|</span>
            <span className="flex items-center gap-1">
              <Truck className="h-3.5 w-3.5 text-emerald-300" />
              <strong className="text-white">Gratis ongkir</strong> <span className="text-white/70">min. Rp50rb</span>
            </span>
          </motion.div>

          {/* CTA buttons — orange pops on green foliage, colored shadow for definition */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-wrap justify-center gap-3 pt-2"
          >
            <Button size="lg" className="rounded-full px-8 h-12 text-base shadow-2xl shadow-orange-600/50 bg-gradient-to-b from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white border-0 group ring-2 ring-white/20" onClick={onShopNow}>
              {ctaPrimary}
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="rounded-full px-7 h-12 text-base border-white/30 text-white hover:bg-white/10 hover:text-white hover:border-white/50 bg-white/5 backdrop-blur-md"
              onClick={handleViewPromo}
            >
              {ctaSecondary}
            </Button>
          </motion.div>

          {/* Trust badges — glass cards grounded (not floating), bottom of hero */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="mt-6 grid w-full max-w-2xl grid-cols-3 gap-3 text-center"
          >
            <div className="group relative flex flex-col items-center gap-1.5 overflow-hidden rounded-xl bg-white/10 backdrop-blur-md p-3 text-center ring-1 ring-white/20 shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/15">
              <div className="absolute inset-x-0 top-0 h-1 bg-emerald-400" />
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-500/20 ring-1 ring-inset ring-emerald-400/30">
                <Truck className="h-4 w-4 text-emerald-300" />
              </div>
              <span className="text-xs font-bold text-white">Antar Cepat</span>
              <span className="text-[10px] text-white/70">2 jam sampai</span>
            </div>
            <div className="group relative flex flex-col items-center gap-1.5 overflow-hidden rounded-xl bg-white/10 backdrop-blur-md p-3 text-center ring-1 ring-white/20 shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/15">
              <div className="absolute inset-x-0 top-0 h-1 bg-orange-400" />
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-orange-500/20 ring-1 ring-inset ring-orange-400/30">
                <ShieldCheck className="h-4 w-4 text-orange-300" />
              </div>
              <span className="text-xs font-bold text-white">Kualitas</span>
              <span className="text-[10px] text-white/70">100% segar</span>
            </div>
            <div className="group relative flex flex-col items-center gap-1.5 overflow-hidden rounded-xl bg-white/15 backdrop-blur-md p-3 text-center ring-2 ring-emerald-400/40 shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/20">
              <div className="absolute inset-x-0 top-0 h-1.5 bg-amber-400" />
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-500/25 ring-1 ring-inset ring-amber-400/40">
                <Sprout className="h-5 w-5 text-amber-300" />
              </div>
              <span className="text-xs font-extrabold text-white">Petani Lokal</span>
              <span className="text-[10px] font-semibold text-emerald-300">Dari kebun</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
