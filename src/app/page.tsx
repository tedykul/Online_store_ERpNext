"use client";

import { useEffect, useState, useMemo, useRef } from "react";
import { Header } from "@/components/grocery/header";
import { Hero } from "@/components/grocery/hero";
import { CategoryTabs } from "@/components/grocery/category-tabs";
import { ProductGrid } from "@/components/grocery/product-grid";
import { CartSheet } from "@/components/grocery/cart-sheet";
import { CheckoutDialog } from "@/components/grocery/checkout-dialog";
import { ProductDetailDialog } from "@/components/grocery/product-detail-dialog";
import { WishlistSheet } from "@/components/grocery/wishlist-sheet";
import { AdvancedFilter, DEFAULT_FILTER, applyFilter, type FilterState } from "@/components/grocery/advanced-filter";
import { Footer } from "@/components/grocery/footer";
import { AboutSection } from "@/components/grocery/about-section";
import { TestimonialsSection } from "@/components/grocery/testimonials-section";
import { FaqSection } from "@/components/grocery/faq-section";
import { ContactSection } from "@/components/grocery/contact-section";
import { BackToTop } from "@/components/grocery/back-to-top";
import { PromoBanner } from "@/components/grocery/promo-banner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
  const [filter, setFilter] = useState<FilterState>(DEFAULT_FILTER);

  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [detailProduct, setDetailProduct] = useState<Product | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const productSectionRef = useRef<HTMLDivElement>(null);

  const handleOpenDetail = (product: Product) => {
    setDetailProduct(product);
    setDetailOpen(true);
  };

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

  // Filter + sort client-side (search + advanced filter + sort)
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
    // Apply advanced filter (price range, organic, on-sale, tags)
    list = applyFilter(list, filter);
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
  }, [products, searchQuery, sort, filter]);

  const scrollToProducts = () => {
    productSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header searchQuery={searchQuery} onSearchChange={setSearchQuery} />

      <main className="flex-1">
        <Hero onShopNow={scrollToProducts} />

        {/* Promo banner (dismissible, persists via localStorage) */}
        <PromoBanner />

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
              {/* Sort dropdown + Advanced filter */}
              <div className="flex items-center gap-2">
                <AdvancedFilter products={products} filter={filter} onChange={setFilter} />
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
            </div>

            <CategoryTabs
              categories={categories}
              active={activeCategory}
              onChange={handleCategoryChange}
            />
          </div>

          <ProductGrid
            products={filteredProducts}
            loading={loading}
            source={source}
            onOpenDetail={handleOpenDetail}
          />
        </section>

        {/* About section */}
        <AboutSection />

        {/* Testimonials section */}
        <TestimonialsSection />

        {/* FAQ section */}
        <FaqSection />

        {/* Contact section */}
        <ContactSection />
      </main>

      <Footer />

      {/* Floating UI */}
      <CartSheet onCheckout={() => setCheckoutOpen(true)} />
      <CheckoutDialog open={checkoutOpen} onOpenChange={setCheckoutOpen} />
      <ProductDetailDialog
        product={detailProduct}
        open={detailOpen}
        onOpenChange={setDetailOpen}
      />
      <WishlistSheet onProductClick={handleOpenDetail} />
      <BackToTop />
    </div>
  );
}
