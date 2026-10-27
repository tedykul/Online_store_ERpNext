"use client";

import { motion } from "framer-motion";
import { Sprout, Handshake, Truck, Leaf, Users, Clock, Award, Heart, Quote } from "lucide-react";

interface AboutContent {
  aboutBadge: string | null;
  aboutTitleA: string | null;
  aboutTitleHighlight: string | null;
  aboutTitleB: string | null;
  aboutSubtitle: string | null;
  aboutStoryH3: string | null;
  aboutStoryP1: string | null;
  aboutStoryP2: string | null;
  aboutStat1Value: string | null;
  aboutStat1Label: string | null;
  aboutStat2Value: string | null;
  aboutStat2Label: string | null;
  aboutStat3Value: string | null;
  aboutStat3Label: string | null;
  aboutStat4Value: string | null;
  aboutStat4Label: string | null;
  aboutValue1Title: string | null;
  aboutValue1Desc: string | null;
  aboutValue2Title: string | null;
  aboutValue2Desc: string | null;
  aboutValue3Title: string | null;
  aboutValue3Desc: string | null;
  aboutValue4Title: string | null;
  aboutValue4Desc: string | null;
}

interface AboutSectionProps {
  content?: Partial<AboutContent>;
}

/**
 * Section "Tentang SayurLogi" — brand story, mission, statistics, values.
 * Anchor target: #tentang (with scroll-mt-24 for sticky header offset).
 */
