# 🥬 SayurLogi — Toko Online Sayur & Buah Segar

Marketplace grocery online dengan integrasi ERPNext. Dibangun dengan Next.js 16, TypeScript, Tailwind CSS 4, Prisma ORM, dan shadcn/ui.

![Next.js](https://img.shields.io/badge/Next.js_16-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript_5-blue?logo=typescript)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS_4-38bdf8?logo=tailwindcss)
![Prisma](https://img.shields.io/badge/Prisma-2d3748?logo=prisma)

## ✨ Fitur Utama

### 🛒 Storefront
- **Hero section** animated dengan Framer Motion + floating badges
- **Product catalog** dengan 23 produk (sayur, buah, herbal, paket)
- **Sticky category bar** + sort/filter — always accessible saat scroll
- **"Sedang Promo" carousel** — top 4 deals horizontal scroll
- **Load-more pagination** (8 initial, +8 on click) — anti scroll fatigue
- **Product detail modal** — foto, deskripsi, manfaat, info, trust badges, sticky checkout footer
- **Cart sheet** — slide-in drawer dengan free-shipping progress bar (glow effect), qty stepper, trust indicators
- **Checkout dialog** — 3-step flow (form → loading → success) dengan numbered sections, sticky submit footer
- **Wishlist sheet** + recently viewed products
- **Order tracking** + order history dialogs

### 📄 Page Sections
- **About** — brand story dengan inline micro-stats, values cards, stats cards
- **Testimonials** — 6 testimonial cards dengan initial avatars (no emoji), rating-aware accent bars
- **FAQ** — accordion dengan 4 category groups (Pemesanan/Pengiriman/Pembayaran/Produk), color-coded icons
- **Contact** — form + 4 color-coded info cards (Phone/Email/Address/Hours) + Tips card
- **Footer** — newsletter strip, main grid, payment methods, trust badges, bottom bar

### 🎨 Design System
- **Modern minimalist** — photo-forward cards, icon-only `+` buttons, gradient + ring + shadow + accent bar
- **Consistent depth pattern** across 55+ cards (page sections + modals + sheets + forms)
- **Color-coded sections** — green (primary), cyan (pengiriman), amber (pembayaran), orange (produk/discount)
- **Responsive** — mobile-first, 2-col grid mobile, 5-col desktop
- **Dark mode** support via next-themes
- **PWA** — service worker + install prompt + manifest

### ⚙️ Backend & Integrasi
- **Prisma ORM** + SQLite — products, categories, testimonials, FAQs, site settings
- **ERPNext REST API client** dengan auto-fallback to mock data
- **NextAuth.js** session management
- **Admin overlay** (Ctrl+Shift+A) — edit all content live, no rebuild needed
- **API routes** — `/api/products`, `/api/categories`, `/api/checkout`, `/api/contact`, `/api/admin/*`

## 🚀 Quick Start

```bash
# Install dependencies
bun install

# Setup database
bun run db:push

# Start dev server
bun run dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser.

### Environment Variables

Copy `.env.example` ke `.env` dan sesuaikan:

```bash
cp .env.example .env
```

```env
DATABASE_URL=file:/home/z/my-project/db/custom.db
# Optional: ERPNext integration
# ERPNEXT_URL=https://your-erpnext.com
# ERPNEXT_API_KEY=your-key
# ERPNEXT_API_SECRET=your-secret
```

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 4 + shadcn/ui (New York) |
| Database | Prisma ORM + SQLite |
| Auth | NextAuth.js v4 |
| State | Zustand (cart) + TanStack Query (server) |
| Animation | Framer Motion |
| Icons | Lucide React |
| PWA | next-pwa |

## 📁 Struktur Project

```
src/
├── app/                    # App Router pages + API routes
│   ├── page.tsx           # Home (server component)
│   ├── home-client.tsx    # Home (client component)
│   └── api/               # API routes
├── components/
│   ├── grocery/           # Storefront components
│   ├── admin/             # Admin overlay
│   └── ui/                # shadcn/ui primitives
├── lib/                   # Utilities, stores, ERPNext client
├── hooks/                 # Custom React hooks
└── types/                 # TypeScript types

prisma/
└── schema.prisma          # Database schema

public/
├── products/              # Product images
└── hero-produce-full.png  # Hero image
```

## 🎯 Admin Access

Tekan **Ctrl+Shift+A** atau klik tombol settings (⚙️) di footer untuk membuka admin overlay. Edit semua konten (hero, about, FAQ, testimonials, products) secara live — perubahan langsung tersimpan ke database.

## 📝 License

MIT — bebas digunakan untuk portfolio, belajar, atau production.

---

Dibuat dengan 🌱 oleh SayurLogi team
