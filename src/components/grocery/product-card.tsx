"use client";

import { motion } from "framer-motion";
import { Plus, Minus, Leaf, Star, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCartStore } from "@/lib/store/cart";
import { formatIDR } from "@/lib/mock-data";
import type { Product } from "@/types/grocery";
import { cn } from "@/lib/utils";
import { WishlistButton } from "./wishlist-button";
import { ProductImage } from "./product-image";

interface ProductCardProps {
  product: Product;
  index?: number;
  /** Called when user clicks the card (not the action buttons). Optional for backward compat. */
  onOpenDetail?: (product: Product) => void;
}

export function ProductCard({ product, index = 0, onOpenDetail }: ProductCardProps) {
  const addItem = useCartStore((s) => s.addItem);
  const items = useCartStore((s) => s.items);
  const updateQty = useCartStore((s) => s.updateQty);

  const inCart = items.find((i) => i.product.id === product.id);
  const outOfStock = product.stock <= 0;
  const discount =
    product.oldPrice && product.oldPrice > product.price
      ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
      : 0;
  const rating = product.rating ?? 0;

  // Clicking the card body opens detail (unless on action button).
  const handleCardClick = () => onOpenDetail?.(product);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.35, delay: Math.min(index * 0.04, 0.4) }}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-border/60 bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-primary/30"
    >
      {/* Image area */}
      <div
        role={onOpenDetail ? "button" : undefined}
        tabIndex={onOpenDetail ? 0 : undefined}
        onClick={handleCardClick}
        onKeyDown={(e) => {
          if (onOpenDetail && (e.key === "Enter" || e.key === " ")) {
            e.preventDefault();
            handleCardClick();
          }
        }}
        className={`relative aspect-square overflow-hidden bg-gradient-to-br from-secondary/40 to-secondary/10 ${onOpenDetail ? "cursor-pointer" : "cursor-default"}`}
        aria-label={`Lihat detail ${product.name}`}
      >
        {/* Badges — bigger + bolder */}
        <div className="absolute left-2.5 top-2.5 z-10 flex flex-col gap-1.5">
          {product.onSale && discount > 0 && (
            <Badge variant="destructive" className="rounded-lg px-2.5 py-1 text-xs font-bold shadow-md">
              -{discount}%
            </Badge>
          )}
          {product.organic && (
            <Badge className="rounded-lg bg-primary text-primary-foreground px-2.5 py-1 text-xs font-bold shadow-md">
              <Leaf className="h-3 w-3 mr-0.5" /> Organik
            </Badge>
          )}
        </div>

        <WishlistButton product={product} size="sm" variant="overlay" />

        {onOpenDetail && !outOfStock && (
          <div className="absolute bottom-2.5 left-2.5 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-background/80 text-foreground opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:scale-110 backdrop-blur-sm shadow-md">
            <Eye className="h-4 w-4" />
          </div>
        )}

        <ProductImage
          product={product}
          emojiClassName="text-7xl transition-transform duration-500 group-hover:scale-110"
          animateOnHover
          className="aspect-square"
        />

        {outOfStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/70 backdrop-blur-sm">
            <span className="rounded-full bg-destructive px-4 py-1.5 text-xs font-bold text-destructive-foreground shadow-lg">
              Stok Habis
            </span>
          </div>
        )}
        {product.stock > 0 && product.stock <= 10 && (
          <div className="absolute bottom-2.5 right-2.5 z-10">
            <Badge variant="secondary" className="rounded-lg bg-amber-500/90 text-white text-[10px] font-bold shadow-md px-2 py-0.5">
              Sisa {product.stock}
            </Badge>
          </div>
        )}
      </div>

      {/* Body — clean layout, no description */}
      <div
        onClick={handleCardClick}
        role={onOpenDetail ? "button" : undefined}
        tabIndex={onOpenDetail ? 0 : undefined}
        onKeyDown={(e) => {
          if (onOpenDetail && (e.key === "Enter" || e.key === " ")) {
            e.preventDefault();
            handleCardClick();
          }
        }}
        className="flex flex-1 cursor-pointer flex-col gap-2 p-4"
      >
        <h3 className="line-clamp-1 text-sm font-bold leading-tight tracking-tight">{product.name}</h3>

        {/* Rating (compact) */}
        {rating > 0 && (
          <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
            <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
            <span className="font-semibold text-foreground">{rating.toFixed(1)}</span>
            <span>· {product.reviewCount ?? 0} ulasan</span>
          </div>
        )}

        <div className="mt-auto flex items-end justify-between gap-2 pt-1">
          <div className="flex flex-col">
            {product.oldPrice && (
              <span className="text-[11px] text-muted-foreground line-through">
                {formatIDR(product.oldPrice)}
              </span>
            )}
            <div className="flex items-baseline gap-1">
              <span className="text-lg font-extrabold text-foreground tracking-tight">{formatIDR(product.price)}</span>
              <span className="text-[10px] text-muted-foreground">/{product.unit}</span>
            </div>
          </div>

          <div onClick={(e) => e.stopPropagation()}>
            {outOfStock ? (
              <Button disabled size="sm" variant="secondary" className="h-8 rounded-lg text-xs">
                Habis
              </Button>
            ) : inCart ? (
              <QtyStepper
                qty={inCart.quantity}
                max={product.stock}
                onDec={() => updateQty(product.id, inCart.quantity - 1)}
                onInc={() => updateQty(product.id, inCart.quantity + 1)}
              />
            ) : (
              <Button
                size="sm"
                onClick={() => addItem(product, 1)}
                className="h-9 rounded-lg px-3.5 shadow-sm transition-all duration-200 hover:shadow-md hover:scale-105 active:scale-95"
              >
                <Plus className="h-3.5 w-3.5" />
                <span className="ml-1 text-xs font-semibold">Tambah</span>
              </Button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function QtyStepper({
  qty,
  max,
  onDec,
  onInc,
}: {
  qty: number;
  max: number;
  onDec: () => void;
  onInc: () => void;
}) {
  return (
    <div className="flex items-center gap-1 rounded-lg border border-primary bg-primary/5 p-0.5">
      <button
        onClick={onDec}
        className="flex h-7 w-7 items-center justify-center rounded-md text-primary transition-colors hover:bg-primary/10"
        aria-label="Kurangi"
      >
        <Minus className="h-3.5 w-3.5" />
      </button>
      <span className="min-w-6 text-center text-sm font-bold text-primary tabular-nums">{qty}</span>
      <button
        onClick={onInc}
        disabled={qty >= max}
        className={cn(
          "flex h-7 w-7 items-center justify-center rounded-md text-primary transition-colors hover:bg-primary/10",
          qty >= max && "opacity-40 cursor-not-allowed"
        )}
        aria-label="Tambah"
      >
        <Plus className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
