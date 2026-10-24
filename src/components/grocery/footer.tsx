"use client";

import { Leaf, Mail, Phone, MapPin, Facebook, Instagram, Twitter } from "lucide-react";

export function Footer() {
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
            {[Facebook, Instagram, Twitter].map((Icon, i) => (
              <a
                key={i}
                href="#"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-background text-muted-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
                aria-label="Social media"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        {/* Categories */}
        <div>
          <h4 className="mb-3 text-sm font-semibold">Kategori</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><a href="#" className="hover:text-primary transition-colors">🥬 Sayuran Segar</a></li>
            <li><a href="#" className="hover:text-primary transition-colors">🍎 Buah Lokal & Impor</a></li>
            <li><a href="#" className="hover:text-primary transition-colors">🌿 Herbal & Rempah</a></li>
            <li><a href="#" className="hover:text-primary transition-colors">🧺 Paket Hemat</a></li>
          </ul>
        </div>

        {/* Help */}
        <div>
          <h4 className="mb-3 text-sm font-semibold">Bantuan</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><a href="#" className="hover:text-primary transition-colors">Cara Pemesanan</a></li>
            <li><a href="#" className="hover:text-primary transition-colors">Kebijakan Pengiriman</a></li>
            <li><a href="#" className="hover:text-primary transition-colors">Pembayaran</a></li>
            <li><a href="#" className="hover:text-primary transition-colors">FAQ</a></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="mb-3 text-sm font-semibold">Hubungi Kami</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-primary shrink-0" /> 0800-1234-5678
            </li>
            <li className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-primary shrink-0" /> halo@sayurbox.id
            </li>
            <li className="flex items-start gap-2">
              <MapPin className="h-4 w-4 text-primary shrink-0 mt-0.5" />
              <span>Jl. Petani Sejahtera No. 88, Jakarta Selatan</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border/60 py-4">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 text-xs text-muted-foreground sm:flex-row">
          <p>© {new Date().getFullYear()} SayurBox. Powered by Next.js + ERPNext.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-primary">Syarat & Ketentuan</a>
            <a href="#" className="hover:text-primary">Kebijakan Privasi</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
