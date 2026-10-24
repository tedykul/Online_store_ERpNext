"use client";

import { ShoppingCart, Leaf, Search, MapPin, Phone, Heart } from "lucide-react";
import { useCartStore } from "@/lib/store/cart";
import { useWishlistStore } from "@/lib/store/wishlist";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/theme-toggle";
import { MainNav, MobileNav } from "./main-nav";

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  /** Brand name from DB (defaults to "SayurBox") */
  brandName?: string;
}

export function Header({ searchQuery, onSearchChange, brandName = "SayurBox" }: HeaderProps) {
  const totalItems = useCartStore((s) => s.getTotalItems());
  const openCart = useCartStore((s) => s.openCart);
  const wishlistCount = useWishlistStore((s) => s.getCount());
  const openWishlist = useWishlistStore((s) => s.openWishlist);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/80 backdrop-blur-lg supports-[backdrop-filter]:bg-background/60">
      {/* Top bar */}
      <div className="hidden md:block border-b border-border/40 bg-primary/5">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-1.5 text-xs text-muted-foreground">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 text-primary" />
              Antar ke seluruh kota — Gratis ongkir min. Rp50.000
            </span>
            <span className="flex items-center gap-1.5">
              <Phone className="h-3.5 w-3.5 text-primary" />
              0800-1234-5678
            </span>
          </div>
          <span className="text-primary font-medium">🌱 Petani Lokal • 100% Segar</span>
        </div>
      </div>

      {/* Main header */}
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3 md:gap-6">
        {/* Logo */}
        <a href="#beranda" className="flex shrink-0 items-center gap-2" aria-label={`${brandName} beranda`}>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
            <Leaf className="h-5 w-5" />
          </div>
          <div className="hidden sm:flex flex-col leading-none">
            <span className="text-lg font-bold tracking-tight text-foreground">{brandName}</span>
            <span className="text-[10px] text-muted-foreground">Sayur & Buah Segar</span>
          </div>
        </a>

        {/* Desktop navigation */}
        <MainNav />

        {/* Search bar (flex-1 so it grows) */}
        <div className="relative flex-1 max-w-xl ml-auto">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Cari sayur, buah, atau paket hemat..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="h-10 pl-9 pr-4 rounded-full bg-secondary/50 border-secondary focus-visible:bg-background"
            aria-label="Cari produk"
          />
        </div>

        {/* Right actions: theme toggle + wishlist + cart (desktop) + hamburger (mobile) */}
        <div className="flex items-center gap-1.5">
          <ThemeToggle />

          {/* Wishlist button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={openWishlist}
            className="relative h-10 w-10 rounded-full hover:bg-accent transition-colors"
            aria-label={`Wishlist${wishlistCount > 0 ? ` (${wishlistCount} item)` : ""}`}
            title="Wishlist favorit"
          >
            <Heart className={`h-5 w-5 ${wishlistCount > 0 ? "fill-rose-500 text-rose-500" : "text-foreground"}`} />
            {wishlistCount > 0 && (
              <Badge
                variant="secondary"
                className="absolute -top-1 -right-1 h-4 min-w-4 px-1 flex items-center justify-center rounded-full bg-rose-500 text-white text-[9px] font-bold"
              >
                {wishlistCount}
              </Badge>
            )}
          </Button>

          <Button
            onClick={openCart}
            className="relative h-10 rounded-full px-4 md:px-5 shadow-sm hover:shadow-md transition-shadow"
            size="default"
            aria-label={`Keranjang belanja${totalItems > 0 ? ` (${totalItems} item)` : ""}`}
          >
            <ShoppingCart className="h-4 w-4 md:mr-2" />
            <span className="hidden md:inline font-medium">Keranjang</span>
            {totalItems > 0 && (
              <Badge
                variant="destructive"
                className="absolute -top-1.5 -right-1.5 h-5 min-w-5 px-1.5 flex items-center justify-center rounded-full text-[10px] font-bold"
              >
                {totalItems}
              </Badge>
            )}
          </Button>
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
