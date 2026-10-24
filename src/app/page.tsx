"use client";

import { useEffect, useState, useMemo, useRef } from "react";
import { Header } from "@/components/grocery/header";
import { Hero } from "@/components/grocery/hero";
import { CategoryTabs } from "@/components/grocery/category-tabs";
import { ProductGrid } from "@/components/grocery/product-grid";
import { CartSheet } from "@/components/grocery/cart-sheet";
import { CheckoutDialog } from "@/components/grocery/checkout-dialog";
import { Footer } from "@/components/grocery/footer";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sparkles } from "lucide-react";
import type { Product, Category } from "@/types/grocery";

type SortKey = "popular" | "price-asc" | "price-desc" | "name";

export default function HomePage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [source, setSource] = useState<"erpnext" | "mock" | null>(null);

  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sort, setSort] = useState<SortKey>("popular");

  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const productSectionRef = useRef<HTMLDivElement>(null);

  // Fetch categories once
  useEffect(() => {
    fetch("/api/categories")
      .then((r) => r.json())
      .then((data) => {
        setCategories(data.categories || []);
      })
      .catch(console.error);
  }, []);

  // Fetch products when category changes
  useEffect(() => {
    let cancelled = false;
    const url = activeCategory
      ? `/api/products?category=${encodeURIComponent(activeCategory)}`
      : "/api/products";
    fetch(url)
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return;
        setProducts(data.products || []);
        setSource(data.source || null);
      })
      .catch(console.error)
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [activeCategory]);

  const handleCategoryChange = (id: string | null) => {
    setActiveCategory(id);
    setLoading(true);
  };

  // Filter + sort client-side (search + sort)
  const filteredProducts = useMemo(() => {
    let list = products;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      );
    }
    const sorted = [...list];
    switch (sort) {
      case "price-asc":
        sorted.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        sorted.sort((a, b) => b.price - a.price);
        break;
      case "name":
        sorted.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        // popular: onSale first, then by stock desc
        sorted.sort((a, b) => {
          if (a.onSale && !b.onSale) return -1;
          if (!a.onSale && b.onSale) return 1;
          return b.stock - a.stock;
        });
    }
    return sorted;
  }, [products, searchQuery, sort]);

  const scrollToProducts = () => {
    productSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header searchQuery={searchQuery} onSearchChange={setSearchQuery} />

      <main className="flex-1">
        <Hero onShopNow={scrollToProducts} />

        {/* Promo banner */}
        <div className="border-b border-border/40 bg-gradient-to-r from-primary/10 via-emerald-500/10 to-amber-400/10">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-2 px-4 py-2.5 text-center text-sm">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="font-medium">Promo Akhir Pekan!</span>
            <span className="text-muted-foreground">Diskon hingga 25% untuk semua sayuran organik. Berlaku sampai akhir minggu.</span>
          </div>
        </div>

        {/* Products section */}
        <section
          id="belanja"
          ref={productSectionRef}
          className="mx-auto max-w-7xl px-4 py-8 md:py-12 scroll-mt-24"
        >
          <div className="mb-6 flex flex-col gap-4">
            <div className="flex items-end justify-between gap-3">
              <div>
                <h2 className="text-2xl font-bold tracking-tight md:text-3xl">Belanja Pilihan</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Pilih kategori atau cari produk favoritmu
                </p>
              </div>
              {/* Sort dropdown */}
              <Select value={sort} onValueChange={(v) => setSort(v as SortKey)}>
                <SelectTrigger className="w-[160px] h-9 rounded-full text-sm">
                  <SelectValue placeholder="Urutkan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="popular">Terpopuler</SelectItem>
                  <SelectItem value="price-asc">Harga Terendah</SelectItem>
                  <SelectItem value="price-desc">Harga Tertinggi</SelectItem>
                  <SelectItem value="name">Nama A-Z</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <CategoryTabs
              categories={categories}
              active={activeCategory}
              onChange={handleCategoryChange}
            />
          </div>

          <ProductGrid products={filteredProducts} loading={loading} source={source} />
        </section>
      </main>

      <Footer />

      {/* Floating UI */}
      <CartSheet onCheckout={() => setCheckoutOpen(true)} />
      <CheckoutDialog open={checkoutOpen} onOpenChange={setCheckoutOpen} />
    </div>
  );
}
