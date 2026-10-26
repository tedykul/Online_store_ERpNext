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
  const stats = [
    { icon: Users, value: c.aboutStat1Value ?? "5.000+", label: c.aboutStat1Label ?? "Pelanggan Bahagia", color: "bg-primary/10 text-primary" },
    { icon: Sprout, value: c.aboutStat2Value ?? "120+", label: c.aboutStat2Label ?? "Petani Mitra", color: "bg-orange-500/10 text-orange-500" },
    { icon: Truck, value: c.aboutStat3Value ?? "15", label: c.aboutStat3Label ?? "Kota Terjangkau", color: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400" },
    { icon: Award, value: c.aboutStat4Value ?? "4.9/5", label: c.aboutStat4Label ?? "Rating Pengguna", color: "bg-amber-500/10 text-amber-600 dark:text-amber-400" },
  ];

  const values = [
    {
      icon: Leaf,
      title: c.aboutValue1Title ?? "Segar dari Kebun",
      desc: c.aboutValue1Desc ?? "Dipetik pagi hari, dikirim langsung tanpa middle-man. Kualitas terjaga, nutrisi maksimal.",
      color: "bg-green-500/10 text-green-600 dark:text-green-400",
    },
    {
      icon: Handshake,
      title: c.aboutValue2Title ?? "Harga Adil untuk Petani",
      desc: c.aboutValue2Desc ?? "Kami bayar petani dengan harga layak. Tanpa eksploitasi, hubungan jangka panjang yang saling menguntungkan.",
      color: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
    },
    {
      icon: Heart,
      title: c.aboutValue3Title ?? "100% Organik Pilihan",
      desc: c.aboutValue3Desc ?? "Sayuran organik tanpa pestisida. Sehat untuk keluarga, ramah untuk bumi.",
      color: "bg-rose-500/10 text-rose-600 dark:text-rose-400",
    },
    {
      icon: Clock,
      title: c.aboutValue4Title ?? "Antar 2 Jam",
      desc: c.aboutValue4Desc ?? "Pesan sekarang, sampai siang. Rantai pasok pendek = kesegaran terjaga maksimal.",
      color: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400",
    },
  ];

  return (
    <section
      id="tentang"
      className="scroll-mt-24 border-y border-border/40 bg-gradient-to-b from-secondary/30 via-background to-background relative overflow-hidden"
    >
      {/* Subtle noise texture overlay */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.015]" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9'/%3E%3C/filter%3E%3Crect width='100' height='100' filter='url(%23n)'/%3E%3C/svg%3E\")" }} />

      <div className="relative mx-auto max-w-7xl px-4 py-20 md:py-28">
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
            {c.aboutBadge ?? "Tentang Kami"}
          </span>
          <h2 className="mt-6 text-3xl font-extrabold leading-[1.15] tracking-tight text-balance md:text-5xl">
            <span className="font-bold text-muted-foreground">{c.aboutTitleA ?? "Dari Kebun Petani,"}</span>{" "}
            <span className="bg-gradient-to-r from-primary to-emerald-500 bg-clip-text text-transparent font-extrabold">
              {c.aboutTitleHighlight ?? "Langsung ke Meja Makan"}
            </span>{" "}
            <span className="font-bold">{c.aboutTitleB ?? "Keluargamu"}</span>
          </h2>
          <p className="mt-5 text-base text-foreground/70 md:text-lg leading-relaxed text-balance max-w-2xl mx-auto">
            {c.aboutSubtitle ?? "SayurLogi lahir dari kepedulian pada petani Indonesia. Kami menghubungkan petani lokal langsung dengan konsumen — tanpa perantara, tanpa bahan kimia, dengan harga yang adil untuk semua pihak."}
          </p>
        </motion.div>

        {/* Story + Visual — gap-12 for more breathing room */}
        <div className="mt-12 grid items-center gap-8 md:grid-cols-2 md:gap-12">
          {/* Story text — with pull quote highlight */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="space-y-4"
          >
            <h3 className="text-2xl font-bold tracking-tight">{c.aboutStoryH3 ?? "Misi Kami 🌱"}</h3>
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

          {/* Visual — gradient pattern with tagline (replaces emoji collage) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative aspect-square w-full max-w-md mx-auto"
          >
            {/* Gradient glow background */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary/20 via-orange-300/15 to-amber-200/10 blur-2xl" />

            {/* Premium gradient card with tagline */}
            <div className="relative flex h-full flex-col items-center justify-center gap-6 rounded-3xl border border-border/40 bg-gradient-to-br from-primary/5 via-orange-500/5 to-amber-500/5 p-8 text-center">
              {/* Top icon cluster */}
              <div className="flex items-center gap-3">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary shadow-md">
                  <Sprout className="h-7 w-7" />
                </div>
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-500/10 text-orange-500 shadow-md">
                  <Truck className="h-7 w-7" />
                </div>
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-600 shadow-md">
                  <Heart className="h-7 w-7" />
                </div>
              </div>

              {/* Tagline */}
              <div className="space-y-2">
                <p className="text-2xl font-extrabold tracking-tight text-foreground">
                  Dari Kebun
                  <span className="text-orange-500"> → </span>
                  ke Meja Makan
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
                  Rantai pasok terpendek untuk kesegaran maksimal. Tanpa perantara, tanpa bahan kimia.
                </p>
              </div>

              {/* Flow diagram */}
              <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
                <span className="rounded-lg bg-primary/10 px-3 py-1.5 text-primary">🌱 Petani</span>
                <span className="text-orange-500">→</span>
                <span className="rounded-lg bg-orange-500/10 px-3 py-1.5 text-orange-500">🚚 SayurLogi</span>
                <span className="text-orange-500">→</span>
                <span className="rounded-lg bg-amber-500/10 px-3 py-1.5 text-amber-600">🏠 Kamu</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Stats — Lucide icons in colored circles (no emoji) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mt-16 grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6"
        >
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.15 + i * 0.05 }}
              className="flex flex-col items-center gap-3 rounded-2xl border border-border/60 bg-card p-6 text-center shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-primary/5 hover:border-primary/20"
            >
              {/* Icon in colored circle — replaces emoji */}
              <div className={`flex h-12 w-12 items-center justify-center rounded-full ${stat.color}`}>
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
        <div className="mt-16">
          <motion.h3
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="mb-8 text-center text-2xl font-bold tracking-tight md:text-3xl"
          >
            Nilai yang Kami Pegang
          </motion.h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((value, i) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="flex flex-col gap-3 rounded-2xl border border-border/60 bg-card p-5 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-primary/5 hover:border-primary/20"
              >
                {/* Bigger icon circle (h-14 w-14) + ring border for depth */}
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
