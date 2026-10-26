"use client";

import { Leaf, Mail, Phone, MapPin, Facebook, Instagram, Twitter, ArrowUp, Send, Settings, Clock, ShieldCheck, Truck, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NewsletterForm } from "./newsletter-form";

interface FooterProps {
  /** Admin-editable content from DB. Null fields fall back to defaults. */
  content?: {
    footerBrandText: string | null;
    footerTagline: string | null;
    contactPhone: string | null;
    contactEmail: string | null;
    contactAddress: string | null;
    contactHours: string | null;
    brandName: string | null;
    socialInstagram: string | null;
    socialFacebook: string | null;
    socialTwitter: string | null;
    socialTiktok: string | null;
    socialWhatsapp: string | null;
  };
  /** Open admin overlay. */
  onOpenAdmin?: () => void;
  /** Open order tracking dialog. */
  onTrackOrder?: () => void;
  /** Open order history dialog. */
  onOrderHistory?: () => void;
}

// Trust badges row — small visual proof of reliability
const TRUST_BADGES = [
  { icon: ShieldCheck, label: "100% Segar" },
  { icon: Truck, label: "Antar 2 Jam" },
  { icon: CreditCard, label: "Pembayaran Aman" },
];

// Payment methods — text labels styled as chips (no external image deps)
const PAYMENT_METHODS = ["BCA", "Mandiri", "BNI", "BRI", "GoPay", "OVO", "DANA", "ShopeePay", "COD"];

/**
 * Footer — bottom of page.
 * All internal links use anchor IDs (#beranda, #belanja, #tentang, #faq, #kontak)
 * that scroll to sections on the same page (no separate routes).
 * Social media links remain as placeholders (no real social accounts yet).
 *
 * Design: newsletter strip is an elevated card matching the site's design system
 * (gradient + ring + shadow + top accent bar). Section headers use uppercase
 * tracking-wider for clear scan-stops. Trust badges + payment methods row
 * provides credibility signals before the bottom bar.
 */
