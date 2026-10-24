"use client";

import { useState, useEffect } from "react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Search, Loader2, Package, Clock, AlertCircle, History,
} from "lucide-react";
import { motion } from "framer-motion";
import { formatIDR } from "@/lib/mock-data";
import {
  ORDER_STATUS_LABELS, ORDER_STATUS_COLORS, ORDER_STATUS_ICONS,
  type OrderStatus,
} from "@/lib/orders";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface OrderHistoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Called when user clicks "Lacak" on an order */
  onTrackOrder?: (trackingId: string) => void;
}

interface HistoryOrder {
  id: string;
  trackingId: string;
  customerName: string;
  status: OrderStatus;
  total: number;
  items: Array<{ product: { emoji: string; name: string }; quantity: number }>;
  deliveryMethod: string;
  paymentMethod: string;
  createdAt: string;
  estimatedDelivery: string | null;
}

export function OrderHistoryDialog({ open, onOpenChange, onTrackOrder }: OrderHistoryDialogProps) {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState<HistoryOrder[] | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) {
      setOrders(null);
      setError("");
    }
  }, [open]);

  const handleSearch = async () => {
    if (!email.trim() && !phone.trim()) {
      setError("Isi email atau nomor telepon untuk mencari pesanan.");
      return;
    }
    setLoading(true);
    setError("");
    setOrders(null);
    try {
      const params = new URLSearchParams();
      if (email.trim()) params.set("email", email.trim());
      if (phone.trim()) params.set("phone", phone.trim());
      const res = await fetch(`/api/orders/history?${params}`);
      const data = await res.json();
      if (data.success) {
        setOrders(data.orders);
        if (data.orders.length === 0) {
          setError(data.message || "Tidak ada pesanan ditemukan.");
        }
      } else {
        setError(data.message || "Gagal mencari pesanan.");
      }
    } catch {
      setError("Koneksi gagal. Coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[92vh] overflow-y-auto scrollbar-grocery sm:max-w-lg">
        <DialogDescription className="sr-only">
          Riwayat pesanan SayurBox
        </DialogDescription>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <History className="h-5 w-5 text-primary" />
            Riwayat Pesanan
          </DialogTitle>
        </DialogHeader>

        {/* Search form */}
        <div className="space-y-3">
          <p className="text-xs text-muted-foreground">
            Masukkan email atau nomor telepon yang kamu pakai saat checkout untuk melihat semua pesanan.
          </p>
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <Label className="text-[10px] font-medium text-muted-foreground">Email</Label>
              <Input
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); if (error) setError(""); }}
                placeholder="email@kamu.com"
                className="h-9 text-xs"
                disabled={loading}
              />
            </div>
            <div className="space-y-1">
              <Label className="text-[10px] font-medium text-muted-foreground">Telepon</Label>
              <Input
                type="tel"
                value={phone}
                onChange={(e) => { setPhone(e.target.value); if (error) setError(""); }}
                placeholder="0812xxxxxxx"
                className="h-9 text-xs"
                disabled={loading}
              />
            </div>
          </div>
          {error && (
            <p className="flex items-center gap-1 text-xs text-destructive" role="alert">
              <AlertCircle className="h-3 w-3" />
              {error}
            </p>
          )}
          <Button onClick={handleSearch} disabled={loading} className="w-full h-9">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : (
              <>
                <Search className="h-4 w-4 mr-1" />
                Cari Pesanan
              </>
            )}
          </Button>
        </div>

        {/* Results */}
        {orders && orders.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-2"
          >
            <Separator />
            <p className="text-xs font-semibold text-muted-foreground">
              {orders.length} pesanan ditemukan
            </p>
            {orders.map((order, i) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(i * 0.04, 0.3) }}
                className="rounded-xl border border-border/60 bg-card p-3"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <code className="text-sm font-mono font-bold text-primary">
                        {order.trackingId}
                      </code>
                      <Badge className={cn("text-[10px]", ORDER_STATUS_COLORS[order.status])}>
                        {ORDER_STATUS_ICONS[order.status]} {ORDER_STATUS_LABELS[order.status]}
                      </Badge>
                    </div>
                    <div className="mt-0.5 flex flex-wrap items-center gap-x-2 text-[10px] text-muted-foreground">
                      <span>{order.items.length} item</span>
                      <span>· {formatIDR(order.total)}</span>
                      <span>· {new Date(order.createdAt).toLocaleDateString("id-ID", {
                        day: "numeric", month: "short", year: "numeric",
                      })}</span>
                    </div>
                  </div>
                  {onTrackOrder && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        onTrackOrder(order.trackingId);
                        onOpenChange(false);
                      }}
                      className="h-7 text-xs shrink-0"
                    >
                      <Package className="h-3 w-3 mr-1" />
                      Lacak
                    </Button>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </DialogContent>
    </Dialog>
  );
}
