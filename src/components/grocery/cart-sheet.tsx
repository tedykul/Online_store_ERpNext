"use client";

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Minus, Plus, Trash2, ShoppingBag, Truck } from "lucide-react";
import { useCartStore } from "@/lib/store/cart";
import { formatIDR } from "@/lib/mock-data";
import { motion, AnimatePresence } from "framer-motion";

interface CartSheetProps {
  onCheckout: () => void;
}

export function CartSheet({ onCheckout }: CartSheetProps) {
  const { items, isOpen, closeCart, updateQty, removeItem, clear } = useCartStore();
  const totalItems = useCartStore((s) => s.getTotalItems());
  const totalPrice = useCartStore((s) => s.getTotalPrice());

  const FREE_SHIPPING_THRESHOLD = 50000;
  const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - totalPrice);
  const freeShipping = totalPrice >= FREE_SHIPPING_THRESHOLD;
  const shipping = freeShipping ? 0 : 9000;
  const grandTotal = totalPrice + shipping;

  return (
    <Sheet open={isOpen} onOpenChange={(o) => !o && closeCart()}>
      <SheetContent className="flex w-full flex-col gap-0 p-0 sm:max-w-md">
        {/* Header */}
        <SheetHeader className="border-b border-border/60 px-5 py-4">
          <SheetTitle className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-primary" />
            Keranjang Belanja
            {totalItems > 0 && (
              <span className="ml-auto rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
                {totalItems} item
              </span>
            )}
          </SheetTitle>
        </SheetHeader>

        {/* Free shipping progress */}
        {items.length > 0 && (
          <div className="border-b border-border/60 bg-primary/5 px-5 py-3">
            {freeShipping ? (
              <p className="flex items-center gap-1.5 text-xs font-medium text-primary">
                <Truck className="h-3.5 w-3.5" /> Yeay! Kamu dapat gratis ongkir 🎉
              </p>
            ) : (
              <>
                <p className="text-xs text-muted-foreground">
                  Tambah <span className="font-semibold text-primary">{formatIDR(remaining)}</span> lagi untuk gratis ongkir!
                </p>
                <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-primary/15">
                  <motion.div
                    className="h-full rounded-full bg-primary"
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(100, (totalPrice / FREE_SHIPPING_THRESHOLD) * 100)}%` }}
                    transition={{ duration: 0.4 }}
                  />
                </div>
              </>
            )}
          </div>
        )}

        {/* Items list */}
        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 p-8 text-center">
            <span className="text-6xl">🛒</span>
            <h3 className="text-base font-semibold">Keranjang masih kosong</h3>
            <p className="text-sm text-muted-foreground">
              Yuk pilih sayur dan buah segar favoritmu!
            </p>
            <Button variant="outline" onClick={closeCart} className="mt-2 rounded-full">
              Lanjut Belanja
            </Button>
          </div>
        ) : (
          <ScrollArea className="flex-1 scrollbar-grocery">
            <div className="flex flex-col gap-3 p-4">
              <AnimatePresence initial={false}>
                {items.map((item) => (
                  <motion.div
                    key={item.product.id}
                    layout
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, x: 30, height: 0, marginBottom: 0 }}
                    transition={{ duration: 0.2 }}
                    className="flex gap-3 rounded-xl border border-border/60 bg-card p-3"
                  >
                    {/* Thumb emoji */}
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-secondary/40 to-secondary/10 text-3xl">
                      {item.product.emoji}
                    </div>

                    {/* Info */}
                    <div className="flex flex-1 flex-col gap-1">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="line-clamp-1 text-sm font-semibold leading-tight">
                          {item.product.name}
                        </h4>
                        <button
                          onClick={() => removeItem(item.product.id)}
                          className="shrink-0 text-muted-foreground transition-colors hover:text-destructive"
                          aria-label="Hapus"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {formatIDR(item.product.price)} / {item.product.unit}
                      </span>

                      <div className="mt-1 flex items-center justify-between">
                        <div className="flex items-center gap-1 rounded-lg border border-border bg-secondary/30 p-0.5">
                          <button
                            onClick={() => updateQty(item.product.id, item.quantity - 1)}
                            className="flex h-6 w-6 items-center justify-center rounded text-foreground hover:bg-background"
                            aria-label="Kurangi"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="min-w-6 text-center text-sm font-semibold tabular-nums">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQty(item.product.id, item.quantity + 1)}
                            disabled={item.quantity >= item.product.stock}
                            className="flex h-6 w-6 items-center justify-center rounded text-foreground hover:bg-background disabled:opacity-40"
                            aria-label="Tambah"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                        <span className="text-sm font-bold text-primary">
                          {formatIDR(item.product.price * item.quantity)}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              <button
                onClick={clear}
                className="mx-auto mt-2 text-xs text-muted-foreground underline transition-colors hover:text-destructive"
              >
                Kosongkan keranjang
              </button>
            </div>
          </ScrollArea>
        )}

        {/* Footer summary */}
        {items.length > 0 && (
          <SheetFooter className="border-t border-border/60 p-4">
            <div className="mb-3 space-y-1.5 text-sm">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal ({totalItems} item)</span>
                <span className="font-medium text-foreground">{formatIDR(totalPrice)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Ongkos kirim</span>
                <span className={freeShipping ? "font-medium text-primary" : "font-medium text-foreground"}>
                  {freeShipping ? "GRATIS" : formatIDR(shipping)}
                </span>
              </div>
              <Separator className="my-2" />
              <div className="flex justify-between text-base font-bold">
                <span>Total</span>
                <span className="text-primary">{formatIDR(grandTotal)}</span>
              </div>
            </div>
            <Button
              onClick={onCheckout}
              className="h-12 w-full rounded-xl text-base shadow-md transition-transform hover:scale-[1.02]"
            >
              Checkout Sekarang
            </Button>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
}
