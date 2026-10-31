"use client";

import { motion } from "framer-motion";
import { Sprout, Handshake, Truck, Leaf, Users, Clock, Award, Heart } from "lucide-react";

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
  aboutImage: string | null;
}

interface AboutSectionProps {
  content?: Partial<AboutContent>;
}

// ============================================================
// Section "Tentang SayurLogi" — brand story, stats, values.
// ============================================================
// Clean layout (no duplicate stats, unified green accent):
//   1. Badge + heading + subtitle
//   2. Story text (2 col) + visual card (compact, not square)
//   3. Stats grid (4 cards, single render, unified green)
//   4. Values grid (4 cards, 2 accent max)
// ============================================================

export function AboutSection({ content }: AboutSectionProps = {}) {
  const c = content || {};

  // Stats — unified green accent (no rainbow)
  const stats = [
    { icon: Users, value: c.aboutStat1Value ?? "5.000+", label: c.aboutStat1Label ?? "Pelanggan Bahagia" },
    { icon: Sprout, value: c.aboutStat2Value ?? "120+", label: c.aboutStat2Label ?? "Petani Mitra" },
    { icon: Truck, value: c.aboutStat3Value ?? "15", label: c.aboutStat3Label ?? "Kota Terjangkau" },
    { icon: Award, value: c.aboutStat4Value ?? "4.9/5", label: c.aboutStat4Label ?? "Rating Pengguna" },
  ];

  // Values — 2 accent only (green + amber), not 4 rainbow
  const values = [
    {
      icon: Leaf,
      title: c.aboutValue1Title ?? "Segar dari Kebun",
      desc: c.aboutValue1Desc ?? "Dipetik pagi hari, dikirim langsung tanpa middle-man. Kualitas terjaga, nutrisi maksimal.",
    },
    {
      icon: Handshake,
      title: c.aboutValue2Title ?? "Harga Adil untuk Petani",
      desc: c.aboutValue2Desc ?? "Kami bayar petani dengan harga layak. Tanpa eksploitasi, hubungan jangka panjang yang saling menguntungkan.",
    },
    {
      icon: Heart,
      title: c.aboutValue3Title ?? "100% Organik Pilihan",
      desc: c.aboutValue3Desc ?? "Sayuran organik tanpa pestisida. Sehat untuk keluarga, ramah untuk bumi.",
    },
    {
      icon: Clock,
      title: c.aboutValue4Title ?? "Antar 2 Jam",
      desc: c.aboutValue4Desc ?? "Pesan sekarang, sampai siang. Rantai pasok pendek = kesegaran terjaga maksimal.",
    },
  ];

  return (
    <section
      id="tentang"
      className="scroll-mt-24 border-y border-border/40 bg-gradient-to-b from-primary/5 via-background to-background relative overflow-hidden"
    >
      {/* Subtle organic texture */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60' viewBox='0 0 60 60'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23059669' fill-opacity='0.5'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }} />

      <div className="relative mx-auto max-w-7xl px-4 py-8 md:py-24">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-3xl text-center"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-semibold text-primary backdrop-blur-sm shadow-sm">
            <Sprout className="h-3.5 w-3.5" />
            {c.aboutBadge ?? "Cerita Kami"}
          </span>
          <h2 className="font-display mt-4 text-2xl font-extrabold leading-[1.15] tracking-tight text-balance md:text-4xl">
            <span className="font-bold text-muted-foreground">{c.aboutTitleA ?? "Dari Kebun Petani,"}</span>{" "}
            <span className="bg-gradient-to-r from-primary to-emerald-500 bg-clip-text text-transparent font-extrabold">
              {c.aboutTitleHighlight ?? "Langsung ke Meja Makan"}
            </span>{" "}
            <span className="font-bold">{c.aboutTitleB ?? "Keluargamu"}</span>
          </h2>
          <p className="mt-4 text-sm text-foreground/70 leading-relaxed md:text-base max-w-2xl mx-auto">
            {c.aboutSubtitle ?? "SayurLogi lahir dari kepedulian pada petani Indonesia. Kami menghubungkan petani lokal langsung dengan konsumen — tanpa perantara, tanpa bahan kimia, dengan harga yang adil untuk semua pihak."}
          </p>
        </motion.div>

        {/* Story + Visual — 2 col on desktop, stacked on mobile */}
        <div className="mt-8 grid items-center gap-6 md:mt-14 md:grid-cols-2 md:gap-12">
          {/* Story text */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="space-y-4"
          >
            <h3 className="flex items-center gap-2 text-lg font-bold tracking-tight md:text-xl">
              <Sprout className="h-5 w-5 text-primary" />
              {c.aboutStoryH3 ?? "Misi Kami"}
            </h3>
            <div className="rounded-xl border border-border/60 bg-card p-4 md:p-5">
              <p className="text-sm text-foreground/70 leading-relaxed md:text-[15px]">
                {c.aboutStoryP1 ?? "Indonesia negara agraris yang kaya. Tapi banyak petani masih kesulitan menjual hasil panen dengan harga layak. Sementara konsumen kota sulit mendapat sayur & buah segar."}
              </p>
              <div className="my-3 border-l-2 border-primary pl-3">
                <p className="text-sm font-semibold text-foreground italic leading-relaxed">
                  "Petani mendapat harga adil, konsumen mendapat produk segar. Win-win untuk semua."
                </p>
              </div>
              <p className="text-sm text-foreground/70 leading-relaxed md:text-[15px]">
                {c.aboutStoryP2 ??
                  "SayurLogi menjembatani kedua pihak. Petani mendapat harga adil, konsumen mendapat produk segar dengan harga jujur."}
              </p>
            </div>
          </motion.div>

          {/* Visual — compact card (not aspect-square), icon cluster + flow */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative w-full"
          >
            {/* Soft glow */}
            <div className="pointer-events-none absolute inset-0 -z-10 scale-105">
              <div className="absolute top-1/2 left-1/2 h-56 w-56 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-primary/15 via-emerald-200/10 to-transparent blur-3xl" />
            </div>

            <div className="relative flex flex-col items-center justify-center gap-5 rounded-3xl border border-border/40 bg-gradient-to-br from-primary/5 via-emerald-500/5 to-background p-6 text-center md:p-8">
              {/* Icon cluster */}
              <div className="flex items-center gap-2.5">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary shadow-sm">
                  <Sprout className="h-6 w-6" />
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary shadow-sm">
                  <Truck className="h-6 w-6" />
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary shadow-sm">
                  <Heart className="h-6 w-6" />
                </div>
              </div>

              {/* Tagline */}
              <div className="space-y-1.5">
                <p className="font-display text-xl font-extrabold tracking-tight text-foreground md:text-2xl">
                  Dari Kebun
                  <span className="text-primary"> → </span>
                  ke Meja Makan
                </p>
                <p className="text-xs text-muted-foreground leading-relaxed max-w-xs mx-auto md:text-sm">
                  Rantai pasok terpendek untuk kesegaran maksimal. Tanpa perantara, tanpa bahan kimia.
                </p>
              </div>

              {/* Flow diagram */}
              <div className="flex items-center gap-1.5 text-[11px] font-semibold md:text-xs">
                <span className="rounded-lg bg-primary/10 px-2.5 py-1.5 text-primary flex items-center gap-1">
                  <Sprout className="h-3 w-3" /> Petani
                </span>
                <span className="text-primary">→</span>
                <span className="rounded-lg bg-primary/10 px-2.5 py-1.5 text-primary flex items-center gap-1">
                  <Truck className="h-3 w-3" /> SayurLogi
                </span>
                <span className="text-primary">→</span>
                <span className="rounded-lg bg-primary/10 px-2.5 py-1.5 text-primary flex items-center gap-1">
                  <Heart className="h-3 w-3" /> Kamu
                </span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Stats grid — single render, unified green accent */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mt-8 grid grid-cols-2 gap-3 md:mt-16 md:grid-cols-4 md:gap-5"
        >
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.1 + i * 0.05 }}
              className="group relative flex flex-col items-center gap-2 overflow-hidden rounded-2xl border border-border/60 bg-card p-4 text-center transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-md md:p-6"
            >
              <div className="absolute inset-x-0 top-0 h-1 bg-primary" />
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary md:h-12 md:w-12">
                <stat.icon className="h-5 w-5 md:h-6 md:w-6" />
              </div>
              <span className="bg-gradient-to-r from-primary to-emerald-500 bg-clip-text text-xl font-extrabold text-transparent md:text-3xl tabular-nums">
                {stat.value}
              </span>
              <span className="text-[11px] text-muted-foreground md:text-sm font-medium">{stat.label}</span>
            </motion.div>
          ))}
        </motion.div>

        {/* Values grid */}
        <div className="mt-8 md:mt-14">
          <motion.h3
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="mb-4 text-center text-lg font-bold tracking-tight md:mb-6 md:text-xl"
          >
            Nilai yang Kami Pegang
          </motion.h3>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-5">
            {values.map((value, i) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="group relative flex flex-col gap-2.5 overflow-hidden rounded-2xl border border-border/60 bg-card p-4 transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-md md:p-5"
              >
                <div className="absolute inset-x-0 top-0 h-1 bg-primary" />
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary md:h-12 md:w-12">
                  <value.icon className="h-5 w-5 md:h-6 md:w-6" />
                </div>
                <h4 className="text-sm font-bold tracking-tight md:text-base">{value.title}</h4>
                <p className="text-xs text-muted-foreground leading-relaxed md:text-sm">{value.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
