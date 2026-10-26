"use client";

import { ProductCard } from "./product-card";
import type { Product } from "@/types/grocery";
import { Skeleton } from "@/components/ui/skeleton";

interface ProductGridProps {
  products: Product[];
  loading: boolean;
  source: "erpnext" | "db" | "mock" | null;
  /** Forwarded to each ProductCard. Optional for backward compat. */
  onOpenDetail?: (product: Product) => void;
}

export function ProductGrid({ products, loading, source, onOpenDetail }: ProductGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {Array.from({ length: 10 }).map((_, i) => (
          <div
            key={i}
            className="flex flex-col overflow-hidden rounded-2xl border border-border/60 bg-card"
          >
            <Skeleton className="aspect-square w-full rounded-none" />
            <div className="flex flex-col gap-2 p-3">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-2/3" />
              <div className="flex justify-between pt-2">
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-8 w-16 rounded-lg" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-border py-20 text-center">
        <span className="text-5xl">🔍</span>
        <h3 className="text-lg font-semibold">Produk tidak ditemukan</h3>
        <p className="text-sm text-muted-foreground max-w-sm">
          Coba ubah kata kunci pencarian atau pilih kategori lain.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>
          Menampilkan <span className="font-semibold text-foreground">{products.length}</span> produk
        </span>
        {source && (
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-medium ${
              source === "erpnext" || source === "db"
                ? "bg-emerald-100 text-emerald-700"
                : "bg-amber-100 text-amber-700"
            }`}
          >
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                source === "erpnext" || source === "db" ? "bg-emerald-500" : "bg-amber-500"
              } animate-pulse`}
            />
            {source === "erpnext"
              ? "Live ERPNext"
              : source === "db"
                ? "Database"
                : "Mode Mock (ERPNext belum konek)"}
          </span>
        )}
      </div>
      <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {products.map((p, i) => (
          <ProductCard key={p.id} product={p} index={i} onOpenDetail={onOpenDetail} />
        ))}
      </div>
    </div>
  );
}
