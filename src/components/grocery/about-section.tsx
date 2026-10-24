"use client";

import { motion } from "framer-motion";
import { Sprout, Handshake, Truck, Leaf, Users, Clock, Award, Heart } from "lucide-react";

/**
 * Section "Tentang SayurBox" — brand story, mission, statistics, values.
 * Anchor target: #tentang (with scroll-mt-24 for sticky header offset).
 */
export function AboutSection() {
  const stats = [
    { icon: Users, value: "5.000+", label: "Pelanggan Bahagia", emoji: "😊" },
    { icon: Sprout, value: "120+", label: "Petani Mitra", emoji: "👨‍🌾" },
    { icon: Truck, value: "15", label: "Kota Terjangkau", emoji: "🚚" },
    { icon: Award, value: "4.9/5", label: "Rating Pengguna", emoji: "⭐" },
  ];

  const values = [
    {
      icon: Leaf,
      title: "Segar dari Kebun",
      desc: "Dipetik pagi hari, dikirim langsung tanpa middle-man. Kualitas terjaga, nutrisi maksimal.",
      color: "bg-green-500/10 text-green-600 dark:text-green-400",
    },
    {
      icon: Handshake,
      title: "Harga Adil untuk Petani",
      desc: "Kami bayar petani dengan harga layak. Tanpa eksploitasi, hubungan jangka panjang yang saling menguntungkan.",
      color: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
    },
    {
      icon: Heart,
      title: "100% Organik Pilihan",
      desc: "Sayuran organik tanpa pestisida. Sehat untuk keluarga, ramah untuk bumi.",
      color: "bg-rose-500/10 text-rose-600 dark:text-rose-400",
    },
    {
      icon: Clock,
      title: "Antar 2 Jam",
      desc: "Pesan sekarang, sampai siang. Rantai pasok pendek = kesegaran terjaga maksimal.",
      color: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400",
    },
  ];

  return (
    <section
      id="tentang"
      className="scroll-mt-24 border-y border-border/40 bg-gradient-to-b from-secondary/30 via-background to-background"
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
            <Sprout className="h-3.5 w-3.5" />
            Tentang Kami
          </span>
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-balance md:text-5xl">
            Dari Kebun Petani,{" "}
            <span className="bg-gradient-to-r from-primary to-emerald-500 bg-clip-text text-transparent">
              Langsung ke Meja Makan
            </span>{" "}
            Keluargamu
          </h2>
          <p className="mt-4 text-base text-muted-foreground md:text-lg text-balance">
            SayurBox lahir dari kepedulian pada petani Indonesia. Kami menghubungkan
            petani lokal langsung dengan konsumen — tanpa perantara, tanpa bahan kimia,
            dengan harga yang adil untuk semua pihak.
          </p>
        </motion.div>

        {/* Story + Image collage */}
        <div className="mt-12 grid items-center gap-8 md:grid-cols-2 md:gap-12">
          {/* Story text */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="space-y-4"
          >
            <h3 className="text-2xl font-bold">Misi Kami 🌱</h3>
            <p className="text-muted-foreground leading-relaxed">
              Indonesia adalah negara agraris yang kaya, tapi banyak petani masih
              kesulitan menjual hasil panen dengan harga layak. Sementara itu,
              konsumen kota sulit mendapatkan sayur & buah benar-benar segar.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              <strong className="text-foreground">SayurBox menjembatani</strong> kedua
              pihak: petani mendapat harga adil, konsumen mendapat produk segar dengan
              harga jujur. Win-win untuk semua.
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

          {/* Visual collage */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative aspect-square w-full max-w-md mx-auto"
          >
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary/20 via-lime-200/30 to-amber-200/20 blur-2xl" />
            <div className="relative grid h-full grid-cols-2 gap-3">
              <div className="flex flex-col gap-3">
                <div className="flex flex-1 items-center justify-center rounded-2xl bg-gradient-to-br from-green-400/20 to-emerald-500/20 text-5xl backdrop-blur-sm">
                  👨‍🌾
                </div>
                <div className="flex flex-1 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400/20 to-orange-500/20 text-5xl backdrop-blur-sm">
                  🚚
                </div>
              </div>
              <div className="flex flex-col gap-3 pt-6">
                <div className="flex flex-1 items-center justify-center rounded-2xl bg-gradient-to-br from-rose-400/20 to-red-500/20 text-5xl backdrop-blur-sm">
                  🥕
                </div>
                <div className="flex flex-1 items-center justify-center rounded-2xl bg-gradient-to-br from-lime-400/20 to-green-500/20 text-5xl backdrop-blur-sm">
                  🥬
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Stats */}
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
              className="flex flex-col items-center gap-2 rounded-2xl border border-border/60 bg-card p-6 text-center shadow-sm"
            >
              <span className="text-3xl" aria-hidden="true">{stat.emoji}</span>
              <span className="bg-gradient-to-r from-primary to-emerald-500 bg-clip-text text-3xl font-extrabold text-transparent md:text-4xl">
                {stat.value}
              </span>
              <span className="text-xs text-muted-foreground md:text-sm">{stat.label}</span>
            </motion.div>
          ))}
        </motion.div>

        {/* Values */}
        <div className="mt-16">
          <motion.h3
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="mb-8 text-center text-2xl font-bold md:text-3xl"
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
                className="flex flex-col gap-3 rounded-2xl border border-border/60 bg-card p-5 shadow-sm transition-all hover:shadow-md hover:border-primary/40"
              >
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${value.color}`}>
                  <value.icon className="h-6 w-6" />
                </div>
                <h4 className="text-base font-semibold">{value.title}</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">{value.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
