"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Loader2, CheckCircle2, Truck, Store, CreditCard, Banknote, Wallet, Package } from "lucide-react";
import { useCartStore } from "@/lib/store/cart";
import { formatIDR } from "@/lib/mock-data";
import type { CheckoutResponse } from "@/types/grocery";
import { toast } from "sonner";

interface CheckoutDialogProps {
  open: boolean;
  onOpenChange: (o: boolean) => void;
}

type Step = "form" | "loading" | "success";

export function CheckoutDialog({ open, onOpenChange }: CheckoutDialogProps) {
  const [step, setStep] = useState<Step>("form");
  const [result, setResult] = useState<CheckoutResponse | null>(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    notes: "",
  });
  const [deliveryMethod, setDeliveryMethod] = useState<"delivery" | "pickup">("delivery");
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "transfer" | "ewallet">("cod");

  const items = useCartStore((s) => s.items);
  const totalPrice = useCartStore((s) => s.getTotalPrice());
  const clear = useCartStore((s) => s.clear);
  const closeCart = useCartStore((s) => s.closeCart);

  const FREE_SHIPPING_THRESHOLD = 50000;
  const freeShipping = totalPrice >= FREE_SHIPPING_THRESHOLD || deliveryMethod === "pickup";
  const shipping = freeShipping ? 0 : 9000;
  const grandTotal = totalPrice + shipping;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.address) {
      toast.error("Lengkapi data wajib (nama, telepon, alamat)");
      return;
    }

    setStep("loading");
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer: form,
          items,
          deliveryMethod,
          paymentMethod,
          total: grandTotal,
        }),
      });
      const data: CheckoutResponse = await res.json();
      setResult(data);
      if (data.success) {
        setStep("success");
        clear();
        toast.success("Pesanan berhasil dibuat!");
      } else {
        setStep("form");
        toast.error(data.message || "Gagal membuat pesanan");
      }
    } catch (err) {
      setStep("form");
      toast.error("Terjadi kesalahan jaringan");
    }
  };

  const handleClose = (open: boolean) => {
    onOpenChange(open);
    if (!open) {
      // reset after close animation
      setTimeout(() => {
        setStep("form");
        setResult(null);
      }, 200);
      closeCart();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-h-[92vh] overflow-y-auto scrollbar-grocery sm:max-w-lg">
        {step === "success" && result ? (
          <SuccessView result={result} onClose={() => handleClose(false)} />
        ) : step === "loading" ? (
          <LoadingView />
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Package className="h-5 w-5 text-primary" />
                Checkout Pesanan
              </DialogTitle>
              <DialogDescription>
                Lengkapi data pengiriman untuk menyelesaikan pesanan.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Customer info */}
              <div className="grid gap-3">
                <Field label="Nama Lengkap" required>
                  <Input
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Budi Santoso"
                    required
                  />
                </Field>
                <div className="grid grid-cols-2 gap-3">
                  <Field label="No. Telepon" required>
                    <Input
                      type="tel"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      placeholder="0812xxxxxxx"
                      required
                    />
                  </Field>
                  <Field label="Email">
                    <Input
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="budi@email.com"
                    />
                  </Field>
                </div>
                <Field label="Alamat Pengiriman" required>
                  <Textarea
                    value={form.address}
                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                    placeholder="Jl. Mawar No. 12, RT 02/RW 05..."
                    rows={2}
                    required
                  />
                </Field>
                <Field label="Kota">
                  <Input
                    value={form.city}
                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                    placeholder="Jakarta Selatan"
                  />
                </Field>
                <Field label="Catatan (opsional)">
                  <Input
                    value={form.notes}
                    onChange={(e) => setForm({ ...form, notes: e.target.value })}
                    placeholder="Tinggalkan di pos satpam..."
                  />
                </Field>
              </div>

              <Separator />

              {/* Delivery method */}
              <div className="space-y-2">
                <Label className="text-sm font-semibold">Metode Pengiriman</Label>
                <RadioGroup
                  value={deliveryMethod}
                  onValueChange={(v) => setDeliveryMethod(v as "delivery" | "pickup")}
                  className="grid grid-cols-2 gap-2"
                >
                  <RadioCard
                    value="delivery"
                    icon={<Truck className="h-4 w-4" />}
                    title="Antar"
                    desc={freeShipping ? "Gratis ongkir" : formatIDR(shipping)}
                  />
                  <RadioCard
                    value="pickup"
                    icon={<Store className="h-4 w-4" />}
                    title="Ambil Sendiri"
                    desc="Gratis"
                  />
                </RadioGroup>
              </div>

              {/* Payment method */}
              <div className="space-y-2">
                <Label className="text-sm font-semibold">Metode Pembayaran</Label>
                <RadioGroup
                  value={paymentMethod}
                  onValueChange={(v) => setPaymentMethod(v as "cod" | "transfer" | "ewallet")}
                  className="grid grid-cols-3 gap-2"
                >
                  <RadioCard
                    value="cod"
                    icon={<Banknote className="h-4 w-4" />}
                    title="COD"
                    desc="Bayar di tempat"
                    compact
                  />
                  <RadioCard
                    value="transfer"
                    icon={<CreditCard className="h-4 w-4" />}
                    title="Transfer"
                    desc="BCA, Mandiri"
                    compact
                  />
                  <RadioCard
                    value="ewallet"
                    icon={<Wallet className="h-4 w-4" />}
                    title="E-Wallet"
                    desc="GoPay/OVO"
                    compact
                  />
                </RadioGroup>
              </div>

              <Separator />

              {/* Order summary */}
              <div className="rounded-xl border border-border/60 bg-secondary/30 p-3 text-sm">
                <div className="mb-2 font-semibold">Ringkasan Pesanan</div>
                <div className="max-h-32 space-y-1 overflow-y-auto scrollbar-grocery pr-1">
                  {items.map((item) => (
                    <div key={item.product.id} className="flex justify-between text-xs text-muted-foreground">
                      <span className="line-clamp-1">
                        {item.product.emoji} {item.product.name} × {item.quantity}
                      </span>
                      <span className="ml-2 shrink-0">{formatIDR(item.product.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal</span>
                  <span>{formatIDR(totalPrice)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Ongkir</span>
                  <span className={freeShipping ? "text-primary font-medium" : ""}>
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
                type="submit"
                className="h-12 w-full rounded-xl text-base shadow-md transition-transform hover:scale-[1.01]"
                disabled={items.length === 0}
              >
                Buat Pesanan — {formatIDR(grandTotal)}
              </Button>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs font-medium text-muted-foreground">
        {label} {required && <span className="text-destructive">*</span>}
      </Label>
      {children}
    </div>
  );
}

function RadioCard({
  value,
  icon,
  title,
  desc,
  compact,
}: {
  value: string;
  icon: React.ReactNode;
  title: string;
  desc: string;
  compact?: boolean;
}) {
  return (
    <Label
      htmlFor={`r-${value}`}
      className="flex cursor-pointer flex-col gap-1 rounded-xl border border-border bg-card p-2.5 transition-all hover:border-primary/50 has-[:checked]:border-primary has-[:checked]:bg-primary/5"
    >
      <div className="flex items-center gap-2">
        <RadioGroupItem value={value} id={`r-${value}`} className="sr-only" />
        <span className="text-primary">{icon}</span>
        <span className={`font-semibold ${compact ? "text-xs" : "text-sm"}`}>{title}</span>
      </div>
      <span className="text-[10px] text-muted-foreground">{desc}</span>
    </Label>
  );
}

function LoadingView() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-16">
      <Loader2 className="h-10 w-10 animate-spin text-primary" />
      <div className="text-center">
        <p className="font-semibold">Memproses pesanan...</p>
        <p className="text-sm text-muted-foreground">Membuat Sales Order di ERPNext</p>
      </div>
    </div>
  );
}

function SuccessView({ result, onClose }: { result: CheckoutResponse; onClose: () => void }) {
  return (
    <div className="flex flex-col items-center gap-4 py-8 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
        <CheckCircle2 className="h-9 w-9 text-primary" />
      </div>
      <div>
        <h2 className="text-xl font-bold">Pesanan Berhasil! 🎉</h2>
        <p className="mt-1 text-sm text-muted-foreground">{result.message}</p>
      </div>

      <div className="w-full max-w-sm rounded-xl border border-border/60 bg-secondary/30 p-4 text-left">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">No. Pesanan</span>
          <span className="font-mono font-bold text-primary">{result.salesOrderName}</span>
        </div>
        {result.mock && (
          <div className="mt-2 rounded-md bg-amber-100 px-2 py-1 text-[11px] font-medium text-amber-700">
            ⚠️ Mode mock — set ERPNext terhubung untuk pesanan asli
          </div>
        )}
      </div>

      <Button onClick={onClose} className="mt-2 w-full max-w-sm rounded-xl">
        Selesai
      </Button>
    </div>
  );
}
