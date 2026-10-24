"use client";

import { useState, useCallback } from "react";
import { Menu, X, Leaf, ShoppingCart, Sun, Moon, Heart } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/lib/store/cart";
import { useWishlistStore } from "@/lib/store/wishlist";
import { useTheme } from "next-themes";
import { ThemeToggle } from "@/components/theme-toggle";

/**
 * Navigation items — anchor links to sections on the same page.
 * Convention: id must match the `id` attribute on the target <section>.
 */
export const NAV_ITEMS: { id: string; label: string; emoji: string }[] = [
  { id: "beranda", label: "Beranda", emoji: "🏠" },
  { id: "belanja", label: "Belanja", emoji: "🛒" },
  { id: "tentang", label: "Tentang", emoji: "🌱" },
  { id: "faq", label: "FAQ", emoji: "❓" },
  { id: "kontak", label: "Kontak", emoji: "✉️" },
];

interface MainNavProps {
  /** Called after a nav item is clicked (e.g., to close mobile menu, clear search). */
  onNavigate?: (sectionId: string) => void;
}

/**
 * Desktop navigation — horizontal links, hidden on mobile.
 * Uses anchor links (#id) for smooth scroll, with scroll-margin-top
 * handled by `scroll-mt-24` on each target section.
 */
export function MainNav({ onNavigate }: MainNavProps) {
  const handleClick = useCallback(
    (id: string) => (e: React.MouseEvent) => {
      e.preventDefault();
      const el = document.getElementById(id);
      el?.scrollIntoView({ behavior: "smooth", block: "start" });
      onNavigate?.(id);
    },
    [onNavigate]
  );

  return (
    <nav
      aria-label="Navigasi utama"
      className="hidden md:flex items-center gap-1"
    >
      {NAV_ITEMS.map((item) => (
        <a
          key={item.id}
          href={`#${item.id}`}
          onClick={handleClick(item.id)}
          className="rounded-full px-3.5 py-2 text-sm font-medium text-foreground/80 transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {item.label}
        </a>
      ))}
    </nav>
  );
}

/**
 * Mobile hamburger menu — opens a Sheet (right-side drawer) with vertical nav.
 * Sheet auto-closes on selection via SheetClose.
 */
export function MobileNav({ onNavigate }: MainNavProps) {
  const [open, setOpen] = useState(false);
  const totalItems = useCartStore((s) => s.getTotalItems());
  const openCart = useCartStore((s) => s.openCart);
  const wishlistCount = useWishlistStore((s) => s.getCount());
  const openWishlist = useWishlistStore((s) => s.openWishlist);

  const handleNavClick = (id: string) => {
    setOpen(false);
    // Defer scroll until sheet close animation begins
    setTimeout(() => {
      const el = document.getElementById(id);
      el?.scrollIntoView({ behavior: "smooth", block: "start" });
      onNavigate?.(id);
    }, 100);
  };

  const handleCartClick = () => {
    setOpen(false);
    setTimeout(() => openCart(), 100);
  };

  const handleWishlistClick = () => {
    setOpen(false);
    setTimeout(() => openWishlist(), 100);
  };

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden h-10 w-10 rounded-full"
        onClick={() => setOpen(true)}
        aria-label="Buka menu navigasi"
        aria-expanded={open}
      >
        <Menu className="h-5 w-5" />
      </Button>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="right" className="w-full sm:max-w-sm p-0 flex flex-col">
          <SheetHeader className="border-b border-border/60 px-5 py-4">
            <SheetTitle className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Leaf className="h-4 w-4" />
              </div>
              <span className="text-base font-bold">SayurBox</span>
              <SheetClose
                className="ml-auto rounded-full p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
                aria-label="Tutup menu"
              >
                <X className="h-5 w-5" />
              </SheetClose>
            </SheetTitle>
          </SheetHeader>

          <nav aria-label="Navigasi mobile" className="flex-1 overflow-y-auto p-3">
            <ul className="space-y-1">
              {NAV_ITEMS.map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => handleNavClick(item.id)}
                    className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium text-foreground transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <span className="text-xl" aria-hidden="true">{item.emoji}</span>
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>

            <div className="my-3 h-px bg-border" />

            {/* Quick actions */}
            <div className="space-y-1">
              <button
                onClick={handleCartClick}
                className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium text-foreground transition-colors hover:bg-accent"
              >
                <ShoppingCart className="h-5 w-5 text-primary" />
                Keranjang
                {totalItems > 0 && (
                  <span className="ml-auto rounded-full bg-primary px-2 py-0.5 text-xs font-bold text-primary-foreground">
                    {totalItems}
                  </span>
                )}
              </button>

              <button
                onClick={handleWishlistClick}
                className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium text-foreground transition-colors hover:bg-accent"
              >
                <Heart className={`h-5 w-5 ${wishlistCount > 0 ? "fill-rose-500 text-rose-500" : "text-rose-500"}`} />
                Wishlist
                {wishlistCount > 0 && (
                  <span className="ml-auto rounded-full bg-rose-500 px-2 py-0.5 text-xs font-bold text-white">
                    {wishlistCount}
                  </span>
                )}
              </button>

              <div className="flex items-center gap-3 rounded-xl px-4 py-3">
                <ThemeToggle />
                <span className="text-sm font-medium text-foreground">Ganti Tema</span>
              </div>
            </div>
          </nav>

          <div className="border-t border-border/60 px-5 py-4 text-xs text-muted-foreground">
            <p className="font-medium text-foreground">SayurBox</p>
            <p className="mt-0.5">Sayur & buah segar dari petani lokal 🌱</p>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