export function AboutSection({ content }: AboutSectionProps = {}) {
  const c = content || {};

  // Stats — Lucide icons in colored circles (no emoji)
  // `bar` = solid color for top accent (icon bg is /10 opacity, too faint for accent)
  const stats = [
    { icon: Users, value: c.aboutStat1Value ?? "5.000+", label: c.aboutStat1Label ?? "Pelanggan Bahagia", color: "bg-primary/10 text-primary", bar: "bg-primary" },
    { icon: Sprout, value: c.aboutStat2Value ?? "120+", label: c.aboutStat2Label ?? "Petani Mitra", color: "bg-orange-500/10 text-orange-500", bar: "bg-orange-500" },
    { icon: Truck, value: c.aboutStat3Value ?? "15", label: c.aboutStat3Label ?? "Kota Terjangkau", color: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400", bar: "bg-cyan-500" },
    { icon: Award, value: c.aboutStat4Value ?? "4.9/5", label: c.aboutStat4Label ?? "Rating Pengguna", color: "bg-amber-500/10 text-amber-600 dark:text-amber-400", bar: "bg-amber-500" },
  ];

  const values = [
    {
      icon: Leaf,
      title: c.aboutValue1Title ?? "Segar dari Kebun",
      desc: c.aboutValue1Desc ?? "Dipetik pagi hari, dikirim langsung tanpa middle-man. Kualitas terjaga, nutrisi maksimal.",
      color: "bg-green-500/10 text-green-600 dark:text-green-400",
      bar: "bg-green-500",
    },
    {
      icon: Handshake,
      title: c.aboutValue2Title ?? "Harga Adil untuk Petani",
      desc: c.aboutValue2Desc ?? "Kami bayar petani dengan harga layak. Tanpa eksploitasi, hubungan jangka panjang yang saling menguntungkan.",
      color: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
      bar: "bg-amber-500",
    },
    {
      icon: Heart,
      title: c.aboutValue3Title ?? "100% Organik Pilihan",
      desc: c.aboutValue3Desc ?? "Sayuran organik tanpa pestisida. Sehat untuk keluarga, ramah untuk bumi.",
      color: "bg-rose-500/10 text-rose-600 dark:text-rose-400",
      bar: "bg-rose-500",
    },
    {
      icon: Clock,
      title: c.aboutValue4Title ?? "Antar 2 Jam",
      desc: c.aboutValue4Desc ?? "Pesan sekarang, sampai siang. Rantai pasok pendek = kesegaran terjaga maksimal.",
      color: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400",
      bar: "bg-cyan-500",
    },
  ];

  return (
    <section
      id="tentang"
      className="scroll-mt-24 border-y border-border/40 bg-gradient-to-b from-primary/5 via-background to-background relative overflow-hidden"
    >
      {/* Subtle organic leaf pattern texture */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60' viewBox='0 0 60 60'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23059669' fill-opacity='0.5'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }} />
      {/* Decorative gradient blobs */}
      <div className="pointer-events-none absolute -top-20 right-0 h-64 w-64 rounded-full bg-primary/8 blur-3xl" />
      <div className="pointer-events-none absolute bottom-1/4 -left-20 h-72 w-72 rounded-full bg-orange-300/6 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 py-10 md:py-28">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto max-w-3xl text-center"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-xs font-semibold text-primary backdrop-blur-sm shadow-sm">
            <Sprout className="h-4 w-4" />
            {c.aboutBadge ?? "Cerita Kami"}
          </span>
          <h2 className="font-display mt-6 text-3xl font-extrabold leading-[1.15] tracking-tight text-balance md:text-5xl">
            <span className="font-bold text-muted-foreground">{c.aboutTitleA ?? "Dari Kebun Petani,"}</span>{" "}
            <span className="bg-gradient-to-r from-primary to-emerald-500 bg-clip-text text-transparent font-extrabold">
              {c.aboutTitleHighlight ?? "Langsung ke Meja Makan"}
            </span>{" "}
            <span className="font-bold">{c.aboutTitleB ?? "Keluargamu"}</span>
          </h2>
          <p className="mt-5 text-base text-foreground/80 md:text-lg leading-relaxed text-balance max-w-xl mx-auto">
            {c.aboutSubtitle ?? "SayurLogi lahir dari kepedulian pada petani Indonesia. Kami menghubungkan petani lokal langsung dengan konsumen — tanpa perantara, tanpa bahan kimia, dengan harga yang adil untuk semua pihak."}
          </p>

          {/* Inline micro-stats — unified green gradient (no rainbow chaos).
              Larger labels with tighter tracking for readability. */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mx-auto mt-6 flex max-w-lg items-center justify-center divide-x divide-border/60 md:mt-10"
          >
            <div className="flex flex-1 flex-col items-center px-4">
              <span className="bg-gradient-to-r from-primary to-emerald-500 bg-clip-text text-2xl font-extrabold text-transparent md:text-3xl tabular-nums">
                {c.aboutStat1Value ?? "5.000+"}
              </span>
              <span className="mt-1 text-xs font-semibold text-foreground/70 uppercase tracking-normal">
                {c.aboutStat1Label ?? "Pelanggan"}
              </span>
            </div>
            <div className="flex flex-1 flex-col items-center px-4">
              <span className="bg-gradient-to-r from-primary to-emerald-500 bg-clip-text text-2xl font-extrabold text-transparent md:text-3xl tabular-nums">
                {c.aboutStat2Value ?? "120+"}
              </span>
              <span className="mt-1 text-xs font-semibold text-foreground/70 uppercase tracking-normal">
                {c.aboutStat2Label ?? "Petani Mitra"}
              </span>
            </div>
            <div className="flex flex-1 flex-col items-center px-4">
              <span className="bg-gradient-to-r from-primary to-emerald-500 bg-clip-text text-2xl font-extrabold text-transparent md:text-3xl tabular-nums">
                {c.aboutStat3Value ?? "15"}
              </span>
              <span className="mt-1 text-xs font-semibold text-foreground/70 uppercase tracking-normal">
                {c.aboutStat3Label ?? "Kota"}
              </span>
            </div>
          </motion.div>
        </motion.div>

        {/* Story + Visual — gap-12 for more breathing room */}
        <div className="mt-8 grid items-center gap-6 md:grid-cols-2 md:gap-12 md:mt-12">
          {/* Story text — with pull quote highlight */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="space-y-4"
          >
            <h3 className="flex items-center gap-2 text-2xl font-bold tracking-tight">
              <Sprout className="h-6 w-6 text-primary" />
              {c.aboutStoryH3 ?? "Misi Kami"}
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              {c.aboutStoryP1 ?? "Indonesia adalah negara agraris yang kaya, tapi banyak petani masih kesulitan menjual hasil panen dengan harga layak. Sementara itu, konsumen kota sulit mendapatkan sayur & buah benar-benar segar."}
            </p>

            {/* Pull quote — visual break between paragraphs */}
            <div className="my-4 flex items-start gap-3 rounded-2xl border-l-4 border-orange-500 bg-orange-500/5 p-4">
              <Quote className="h-5 w-5 shrink-0 text-orange-500 mt-0.5" />
              <p className="text-sm font-semibold text-foreground italic leading-relaxed">
                "Petani mendapat harga adil, konsumen mendapat produk segar. Win-win untuk semua."
              </p>
            </div>

            <p className="text-muted-foreground leading-relaxed">
              {c.aboutStoryP2 ?? "SayurLogi menjembatani kedua pihak: petani mendapat harga adil, konsumen mendapat produk segar dengan harga jujur. Win-win untuk semua."}
            </p>
            <div className="flex flex-wrap gap-2 pt-2">
              {["#DukungPetaniLokal", "#SayurOrganik", "#TanpaPestisida", "#RantaiPendek"].map(
                (tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-foreground"
                  >
                    {tag}
                  </span>
                )
              )}
            </div>
          </motion.div>

          {/* Visual — real farmer photo + harvest photo (replaces generic icon cluster) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative w-full max-w-md mx-auto"
          >
            {/* Gradient glow background */}
            <div className="pointer-events-none absolute inset-0 -z-10 scale-105 rounded-3xl bg-gradient-to-br from-primary/20 via-orange-300/15 to-amber-200/10 blur-2xl" />

            {/* Main farmer photo — full bleed, rounded, shadow */}
            <div className="relative overflow-hidden rounded-3xl shadow-2xl ring-1 ring-white/40 shadow-primary/20 bg-gradient-to-br from-primary/10 to-secondary/30">
              <img
                src="/about-farmer.png"
                alt="Petani lokal di kebun sayur saat pagi hari"
                className="w-full aspect-[4/5] object-cover"
                loading="lazy"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
              {/* Gradient overlay bottom for text legibility */}
              <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/60 to-transparent" />
              {/* Tagline overlay — bottom of photo */}
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <p className="font-display text-xl font-extrabold leading-tight drop-shadow-lg">
                  Dari Kebun
                  <span className="text-orange-300"> → </span>
                  ke Meja Makan
                </p>
                <p className="mt-1 text-[11px] text-white/85 leading-snug">
                  Rantai pasok terpendek untuk kesegaran maksimal
                </p>
              </div>
            </div>

            {/* Floating badge — top left */}
            <div className="absolute -top-3 -left-3 z-10 flex items-center gap-1.5 rounded-full bg-primary px-3 py-1.5 text-white shadow-lg ring-2 ring-white">
              <Sprout className="h-3.5 w-3.5" />
              <span className="text-[10px] font-bold">Petani Mitra</span>
            </div>
          </motion.div>
        </div>

        {/* Stats — Lucide icons in colored circles (no emoji) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-4 md:mt-16 md:gap-6"
        >
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.15 + i * 0.05 }}
              className="group relative flex flex-col items-center gap-3 overflow-hidden rounded-2xl bg-gradient-to-br from-card via-card to-muted p-6 text-center ring-1 ring-border shadow-[0_2px_4px_rgba(0,0,0,0.05),0_8px_24px_-8px_rgba(0,0,0,0.18)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_4px_12px_rgba(0,0,0,0.08),0_16px_40px_-8px_rgba(0,0,0,0.24)] hover:ring-primary/30"
            >
              {/* Solid colored top accent — matches icon color, adds depth cue */}
              <div className={`absolute inset-x-0 top-0 h-1.5 ${stat.bar}`} />
              {/* Icon in colored circle with inner ring for dimensionality */}
              <div className={`flex h-12 w-12 items-center justify-center rounded-full ${stat.color} ring-1 ring-inset ring-current/10`}>
                <stat.icon className="h-6 w-6" />
              </div>
              <span className="bg-gradient-to-r from-primary to-emerald-500 bg-clip-text text-3xl font-extrabold text-transparent md:text-4xl tabular-nums">
                {stat.value}
              </span>
              <span className="text-xs text-muted-foreground md:text-sm font-medium">{stat.label}</span>
            </motion.div>
          ))}
        </motion.div>

        {/* Values — bigger icon circles + ring border */}
        <div className="mt-8 md:mt-16">
          <motion.h3
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="mb-4 text-center text-xl font-bold tracking-tight md:mb-8 md:text-2xl"
          >
            Nilai yang Kami Pegang
          </motion.h3>
          {/* Mobile: compact 2x2 grid (icon + title only, no description) */}
          <div className="grid grid-cols-2 gap-2.5 md:hidden">
            {values.map((value, i) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: i * 0.06 }}
                className="group relative flex flex-col items-center gap-2 overflow-hidden rounded-xl bg-gradient-to-br from-card via-card to-muted/50 p-3 text-center ring-1 ring-border shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className={`absolute inset-x-0 top-0 h-1 ${value.bar}`} />
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${value.color} ring-1 ring-inset ring-current/10`}>
                  <value.icon className="h-5 w-5" />
                </div>
                <span className="text-xs font-bold leading-tight">{value.title}</span>
              </motion.div>
            ))}
          </div>
          {/* Desktop: full 4-col grid with description (unchanged) */}
          <div className="hidden gap-4 sm:grid sm:grid-cols-2 lg:grid-cols-4">
            {values.map((value, i) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="group relative flex flex-col gap-3 overflow-hidden rounded-2xl bg-gradient-to-br from-card via-card to-muted p-5 ring-1 ring-border shadow-[0_2px_4px_rgba(0,0,0,0.05),0_8px_24px_-8px_rgba(0,0,0,0.18)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_4px_12px_rgba(0,0,0,0.08),0_16px_40px_-8px_rgba(0,0,0,0.24)] hover:ring-primary/30"
              >
                <div className={`absolute inset-x-0 top-0 h-1.5 ${value.bar}`} />
                <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${value.color} ring-1 ring-inset ring-current/10`}>
                  <value.icon className="h-7 w-7" />
                </div>
                <h4 className="text-base font-bold tracking-tight">{value.title}</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">{value.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
