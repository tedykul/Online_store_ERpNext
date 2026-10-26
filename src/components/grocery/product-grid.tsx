"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Loader2, ChevronDown } from "lucide-react";
import { ProductCard } from "./product-card";
import type { Product } from "@/types/grocery";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

interface ProductGridProps {
  products: Product[];
  loading: boolean;
  source: "erpnext" | "db" | "mock" | null;
  /** Forwarded to each ProductCard. Optional for backward compat. */
  onOpenDetail?: (product: Product) => void;
}

const INITIAL_COUNT = 8;
const LOAD_MORE_COUNT = 8;

export function ProductGrid({ products, loading, source, onOpenDetail }: ProductGridProps) {
  const [visibleCount, setVisibleCount] = useState(INITIAL_COUNT);
  // Track the previous product list key so we can reset pagination
  // when category/search/filter changes — using the documented
  // "adjusting state during render" pattern (no setState in effect).
  const currentKey = useMemo(() => products.map((p) => p.id).join(","), [products]);
  const [prevKey, setPrevKey] = useState(currentKey);
  if (currentKey !== prevKey) {
    setPrevKey(currentKey);
    setVisibleCount(INITIAL_COUNT);
  }

  const visibleProducts = products.slice(0, visibleCount);
  const hasMore = visibleCount < products.length;
  const remaining = products.length - visibleCount;

  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-2.5 sm:gap-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="flex flex-col rounded-2xl bg-card">
            <Skeleton className="aspect-square w-full rounded-2xl" />
            <div className="flex flex-col gap-1.5 p-2.5">
              <Skeleton className="h-3.5 w-3/4" />
              <Skeleton className="h-3 w-full" />
              <div className="flex justify-between pt-1">
                <Skeleton className="h-5 w-14" />
                <Skeleton className="h-8 w-8 rounded-full" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-border py-16 text-center">
        <span className="text-4xl">🔍</span>
        <h3 className="text-base font-semibold">Produk tidak ditemukan</h3>
        <p className="text-sm text-muted-foreground max-w-sm">
          Coba ubah kata kunci pencarian atau pilih kategori lain.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-xs">
        <span className="text-foreground/80">
          Menampilkan <span className="font-bold text-foreground">{visibleProducts.length}</span> dari{" "}
          <span className="font-bold text-foreground">{products.length}</span> produk
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2.5 sm:gap-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {visibleProducts.map((p, i) => (
          <ProductCard key={p.id} product={p} index={i} onOpenDetail={onOpenDetail} />
        ))}
      </div>

      {/* Load more — minimal, centered */}
      {hasMore && (
        <div className="flex flex-col items-center gap-2 pt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setVisibleCount((c) => c + LOAD_MORE_COUNT)}
            className="h-9 rounded-full px-5 text-xs font-medium border-border hover:bg-accent"
          >
            <ChevronDown className="h-3.5 w-3.5 mr-1" />
            Muat {Math.min(LOAD_MORE_COUNT, remaining)} produk lagi
          </Button>
          <span className="text-[10px] text-muted-foreground">
            {remaining} produk tersisa
          </span>
        </div>
      )}
    </div>
  );
}
