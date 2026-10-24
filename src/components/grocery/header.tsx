"use client";

import { ShoppingCart, Leaf, Search, MapPin, Phone } from "lucide-react";
import { useCartStore } from "@/lib/store/cart";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export function Header({ searchQuery, onSearchChange }: HeaderProps) {
  const totalItems = useCartStore((s) => s.getTotalItems());
  const openCart = useCartStore((s) => s.openCart);

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
        <a href="#" className="flex shrink-0 items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
            <Leaf className="h-5 w-5" />
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-lg font-bold tracking-tight text-foreground">SayurBox</span>
            <span className="text-[10px] text-muted-foreground">Sayur & Buah Segar</span>
          </div>
        </a>

        {/* Search bar */}
        <div className="relative flex-1 max-w-xl">
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

        {/* Cart button */}
        <Button
          onClick={openCart}
          className="relative h-10 rounded-full px-4 md:px-5 shadow-sm hover:shadow-md transition-shadow"
          size="default"
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
      </div>
    </header>
  );
}