export function Footer({ content, onOpenAdmin, onTrackOrder, onOrderHistory }: FooterProps = {}) {
  const brandName = content?.brandName ?? "SayurLogi";
  const brandText = content?.footerBrandText ?? "Marketplace sayur & buah segar langsung dari petani lokal. Mendukung ekonomi petani Indonesia.";
  const tagline = content?.footerTagline ?? "Sayur & Buah Segar";
  const phone = content?.contactPhone ?? "0800-1234-5678";
  const email = content?.contactEmail ?? "halo@sayurbox.id";
  const address = content?.contactAddress ?? "Jl. Petani Sejahtera No. 88, Jakarta Selatan";
  const hours = content?.contactHours ?? "Setiap hari, 08.00 - 21.00 WIB";

  // Social links — activate if URL provided, otherwise show disabled
  const socialLinks = [
    { Icon: Facebook, label: "Facebook", url: content?.socialFacebook },
    { Icon: Instagram, label: "Instagram", url: content?.socialInstagram },
    { Icon: Twitter, label: "Twitter", url: content?.socialTwitter },
  ].filter((s) => s.url); // Only show links that have URLs

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
      {/* ============ Newsletter strip — elevated card, labeled section ============ */}
      <div className="mx-auto max-w-7xl px-4 pt-8">
        <p className="mb-2 px-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Newsletter</p>
        <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-card p-5 ring-1 ring-primary/20 shadow-[0_2px_4px_rgba(0,0,0,0.05),0_8px_24px_-8px_rgba(0,0,0,0.18)] md:p-6">
          {/* Solid top accent — primary green */}
          <div className="absolute inset-x-0 top-0 h-1.5 bg-primary" />
          <div className="grid items-center gap-4 md:grid-cols-2">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary ring-1 ring-inset ring-primary/20">
                <Send className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-bold md:text-lg">Dapatkan Promo & Tips Sehat 🌱</h3>
                <p className="mt-0.5 text-sm text-foreground/70">
                  Berlangganan newsletter untuk info diskon, resep sehat, dan tips pilih sayur segar.
                </p>
              </div>
            </div>
            <NewsletterForm />
          </div>
        </div>
      </div>

      {/* ============ Main footer grid ============ */}
      <div className="mx-auto max-w-7xl px-4 py-12">
        <p className="mb-6 px-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Tautan Cepat</p>
        <div className="grid gap-8 md:grid-cols-4">
        {/* Brand */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
              <Leaf className="h-5 w-5" />
            </div>
            <div>
              <span className="text-lg font-bold block leading-tight">{brandName}</span>
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground">{tagline}</span>
            </div>
          </div>
          <p className="text-sm text-foreground/70 leading-relaxed">
            {brandText}
          </p>

          {/* Trust badges row — small visual proof */}
          <div className="flex flex-wrap gap-2 pt-1">
            {TRUST_BADGES.map((badge) => {
              const Icon = badge.icon;
              return (
                <span
                  key={badge.label}
                  className="inline-flex items-center gap-1 rounded-full bg-card px-2.5 py-1 text-[10px] font-semibold text-foreground ring-1 ring-border/50"
                >
                  <Icon className="h-3 w-3 text-primary" />
                  {badge.label}
                </span>
              );
            })}
          </div>

          {/* Social media — only show if URLs configured in admin */}
          {socialLinks.length > 0 && (
            <div className="flex gap-2 pt-1">
              {socialLinks.map(({ Icon, label, url }) => (
                <a
                  key={label}
                  href={url!}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${brandName} di ${label}`}
                  title={label}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-card text-muted-foreground ring-1 ring-border/50 transition-all hover:bg-primary hover:text-primary-foreground hover:ring-primary hover:-translate-y-0.5"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          )}
        </div>

        {/* Navigasi */}
        <div>
          <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-foreground">Navigasi</h4>
          <ul className="space-y-1 text-sm text-muted-foreground">
            <li><a href="#beranda" onClick={handleNavClick("beranda")} className="block py-1.5 hover:text-primary hover:translate-x-1 transition-all">Beranda</a></li>
            <li><a href="#belanja" onClick={handleNavClick("belanja")} className="block py-1.5 hover:text-primary hover:translate-x-1 transition-all">Belanja Produk</a></li>
            <li><a href="#tentang" onClick={handleNavClick("tentang")} className="block py-1.5 hover:text-primary hover:translate-x-1 transition-all">Tentang Kami</a></li>
            <li><a href="#faq" onClick={handleNavClick("faq")} className="block py-1.5 hover:text-primary hover:translate-x-1 transition-all">FAQ</a></li>
            <li><a href="#kontak" onClick={handleNavClick("kontak")} className="block py-1.5 hover:text-primary hover:translate-x-1 transition-all">Hubungi Kami</a></li>
          </ul>
        </div>

        {/* Bantuan */}
        <div>
          <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-foreground">Bantuan</h4>
          <ul className="space-y-1 text-sm text-muted-foreground">
            <li><a href="#faq" onClick={handleNavClick("faq")} className="block py-1.5 hover:text-primary hover:translate-x-1 transition-all">Cara Pemesanan</a></li>
            <li><a href="#faq" onClick={handleNavClick("faq")} className="block py-1.5 hover:text-primary hover:translate-x-1 transition-all">Kebijakan Pengiriman</a></li>
            <li><a href="#faq" onClick={handleNavClick("faq")} className="block py-1.5 hover:text-primary hover:translate-x-1 transition-all">Pembayaran</a></li>
            <li><a href="#faq" onClick={handleNavClick("faq")} className="block py-1.5 hover:text-primary hover:translate-x-1 transition-all">Refund & Retur</a></li>
            <li><a href="#kontak" onClick={handleNavClick("kontak")} className="block py-1.5 hover:text-primary hover:translate-x-1 transition-all">Customer Service</a></li>
            {onTrackOrder && (
              <li>
                <button onClick={onTrackOrder} className="block w-full text-left py-1.5 hover:text-primary hover:translate-x-1 transition-all">
                  📦 Lacak Pesanan
                </button>
              </li>
            )}
            {onOrderHistory && (
              <li>
                <button onClick={onOrderHistory} className="block w-full text-left py-1.5 hover:text-primary hover:translate-x-1 transition-all">
                  📋 Riwayat Pesanan
                </button>
              </li>
            )}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-foreground">Hubungi Kami</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-primary shrink-0" />
              <a href={`tel:${phone.replace(/[^0-9+]/g, "")}`} className="hover:text-primary transition-colors">{phone}</a>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-primary shrink-0" />
              <a href={`mailto:${email}`} className="hover:text-primary transition-colors">{email}</a>
            </li>
            <li className="flex items-start gap-2">
              <MapPin className="h-4 w-4 text-primary shrink-0 mt-0.5" />
              <span>{address}</span>
            </li>
            <li className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary shrink-0" />
              <span>{hours}</span>
            </li>
          </ul>
        </div>
        </div>
      </div>

      {/* ============ Payment methods row — trust signal ============ */}
      <div className="mx-auto max-w-7xl px-4 pb-6">
        <div className="flex flex-col gap-3 rounded-2xl bg-gradient-to-br from-card via-card to-muted p-4 ring-1 ring-border shadow-[0_2px_4px_rgba(0,0,0,0.05),0_8px_24px_-8px_rgba(0,0,0,0.18)] md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-2">
            <CreditCard className="h-4 w-4 text-primary" />
            <span className="text-xs font-bold uppercase tracking-wider text-foreground">Metode Pembayaran</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {PAYMENT_METHODS.map((method) => (
              <span
                key={method}
                className="rounded-md bg-background px-2.5 py-1.5 text-[10px] font-bold text-foreground ring-1 ring-border shadow-sm"
              >
                {method}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ============ Bottom bar — copyright + legal + utilities ============ */}
      <div className="border-t border-border/60 bg-secondary/50">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-4 text-xs text-muted-foreground sm:flex-row">
          <p>© {new Date().getFullYear()} {brandName}. Powered by Next.js + ERPNext.</p>
          <div className="flex items-center gap-4">
            <a href="#faq" onClick={handleNavClick("faq")} className="hover:text-primary transition-colors">
              Syarat &amp; Ketentuan
            </a>
            <a href="#faq" onClick={handleNavClick("faq")} className="hover:text-primary transition-colors">
              Kebijakan Privasi
            </a>
            {onOpenAdmin && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onOpenAdmin}
                className="h-8 w-8 rounded-full hover:bg-primary hover:text-primary-foreground"
                aria-label="Buka admin dashboard"
                title="Admin (Ctrl+Shift+A)"
              >
                <Settings className="h-4 w-4" />
              </Button>
            )}
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
