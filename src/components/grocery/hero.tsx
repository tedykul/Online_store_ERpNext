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

        {/* Right visual — realistic floating product photos */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="relative hidden md:block"
        >
          <div className="relative mx-auto aspect-square w-full max-w-md">
            {/* Soft gradient background circles */}
            <div className="absolute inset-4 rounded-full bg-gradient-to-br from-primary/15 via-lime-200/30 to-amber-200/20 blur-sm" />
            <div className="absolute inset-12 rounded-full bg-gradient-to-tr from-emerald-300/25 to-primary/10" />

            {/* Floating realistic product photos */}
            {[
              { src: "/products/tomat.png",   alt: "Tomat Merah Segar",     x: "5%",  y: "12%", size: "h-28 w-28", d: 0,   rotate: -8, badge: "-18%" },
              { src: "/products/apel.png",    alt: "Apel Fuji",              x: "62%", y: "5%",  size: "h-24 w-24", d: 0.3, rotate: 6,  badge: "-18%" },
              { src: "/products/brokoli.png", alt: "Brokoli Segar",          x: "72%", y: "42%", size: "h-28 w-28", d: 0.5, rotate: -4, badge: "-17%" },
              { src: "/products/anggur.png",  alt: "Anggur Merah",           x: "55%", y: "72%", size: "h-26 w-26", d: 0.7, rotate: 8,  badge: "-13%" },
              { src: "/products/wortel.png",  alt: "Wortel Lokal",           x: "12%", y: "75%", size: "h-24 w-24", d: 0.9, rotate: -6, badge: null },
              { src: "/products/bayam.png",   alt: "Bayam Hijau Organik",    x: "0%",  y: "42%", size: "h-22 w-22", d: 1.1, rotate: 5,  badge: "Organik" },
            ].map((item, i) => (
              <motion.div
                key={i}
                className="absolute"
                style={{ left: item.x, top: item.y }}
                initial={{ opacity: 0, y: 30, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: 0.3 + item.d * 0.12, duration: 0.6, type: "spring", stiffness: 200 }}
              >
                <motion.div
                  animate={{ y: [0, -10, 0], rotate: [item.rotate, item.rotate + 2, item.rotate] }}
                  transition={{
                    duration: 3.5 + item.d,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: item.d,
                  }}
                  className="relative"
                >
                  {/* Product photo with rounded corners + shadow */}
                  <div className={`${item.size} overflow-hidden rounded-2xl border-2 border-white/80 shadow-xl bg-white/50 backdrop-blur-sm`}>
                    <img
                      src={item.src}
                      alt={item.alt}
                      className="h-full w-full object-cover"
                      loading="eager"
                    />
                  </div>
                  {/* Badge (discount or organic) */}
                  {item.badge && (
                    <div className={`absolute -top-2 -right-2 rounded-full px-2 py-0.5 text-[10px] font-bold text-white shadow-md ${
                      item.badge === "Organik"
                        ? "bg-primary"
                        : "bg-rose-500"
                    }`}>
                      {item.badge}
                    </div>
                  )}
                </motion.div>
              </motion.div>
            ))}

            {/* Decorative sparkle dots */}
            {[
              { x: "45%", y: "20%", d: 0 },
              { x: "30%", y: "55%", d: 0.5 },
              { x: "85%", y: "65%", d: 1 },
              { x: "50%", y: "88%", d: 1.5 },
            ].map((dot, i) => (
              <motion.div
                key={`dot-${i}`}
                className="absolute h-2 w-2 rounded-full bg-primary/40"
                style={{ left: dot.x, top: dot.y }}
                animate={{ scale: [0, 1, 0], opacity: [0, 0.6, 0] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: dot.d,
                  ease: "easeInOut",
                }}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
