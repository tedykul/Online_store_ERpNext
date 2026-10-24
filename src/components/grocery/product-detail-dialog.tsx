"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Star,
  Leaf,
  MapPin,
  Package,
  Truck,
  ShieldCheck,
  Plus,
  Minus,
  ShoppingCart,
  CheckCircle2,
  Snowflake,
  Sparkles,
} from "lucide-react";
import { motion } from "framer-motion";
import { useCartStore } from "@/lib/store/cart";
import { formatIDR } from "@/lib/mock-data";
import type { Product } from "@/types/grocery";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { ProductImage } from "./product-image";

interface ProductDetailDialogProps {
  product: Product | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/**
 * Wrapper that mounts a fresh inner component (keyed by product id) so the
 * qty state resets automatically when the user opens a different product —
 * no useEffect needed.
 */
export function ProductDetailDialog({
  product,
  open,
  onOpenChange,
}: ProductDetailDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[92vh] overflow-hidden p-0 sm:max-w-3xl">
        <DialogDescription className="sr-only">
          Detail produk SayurBox
        </DialogDescription>
        {product ? (
          <ProductDetailContent
            key={product.id}
            product={product}
            onOpenChange={onOpenChange}
          />
        ) : null}
      </DialogContent>
    </Dialog>
  );
}

