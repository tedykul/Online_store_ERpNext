"use client";

import { Leaf, Mail, Phone, MapPin, Facebook, Instagram, Twitter, ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * Footer — bottom of page.
 * All internal links use anchor IDs (#beranda, #belanja, #tentang, #faq, #kontak)
 * that scroll to sections on the same page (no separate routes).
 * Social media links remain as placeholders (no real social accounts yet).
 */
export function Footer() {
  const handleNavClick = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    const el = document.getElementById(id);
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="mt-auto border-t border-border/60 bg-secondary/30">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 md:grid-cols-4">
        {/* Brand */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Leaf className="h-4 w-4" />
            </div>
            <span className="text-lg font-bold">SayurBox</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Marketplace sayur & buah segar langsung dari petani lokal. Mendukung ekonomi petani Indonesia.
          </p>
          <div className="flex gap-2">
            {[
              { Icon: Facebook, label: "Facebook" },
              { Icon: Instagram, label: "Instagram" },
              { Icon: Twitter, label: "Twitter" },
            ].map(({ Icon, label }) => (
              <a
                key={label}
                href="#"
                onClick={(e) => e.preventDefault()}
                aria-label={`SayurBox di ${label} (segera hadir)`}
                title={`${label} — segera hadir`}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-background text-muted-foreground transition-colors hover:bg-primary hover:text-primary-foreground cursor-not-allowed"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        {/* Navigasi */}
        <div>
          <h4 className="mb-3 text-sm font-semibold">Navigasi</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>
              <a href="#beranda" onClick={handleNavClick("beranda")} className="hover:text-primary transition-colors">
                Beranda
              </a>
            </li>
            <li>
              <a href="#belanja" onClick={handleNavClick("belanja")} className="hover:text-primary transition-colors">
                Belanja Produk
              </a>
            </li>
            <li>
              <a href="#tentang" onClick={handleNavClick("tentang")} className="hover:text-primary transition-colors">
                Tentang Kami
              </a>
            </li>
            <li>
              <a href="#faq" onClick={handleNavClick("faq")} className="hover:text-primary transition-colors">
                FAQ
              </a>
            </li>
            <li>
              <a href="#kontak" onClick={handleNavClick("kontak")} className="hover:text-primary transition-colors">
                Hubungi Kami
              </a>
            </li>
          </ul>
        </div>

        {/* Bantuan */}
        <div>
          <h4 className="mb-3 text-sm font-semibold">Bantuan</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>
              <a href="#faq" onClick={handleNavClick("faq")} className="hover:text-primary transition-colors">
                Cara Pemesanan
              </a>
            </li>
            <li>
              <a href="#faq" onClick={handleNavClick("faq")} className="hover:text-primary transition-colors">
                Kebijakan Pengiriman
              </a>
            </li>
            <li>
              <a href="#faq" onClick={handleNavClick("faq")} className="hover:text-primary transition-colors">
                Pembayaran
              </a>
            </li>
            <li>
              <a href="#faq" onClick={handleNavClick("faq")} className="hover:text-primary transition-colors">
                Refund & Retur
              </a>
            </li>
            <li>
              <a href="#kontak" onClick={handleNavClick("kontak")} className="hover:text-primary transition-colors">
                Customer Service
              </a>
            </li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="mb-3 text-sm font-semibold">Hubungi Kami</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-primary shrink-0" />
              <a href="tel:080012345678" className="hover:text-primary transition-colors">
                0800-1234-5678
              </a>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-primary shrink-0" />
              <a href="mailto:halo@sayurbox.id" className="hover:text-primary transition-colors">
                halo@sayurbox.id
              </a>
            </li>
            <li className="flex items-start gap-2">
              <MapPin className="h-4 w-4 text-primary shrink-0 mt-0.5" />
              <span>Jl. Petani Sejahtera No. 88, Jakarta Selatan</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-primary text-base">🕗</span>
              <span>Setiap hari, 08.00 - 21.00 WIB</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border/60 py-4">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 text-xs text-muted-foreground sm:flex-row">
          <p>© {new Date().getFullYear()} SayurBox. Powered by Next.js + ERPNext.</p>
          <div className="flex items-center gap-4">
            <a
              href="#faq"
              onClick={handleNavClick("faq")}
              className="hover:text-primary transition-colors"
            >
              Syarat &amp; Ketentuan
            </a>
            <a
              href="#faq"
              onClick={handleNavClick("faq")}
              className="hover:text-primary transition-colors"
            >
              Kebijakan Privasi
            </a>
            <Button
              variant="ghost"
              size="icon"
              onClick={scrollToTop}
              className="h-8 w-8 rounded-full hover:bg-primary hover:text-primary-foreground"
              aria-label="Kembali ke atas"
              title="Kembali ke atas"
            >
              <ArrowUp className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </footer>
  );
}
