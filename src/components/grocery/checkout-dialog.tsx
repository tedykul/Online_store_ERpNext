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
import { TrustBadges } from "./trust-badges";
import { CheckoutSteps } from "./checkout-steps";
import { DeliveryEstimateDisplay } from "./delivery-estimate";

interface CheckoutDialogProps {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  /** Called when user clicks "Lacak Pesanan" in success view. Optional. */
  onTrackOrder?: (trackingId: string) => void;
}

type Step = "form" | "loading" | "success";

export function CheckoutDialog({ open, onOpenChange, onTrackOrder }: CheckoutDialogProps) {
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
        {/* Always-present description for a11y (suppresses Radix warning
            when step switches to loading/success without DialogDescription) */}
        <DialogDescription className="sr-only">
          Dialog checkout SayurLogi
        </DialogDescription>

        {/* Step indicator (3-step progress: form -> loading -> success) */}
        <CheckoutSteps current={step} />

        {step === "success" && result ? (
          <SuccessView
            result={result}
            deliveryMethod={deliveryMethod}
            onClose={() => handleClose(false)}
            onTrackOrder={onTrackOrder}
          />
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
                {/* Estimated delivery time — updates when method changes */}
                <DeliveryEstimateDisplay method={deliveryMethod} variant="card" />
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

              {/* Trust badges — reassure user before clicking submit */}
              <TrustBadges variant="compact" className="pt-1" />
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

function SuccessView({
  result,
  deliveryMethod,
  onClose,
  onTrackOrder,
}: {
  result: CheckoutResponse;
  deliveryMethod: "delivery" | "pickup";
  onClose: () => void;
  onTrackOrder?: (trackingId: string) => void;
}) {
  const [paying, setPaying] = useState(false);
  const [paid, setPaid] = useState(false);

  const handleConfirmPayment = async () => {
    if (!result.paymentId) return;
    setPaying(true);
    try {
      const res = await fetch(`/api/payments/${result.paymentId}/confirm`, {
        method: "POST",
      });
      const data = await res.json();
      if (data.success) {
        setPaid(true);
        toast.success("Pembayaran dikonfirmasi! Pesanan diproses.");
      } else {
        toast.error(data.message || "Gagal konfirmasi pembayaran");
      }
    } catch {
      toast.error("Koneksi gagal");
    } finally {
      setPaying(false);
    }
  };

  const payment = result.payment;
  const isCod = payment?.method === "cod";
  const needsPayment = payment && !isCod && !paid;

  return (
    <div className="flex flex-col items-center gap-4 py-8 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
        <CheckCircle2 className="h-9 w-9 text-primary" />
      </div>
      <div>
        <h2 className="text-xl font-bold">Pesanan Berhasil! 🎉</h2>
        <p className="mt-1 text-sm text-muted-foreground">{result.message}</p>
      </div>

      <div className="w-full max-w-sm space-y-3 text-left">
        {/* Tracking ID */}
        {result.trackingId && (
          <div className="rounded-xl border border-primary/30 bg-primary/5 p-4">
            <p className="text-[10px] font-medium uppercase text-muted-foreground">
              Tracking ID
            </p>
            <div className="flex items-center justify-between gap-2 mt-1">
              <code className="text-xl font-mono font-bold text-primary">
                {result.trackingId}
              </code>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(result.trackingId!);
                  toast.success("Tracking ID disalin!");
                }}
                className="text-muted-foreground hover:text-foreground text-xs"
              >
                Salin
              </button>
            </div>
            <p className="mt-1 text-[10px] text-muted-foreground">
              Simpan ID ini untuk lacak pesanan kamu
            </p>
          </div>
        )}

        {/* Payment instructions */}
        {payment && (
          <div className={`rounded-xl border p-4 ${paid ? "border-emerald-500/40 bg-emerald-500/5" : "border-border/60 bg-secondary/30"}`}>
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-semibold">
                {paid ? "✅ Pembayaran Diterima" : "💳 Pembayaran"}
              </p>
              <span className="text-xs font-bold text-primary">
                {formatIDR(payment.amount)}
              </span>
            </div>

            {isCod && (
              <p className="text-xs text-muted-foreground">
                💵 Bayar tunai saat pesanan tiba. Siapkan uang pas ya!
              </p>
            )}

            {payment.method === "transfer" && !paid && (
              <div className="space-y-2">
                <div className="rounded-lg bg-background p-2.5">
                  <p className="text-[10px] text-muted-foreground">{payment.vaBank} Virtual Account</p>
                  <div className="flex items-center justify-between mt-0.5">
                    <code className="text-sm font-mono font-bold">{payment.vaNumber}</code>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(payment.vaNumber!);
                        toast.success("VA number disalin!");
                      }}
                      className="text-xs text-primary hover:underline"
                    >
                      Salin
                    </button>
                  </div>
                </div>
                <p className="text-[10px] text-muted-foreground">
                  Transfer ke VA di atas. Klik "Saya Sudah Bayar" setelah transfer.
                </p>
              </div>
            )}

            {payment.method === "ewallet" && !paid && (
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground">
                  Bayar via {payment.ewalletProvider}:
                </p>
                <a
                  href={payment.paymentUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full rounded-lg bg-primary px-3 py-2 text-center text-xs font-medium text-primary-foreground hover:bg-primary/90"
                >
                  Buka Link Pembayaran →
                </a>
              </div>
            )}

            {paid && (
              <p className="text-xs text-emerald-600">
                Pesanan kamu sedang diproses! Cek status via Tracking ID.
              </p>
            )}
          </div>
        )}

        {/* ERP order number */}
        <div className="rounded-xl border border-border/60 bg-secondary/30 p-4">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">No. Pesanan ERP</span>
            <span className="font-mono font-bold text-primary text-xs">{result.salesOrderName}</span>
          </div>
          {result.mock && (
            <div className="mt-2 rounded-md bg-amber-100 px-2 py-1 text-[11px] font-medium text-amber-700">
              ⚠️ Mode mock — set ERPNext terhubung untuk pesanan asli
            </div>
          )}
        </div>

        {/* Estimated delivery/pickup time */}
        <DeliveryEstimateDisplay method={deliveryMethod} variant="card" />
      </div>

      {/* Actions */}
      <div className="flex w-full max-w-sm gap-2">
        {needsPayment && (
          <Button
            onClick={handleConfirmPayment}
            disabled={paying}
            className="flex-1 rounded-xl"
          >
            {paying ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Memproses...
              </>
            ) : (
              "Saya Sudah Bayar"
            )}
          </Button>
        )}
        {result.trackingId && onTrackOrder && (
          <Button
            variant="outline"
            onClick={() => onTrackOrder(result.trackingId!)}
            className="flex-1 rounded-xl"
          >
            <Package className="h-4 w-4 mr-2" />
            Lacak
          </Button>
        )}
        <Button onClick={onClose} variant={paid || isCod ? "default" : "outline"} className="flex-1 rounded-xl">
          Selesai
        </Button>
      </div>
    </div>
  );
}
