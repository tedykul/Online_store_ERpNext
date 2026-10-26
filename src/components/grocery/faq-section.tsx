"use client";

import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { HelpCircle, MessageCircleQuestion } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * Section "FAQ" — accordion of frequently asked questions.
 * Anchor target: #faq (with scroll-mt-24 for sticky header offset).
 */
const FAQ_ITEMS: { q: string; a: string }[] = [
  {
    q: "Bagaimana cara memesan di SayurLogi?",
    a: "Pilih produk yang kamu inginkan, klik 'Tambah' untuk masuk keranjang. Setelah selesai, klik ikon keranjang lalu 'Checkout Sekarang'. Isi data pengiriman, pilih metode pembayaran, lalu 'Buat Pesanan'. Pesanan akan diproses dan dikirim sesuai jadwal pengiriman yang dipilih.",
  },
  {
    q: "Berapa lama waktu pengiriman?",
    a: "Kami mengantarkan pesanan dalam waktu 2-4 jam untuk wilayah kota metropolitan. Untuk pengiriman di luar kota, estimasi 1-2 hari kerja. Kamu akan menerima notifikasi via WhatsApp/email ketika pesanan sedang dalam perjalanan.",
  },
  {
    q: "Apakah ada minimum order?",
    a: "Tidak ada minimum order! Tapi untuk mendapatkan gratis ongkir, belanja minimal Rp50.000. Di bawah nominal tersebut, ongkir flat Rp9.000 berlaku untuk wilayah kota.",
  },
  {
    q: "Metode pembayaran apa saja yang tersedia?",
    a: "Kami menerima 3 metode pembayaran: (1) COD — bayar tunai di tempat saat pesanan tiba, (2) Transfer bank (BCA, Mandiri, BNI, BRI), dan (3) E-Wallet (GoPay, OVO, DANA, ShopeePay). Semua transaksi aman dan terenkripsi.",
  },
  {
    q: "Apakah sayuran & buah benar-benar segar?",
    a: "Ya! Semua produk dipetik langsung dari kebun petani mitra pada pagi hari, lalu dikirim ke gudang kami untuk quality check, dan diteruskan ke konsumen di hari yang sama. Rantai pasok pendek = kesegaran maksimal. Jika kamu menerima produk yang tidak segar, hubungi kami dalam 24 jam untuk penggantian gratis.",
  },
  {
    q: "Apakah semua produk organik?",
    a: "Tidak semua, tapi kami menandai produk organik dengan badge 'Organik' hijau di kartu produk. Produk organik ditanam tanpa pestisida sintetis dan disertasi dari lembaga organik terpercaya. Produk non-organik masih aman dikonsumsi karena ditanam dengan praktik pertanian yang baik (GAP).",
  },
  {
    q: "Bagaimana kebijakan refund dan retur?",
    a: "Jika produk yang kamu terima rusak, busuk, atau tidak sesuai pesanan, hubungi customer service dalam 24 jam dengan foto bukti. Kami akan menggantinya gratis atau refund 100%. Untuk perubahan pikiran, refund berlaku untuk produk kemasan yang belum dibuka dalam 3 hari.",
  },
  {
    q: "Bisakah saya jadwalkan pengiriman untuk hari tertentu?",
    a: "Ya! Saat checkout, pilih tanggal & slot waktu pengiriman yang kamu inginkan (pagi 09-12, siang 12-15, sore 15-18, atau malam 18-21). Cocok untuk yang ingin pesan sayur untuk masak akhir pekan atau kebutuhan kantin harian.",
  },
];

interface FaqSectionProps {
  /** DB-driven FAQs. If empty/missing, falls back to hardcoded defaults. */
  faqs?: { id: string; q: string; a: string }[];
}

export function FaqSection({ faqs: dbFaqs }: FaqSectionProps = {}) {
  // Use DB FAQs if provided and non-empty, else hardcoded defaults
  const items = dbFaqs && dbFaqs.length > 0 ? dbFaqs : FAQ_ITEMS;

  const handleContactClick = () => {
    const el = document.getElementById("kontak");
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section
      id="faq"
      className="scroll-mt-24 border-b border-border/40 bg-secondary/20"
    >
      <div className="mx-auto max-w-4xl px-4 py-16 md:py-24">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
            <HelpCircle className="h-3.5 w-3.5" />
            Pusat Bantuan
          </span>
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-balance md:text-5xl">
            Pertanyaan yang{" "}
            <span className="bg-gradient-to-r from-primary to-emerald-500 bg-clip-text text-transparent">
              Sering Ditanyakan
            </span>
          </h2>
          <p className="mt-4 text-base text-muted-foreground md:text-lg text-balance">
            Belum nemu jawabannya? Tim kami siap bantu di section Kontak di bawah.
          </p>
        </motion.div>

        {/* Accordion */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mt-10"
        >
          <Accordion type="single" collapsible className="space-y-3">
            {items.map((item, i) => (
              <AccordionItem
                key={item.id || i}
                value={`item-${i}`}
                className="overflow-hidden rounded-xl border border-border/60 bg-card px-5 shadow-sm transition-shadow data-[state=open]:shadow-md"
              >
                <AccordionTrigger className="py-5 text-left text-base font-semibold hover:no-underline">
                  <span className="pr-2">{item.q}</span>
                </AccordionTrigger>
                <AccordionContent className="pb-5 pt-0 text-sm text-muted-foreground leading-relaxed">
                  {item.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>

        {/* CTA to contact */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="mt-10 flex flex-col items-center gap-3 rounded-2xl border border-dashed border-primary/40 bg-primary/5 p-6 text-center"
        >
          <MessageCircleQuestion className="h-8 w-8 text-primary" />
          <div>
            <h3 className="text-lg font-semibold">Masih ada pertanyaan?</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Tim customer service kami siap membantu 7 hari seminggu (08.00-21.00 WIB)
            </p>
          </div>
          <Button onClick={handleContactClick} className="mt-2 rounded-full px-6">
            Hubungi Kami
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