function ProductDetailContent({
  product,
  onOpenChange,
}: {
  product: Product;
  onOpenChange: (open: boolean) => void;
}) {
  const [qty, setQty] = useState(1);

  const addItem = useCartStore((s) => s.addItem);
  const items = useCartStore((s) => s.items);
  const updateQty = useCartStore((s) => s.updateQty);

  const outOfStock = product.stock <= 0;
  const discount =
    product.oldPrice && product.oldPrice > product.price
      ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
      : 0;

  const inCart = items.find((i) => i.product.id === product.id);
  const rating = product.rating ?? 4.5;
  const reviewCount = product.reviewCount ?? 0;

  const handleAddToCart = () => {
    if (inCart) {
      const newQty = Math.min(inCart.quantity + qty, product.stock);
      updateQty(product.id, newQty);
      toast.success(`Jumlah ${product.name} di keranjang: ${newQty}`);
    } else {
      addItem(product, qty);
      toast.success(`${qty} × ${product.name} ditambahkan ke keranjang`);
    }
    onOpenChange(false);
  };

  return (
    <div className="grid max-h-[92vh] grid-cols-1 overflow-hidden md:grid-cols-2">
      {/* Left: visual */}
      <div className="relative hidden md:block bg-gradient-to-br from-secondary/40 via-secondary/20 to-background border-r border-border/40">
        <div className="flex h-full min-h-[400px] items-center justify-center p-8">
          <motion.div
            key={product.id}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="h-full w-full"
          >
            <ProductImage
              product={product}
              emojiClassName="text-[200px]"
              className="h-full min-h-[360px] rounded-2xl"
            />
          </motion.div>
        </div>
        <div className="absolute left-4 top-4 flex flex-col gap-1.5">
          {product.onSale && discount > 0 && (
            <Badge variant="destructive" className="text-xs font-bold shadow-sm">
              -{discount}%
            </Badge>
          )}
          {product.organic && (
            <Badge className="bg-primary text-primary-foreground text-xs font-bold shadow-sm">
              <Leaf className="h-3 w-3 mr-0.5" /> Organik
            </Badge>
          )}
        </div>
      </div>

      {/* Right: info + actions */}
      <div className="flex flex-col max-h-[92vh] md:max-h-[88vh]">
        {/* Mobile visual header */}
        <div className="md:hidden relative bg-gradient-to-br from-secondary/40 to-background p-6 flex items-center justify-center">
          <div className="h-40 w-40">
            <ProductImage
              product={product}
              emojiClassName="text-7xl"
              className="h-full rounded-2xl"
            />
          </div>
          <div className="absolute left-3 top-3 flex flex-col gap-1">
            {product.onSale && discount > 0 && (
              <Badge variant="destructive" className="text-[10px] font-bold">
                -{discount}%
              </Badge>
            )}
            {product.organic && (
              <Badge className="bg-primary text-primary-foreground text-[10px] font-bold">
                <Leaf className="h-2.5 w-2.5 mr-0.5" /> Organik
              </Badge>
            )}
          </div>
        </div>

        <DialogHeader className="px-6 pt-6 pb-2 shrink-0">
          <DialogTitle className="text-2xl font-bold leading-tight">
            {product.name}
          </DialogTitle>
          <div className="flex flex-wrap items-center gap-3 text-sm">
            <div className="flex items-center gap-1">
              <div className="flex" aria-label={`Rating ${rating.toFixed(1)} dari 5`}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      "h-4 w-4",
                      i < Math.round(rating)
                        ? "fill-amber-400 text-amber-400"
                        : "fill-muted text-muted"
                    )}
                  />
                ))}
              </div>
              <span className="font-semibold">{rating.toFixed(1)}</span>
              <span className="text-muted-foreground">({reviewCount} ulasan)</span>
            </div>
            <Separator orientation="vertical" className="h-4" />
            <span className="flex items-center gap-1 text-muted-foreground">
              <Package className="h-3.5 w-3.5" />
              Stok: {product.stock} {product.unit}
            </span>
          </div>
        </DialogHeader>

        <ScrollArea className="flex-1 scrollbar-grocery px-6">
          <div className="space-y-5 pb-4">
            {/* Price */}
            <div className="flex items-end gap-3">
              <div className="flex flex-col">
                {product.oldPrice && (
                  <span className="text-sm text-muted-foreground line-through">
                    {formatIDR(product.oldPrice)}
                  </span>
                )}
                <div className="flex items-baseline gap-1.5">
                  <span className="text-3xl font-extrabold text-primary">
                    {formatIDR(product.price)}
                  </span>
                  <span className="text-sm text-muted-foreground">/{product.unit}</span>
                </div>
              </div>
              {discount > 0 && (
                <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 mb-1">
                  Hemat {formatIDR((product.oldPrice ?? 0) - product.price)}
                </Badge>
              )}
            </div>

            {/* Tags */}
            {product.tags && product.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {product.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="rounded-full text-xs capitalize">
                    #{tag}
                  </Badge>
                ))}
              </div>
            )}

            {/* Long description */}
            <section>
              <h3 className="mb-1.5 text-sm font-semibold">Deskripsi</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {product.longDescription || product.description}
              </p>
            </section>

            {/* Benefits */}
            {product.benefits && product.benefits.length > 0 && (
              <section>
                <h3 className="mb-2 text-sm font-semibold flex items-center gap-1.5">
                  <Sparkles className="h-4 w-4 text-primary" />
                  Manfaat & Kandungan
                </h3>
                <ul className="space-y-1.5">
                  {product.benefits.map((benefit, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <CheckCircle2 className="h-4 w-4 mt-0.5 shrink-0 text-primary" />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Info grid: origin, storage, category */}
            <section className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
              <InfoRow
                icon={<MapPin className="h-4 w-4" />}
                label="Asal"
                value={product.origin || "Petani mitra SayurBox"}
              />
              <InfoRow
                icon={<Package className="h-4 w-4" />}
                label="Kategori"
                value={product.category}
              />
              <InfoRow
                icon={<Snowflake className="h-4 w-4" />}
                label="Penyimpanan"
                value={product.storageTip || "Simpan di tempat sejuk."}
                full
              />
            </section>

            {/* Trust badges */}
            <section className="grid grid-cols-3 gap-2 rounded-xl border border-border/60 bg-secondary/30 p-3">
              <TrustBadge icon={<Truck className="h-4 w-4" />} label="Antar 2 jam" />
              <TrustBadge icon={<ShieldCheck className="h-4 w-4" />} label="Garansi segar" />
              <TrustBadge icon={<Leaf className="h-4 w-4" />} label="Petani lokal" />
            </section>
          </div>
        </ScrollArea>

        {/* Footer: qty stepper + add to cart */}
        {!outOfStock ? (
          <div className="border-t border-border/60 bg-background p-4 shrink-0">
            {inCart && (
              <div className="mb-2 flex items-center justify-between text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
                  Sudah ada di keranjang: <strong className="text-foreground">{inCart.quantity}</strong>
                </span>
                <button
                  onClick={() => onOpenChange(false)}
                  className="text-primary hover:underline"
                >
                  Lihat keranjang
                </button>
              </div>
            )}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 rounded-xl border border-border bg-secondary/30 p-1">
                <button
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="flex h-10 w-10 items-center justify-center rounded-lg text-foreground hover:bg-background transition-colors"
                  aria-label="Kurangi jumlah"
                  disabled={qty <= 1}
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="min-w-10 text-center text-base font-bold tabular-nums">{qty}</span>
                <button
                  onClick={() => setQty((q) => Math.min(product.stock, q + 1))}
                  className="flex h-10 w-10 items-center justify-center rounded-lg text-foreground hover:bg-background transition-colors"
                  aria-label="Tambah jumlah"
                  disabled={qty >= product.stock}
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              <Button
                onClick={handleAddToCart}
                size="lg"
                className="flex-1 h-12 rounded-xl text-base shadow-md transition-transform hover:scale-[1.01]"
              >
                <ShoppingCart className="h-5 w-5 mr-2" />
                Tambah — {formatIDR(product.price * qty)}
              </Button>
            </div>
          </div>
        ) : (
          <div className="border-t border-border/60 bg-destructive/5 p-4 shrink-0">
            <div className="flex items-center justify-center gap-2 text-destructive font-semibold">
              <Package className="h-5 w-5" />
              Maaf, produk ini sedang habis
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function InfoRow({
  icon,
  label,
  value,
  full,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  full?: boolean;
}) {
  return (
    <div className={cn("flex items-start gap-2.5 rounded-lg bg-secondary/30 p-2.5", full && "sm:col-span-2")}>
      <span className="text-primary mt-0.5">{icon}</span>
      <div className="min-w-0">
        <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
        <p className="text-xs font-medium text-foreground break-words">{value}</p>
      </div>
    </div>
  );
}

function TrustBadge({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex flex-col items-center gap-1 text-center">
      <span className="text-primary">{icon}</span>
      <span className="text-[10px] font-medium text-muted-foreground leading-tight">{label}</span>
    </div>
  );
}
