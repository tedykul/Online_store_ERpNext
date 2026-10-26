"use client";

import { motion } from "framer-motion";
import { Star, Quote, Heart, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

/**
 * Section "Apa Kata Pelanggan" — social proof with testimonials + stats.
 * Anchor: #testimoni (linked from footer/nav via #tentang area).
 * Placed between About and FAQ sections.
 */
interface Testimonial {
  name: string;
  role: string;
  avatar: string; // emoji avatar (kept for backward compat, but initials preferred)
  rating: number;
  text: string;
  location: string;
}

// Color palette for initial avatars — cycles deterministically by name
const AVATAR_COLORS = [
  "bg-primary/15 text-primary ring-primary/20",
  "bg-orange-500/15 text-orange-600 ring-orange-500/20",
  "bg-amber-500/15 text-amber-600 ring-amber-500/20",
  "bg-rose-500/15 text-rose-600 ring-rose-500/20",
  "bg-cyan-500/15 text-cyan-600 ring-cyan-500/20",
  "bg-violet-500/15 text-violet-600 ring-violet-500/20",
];

/** Get up to 2 initials from a full name (e.g. "Dewi Lestari" → "DL") */
function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

/** Deterministic color index from name (stable per user, not random per render) */
function getAvatarColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = (hash << 5) - hash + name.charCodeAt(i);
    hash |= 0; // force 32-bit
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

const TESTIMONIALS: Testimonial[] = [
  {
    name: "Dewi Lestari",
    role: "Ibu Rumah Tangga",
    avatar: "👩",
    rating: 5,
    text: "Sayurannya benar-benar segar! Bayam yang saya pesan masih hijau cerah dan renyah, beda banget sama yang di pasar. Pengiriman juga cepat, pesan pagi sampai siang.",
    location: "Jakarta Selatan",
  },
  {
    name: "Andi Pratama",
    role: "Chef Restoran",
    avatar: "👨‍🍳",
    rating: 5,
    text: "Sebagai chef, kualitas bahan adalah segalanya. SayurLogi jadi supplier utama restoran saya. Tomatnya ranum, herbs-nya harum, dan harganya bersaing dengan pasar tradisional.",
    location: "Bandung",
  },
  {
    name: "Siti Nurhaliza",
    role: "Pegawai Kantoran",
    avatar: "👩‍💼",
    rating: 5,
    text: "Praktis banget! Tinggal pesan dari HP, sampai rumah langsung. Paket hemat mingguan jadi solusi untuk masak harian tanpa repot ke pasar setiap hari.",
    location: "Tangerang",
  },
  {
    name: "Budi Santoso",
    role: "Ayah 2 Anak",
    avatar: "👨",
    rating: 4.5,
    text: "Anak-anak saya jadi doyan sayur karena SayurLogi. Buahnya manis-manis, sayurnya segar. Customer service-nya juga responsif. Recommended!",
    location: "Depok",
  },
  {
    name: "Rina Marlina",
    role: "Food Blogger",
    avatar: "👩‍🎨",
    rating: 5,
    text: "Saya review banyak grocery store, SayurLogi salah satu yang terbaik. Transparan soal asal produk, organik certification jelas. Worth every rupiah!",
    location: "Bekasi",
  },
  {
    name: "Hendra Wijaya",
    role: "Fitness Enthusiast",
    avatar: "🏃",
    rating: 5,
    text: "Paket juice cleanse-nya jadi favorit. Sayur & buah organik, dipetik segar, langsung sampai. Diet sehat jadi lebih mudah dan terjangkau.",
    location: "Jakarta Pusat",
  },
];

const PLATFORM_STATS = [
  { value: "4.9/5", label: "Rating Rata-rata", subtext: "dari 5.000+ ulasan", icon: Star },
  { value: "98%", label: "Pelanggan Puas", subtext: "berdasarkan survey 2024", icon: Heart },
  { value: "120+", label: "Petani Mitra", subtext: "dari 15 daerah", icon: TrendingUp },
  { value: "15K+", label: "Pesanan/Bulan", subtext: "dan terus bertumbuh", icon: Quote },
];

interface TestimonialItem {
  id: string;
  name: string;
  role: string;
  avatar: string;
  rating: number;
  text: string;
  location: string;
}

interface TestimonialsSectionProps {
  /** DB-driven testimonials. If empty/missing, falls back to hardcoded. */
  testimonials?: TestimonialItem[];
}

export function TestimonialsSection({ testimonials: dbTestimonials }: TestimonialsSectionProps = {}) {
  // Use DB testimonials if provided and non-empty, else hardcoded
  const items = dbTestimonials && dbTestimonials.length > 0 ? dbTestimonials : TESTIMONIALS;
  return (
    <section
      id="testimoni"
      className="scroll-mt-24 border-y border-border/40 bg-gradient-to-b from-background via-secondary/20 to-background"
    >
      <div className="mx-auto max-w-7xl px-4 py-16 md:py-24">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-3xl text-center"
        >
          <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
            <Heart className="h-3.5 w-3.5" />
            Apa Kata Pelanggan
          </span>
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-balance md:text-5xl">
            Dipercaya{" "}
            <span className="bg-gradient-to-r from-primary to-emerald-500 bg-clip-text text-transparent">
              Ribuan Keluarga
            </span>{" "}
            Indonesia
          </h2>
          <p className="mt-4 text-base text-muted-foreground md:text-lg text-balance">
            Bukan sekedar jualan sayur — kami bangun kepercayaan dengan setiap pesanan.
            Ini cerita nyata dari pelanggan setia SayurLogi.
          </p>
        </motion.div>

        {/* Platform stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6"
        >
          {PLATFORM_STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.15 + i * 0.05 }}
              className="group relative flex flex-col items-center gap-2 overflow-hidden rounded-2xl bg-gradient-to-br from-card via-card to-muted/50 p-6 text-center ring-1 ring-border/50 shadow-[0_1px_3px_rgba(0,0,0,0.06),0_8px_24px_-12px_rgba(0,0,0,0.15)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_4px_12px_rgba(0,0,0,0.08),0_16px_40px_-12px_rgba(0,0,0,0.22)] hover:ring-primary/30"
            >
              {/* Solid colored top accent — matches icon color */}
              <div className="absolute inset-x-0 top-0 h-1 bg-primary" />
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-inset ring-primary/10">
                <stat.icon className="h-5 w-5" />
              </div>
              <span className="bg-gradient-to-r from-primary to-emerald-500 bg-clip-text text-3xl font-extrabold text-transparent md:text-4xl tabular-nums">
                {stat.value}
              </span>
              <span className="text-sm font-semibold">{stat.label}</span>
              <span className="text-[11px] text-muted-foreground">{stat.subtext}</span>
            </motion.div>
          ))}
        </motion.div>

        {/* Testimonials grid */}
        <div className="mt-16 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {items.map((t, i) => (
            <TestimonialCard key={t.name} testimonial={t} index={i} />
          ))}
        </div>

        {/* Trust strip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="mt-16 flex flex-col items-center justify-center gap-4 rounded-2xl border border-primary/20 bg-primary/5 p-6 text-center md:flex-row md:gap-8"
        >
          <div className="flex items-center gap-2">
            <div className="flex" aria-label="Rating rata-rata 4.9 dari 5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className="h-5 w-5 fill-amber-400 text-amber-400"
                />
              ))}
            </div>
            <span className="text-2xl font-bold tabular-nums">4.9</span>
          </div>
          <div className="hidden h-8 w-px bg-border md:block" />
          <p className="text-sm text-muted-foreground max-w-md">
            Bergabung dengan <strong className="text-foreground">5.000+ pelanggan</strong> yang sudah merasakan
            kesegaran SayurLogi. Belanja sekarang, rasakan bedanya!
          </p>
          <a
            href="#belanja"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById("belanja")?.scrollIntoView({ behavior: "smooth" });
            }}
            className="rounded-full bg-primary px-5 py-2 text-sm font-medium text-primary-foreground shadow-md transition-transform hover:scale-105"
          >
            Mulai Belanja
          </a>
        </motion.div>
      </div>
    </section>
  );
}

function TestimonialCard({ testimonial, index }: { testimonial: Testimonial; index: number }) {
  const { name, role, rating, text, location } = testimonial;
  // Accent color based on rating — green for 5★, amber for <5★
  const isTopRated = rating >= 5;
  const accentBar = isTopRated ? "bg-primary" : "bg-amber-500";
  const initials = getInitials(name);
  const avatarColor = getAvatarColor(name);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.08, 0.4) }}
      className="group relative flex flex-col gap-3 overflow-hidden rounded-2xl bg-gradient-to-br from-card via-card to-muted/50 p-5 ring-1 ring-border/50 shadow-[0_1px_3px_rgba(0,0,0,0.06),0_8px_24px_-12px_rgba(0,0,0,0.15)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_4px_12px_rgba(0,0,0,0.08),0_16px_40px_-12px_rgba(0,0,0,0.22)] hover:ring-primary/30"
    >
      {/* Solid colored top accent — green for 5★, amber for <5★ */}
      <div className={`absolute inset-x-0 top-0 h-1 ${accentBar}`} />

      {/* Quote icon + rating row */}
      <div className="flex items-center justify-between">
        <Quote className="h-6 w-6 text-primary/30" />
        <div className="flex items-center gap-0.5" aria-label={`Rating ${rating} dari 5`}>
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={cn(
                "h-3.5 w-3.5",
                i < Math.floor(rating)
                  ? "fill-amber-400 text-amber-400"
                  : i < rating
                  ? "fill-amber-400/50 text-amber-400"
                  : "fill-muted text-muted"
              )}
            />
          ))}
          <span className="ml-1 text-xs font-semibold text-foreground tabular-nums">{rating.toFixed(1)}</span>
        </div>
      </div>

      {/* Testimonial text — line-clamp-4 to prevent wall-of-text on mobile */}
      <p className="text-sm text-foreground/80 leading-relaxed flex-1 line-clamp-4">"{text}"</p>

      {/* Author */}
      <div className="mt-2 flex items-center gap-3 border-t border-border/40 pt-3">
        {/* Initial avatar — colored circle with initials, ring for definition */}
        <div
          className={cn(
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold ring-1 ring-inset",
            avatarColor
          )}
          aria-label={`Avatar ${name}`}
        >
          {initials}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold leading-tight truncate">{name}</p>
          <p className="text-xs text-muted-foreground truncate">
            {role} · {location}
          </p>
        </div>
        <Badge variant="secondary" className="shrink-0 text-[10px] font-medium bg-primary/10 text-primary hover:bg-primary/15">
          ✓ Verified
        </Badge>
      </div>
    </motion.div>
  );
}
