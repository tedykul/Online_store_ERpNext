"use client";

import { useMemo } from "react";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import {
  Loader2, TrendingUp, TrendingDown, ShoppingBag, DollarSign,
  Users, Clock, Package, AlertTriangle, ArrowRight,
} from "lucide-react";
import { motion } from "framer-motion";
import { useAdminFetch } from "../admin-ui";
import { AdminSectionHeading, AdminCard } from "../admin-ui";
import { formatIDR } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

// ============================================================
// DashboardEditor — colorful analytics dashboard with recharts.
// ============================================================
// Displays:
//   - 4 KPI cards (Revenue, Orders, Customers, Avg Order)
//   - Revenue 7-day trend (Area chart)
//   - Top 5 products (Horizontal bar)
//   - Orders by status (Donut)
//   - Revenue by category (Pie)
//   - Recent orders list
//   - Low stock alert
//
// Data source: GET /api/admin/dashboard
// ============================================================

interface DailyRevenue {
  date: string;
  label: string;
  revenue: number;
  orderCount: number;
}

interface TopProduct {
  itemCode: string;
  name: string;
  emoji: string;
  category: string;
  qty: number;
  revenue: number;
}

interface CategoryRevenue {
  category: string;
  revenue: number;
  orderCount: number;
}

interface StatusItem {
  status: string;
  label: string;
  count: number;
  color: string;
}

interface PaymentItem {
  method: string;
  label: string;
  count: number;
  revenue: number;
}

interface RecentOrder {
  id: string;
  trackingId: string;
  customerName: string;
  total: number;
  status: string;
  createdAt: string;
}

interface LowStockProduct {
  id: string;
  itemCode: string;
  name: string;
  emoji: string;
  category: string;
  stock: number;
  price: number;
}

interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  avgOrderValue: number;
  pendingOrders: number;
  revenueLast7Days: DailyRevenue[];
  ordersByStatus: StatusItem[];
  topProducts: TopProduct[];
  revenueByCategory: CategoryRevenue[];
  ordersByPaymentMethod: PaymentItem[];
  recentOrders: RecentOrder[];
  lowStockProducts: LowStockProduct[];
  // Phase 2
  stockByCategory: { category: string; stock: number; productCount: number; value: number }[];
  totalStockUnits: number;
  totalStockValue: number;
  erpSyncStatus: {
    totalProducts: number;
    syncedProducts: number;
    lastSyncAt: string | null;
    isConfigured: boolean;
  };
}

// Colorful palette for charts (8 distinct colors)
const CHART_COLORS = [
  "#10b981", // emerald
  "#3b82f6", // blue
  "#f59e0b", // amber
  "#8b5cf6", // violet
  "#ec4899", // pink
  "#06b6d4", // cyan
  "#f43f5e", // rose
  "#84cc16", // lime
];

const STATUS_LABELS: Record<string, string> = {
  pending: "Menunggu",
  confirmed: "Dikonfirmasi",
  preparing: "Disiapkan",
  out_for_delivery: "Dikirim",
  delivered: "Selesai",
  cancelled: "Dibatalkan",
};

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Baru saja";
  if (mins < 60) return `${mins} menit lalu`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} jam lalu`;
  const days = Math.floor(hours / 24);
  return `${days} hari lalu`;
}

export function DashboardEditor() {
  const { data, loading, error } = useAdminFetch<{ success: boolean; stats: DashboardStats }>(
    "/api/admin/dashboard"
  );

  const stats = data?.stats;
  const topProducts = stats?.topProducts ?? [];
  const revenueByCategory = stats?.revenueByCategory ?? [];

  // Memo: top products with index for color
  const topProductsColored = useMemo(() => {
    return topProducts.map((p, i) => ({
      ...p,
      fill: CHART_COLORS[i % CHART_COLORS.length],
    }));
  }, [topProducts]);

  // Memo: category revenue with colors
  const categoryColored = useMemo(() => {
    return revenueByCategory.map((c, i) => ({
      ...c,
      fill: CHART_COLORS[i % CHART_COLORS.length],
    }));
  }, [revenueByCategory]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-3 text-muted-foreground">Memuat dashboard...</span>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <AdminCard>
        <div className="p-6 text-center text-muted-foreground">
          <AlertTriangle className="mx-auto mb-2 h-8 w-8 text-amber-500" />
          <p>Gagal memuat data dashboard.</p>
          <p className="text-xs mt-1">{error || "Unknown error"}</p>
        </div>
      </AdminCard>
    );
  }

  return (
    <div className="space-y-4">
      <AdminSectionHeading
        title="📊 Dashboard"
        description="Overview performa SayurLogi — 30 hari terakhir"
      />

      {/* === KPI Cards === */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <KpiCard
          title="Total Revenue"
          value={formatIDR(stats.totalRevenue)}
          icon={<DollarSign className="h-5 w-5" />}
          gradient="from-emerald-500 to-teal-600"
          subtitle="30 hari terakhir"
        />
        <KpiCard
          title="Total Pesanan"
          value={String(stats.totalOrders)}
          icon={<ShoppingBag className="h-5 w-5" />}
          gradient="from-blue-500 to-indigo-600"
          subtitle={`${stats.pendingOrders} perlu aksi`}
          subtitleIcon={<Clock className="h-3 w-3" />}
        />
        <KpiCard
          title="Customer"
          value={String(stats.totalCustomers)}
          icon={<Users className="h-5 w-5" />}
          gradient="from-violet-500 to-purple-600"
          subtitle="Customer unik"
        />
        <KpiCard
          title="Avg Order Value"
          value={formatIDR(stats.avgOrderValue)}
          icon={<TrendingUp className="h-5 w-5" />}
          gradient="from-amber-500 to-orange-600"
          subtitle="Per pesanan"
        />
      </div>

      {/* === Charts Row 1: Revenue Trend + Status Donut === */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Revenue 7 days — Area chart (2 cols) */}
        <AdminCard className="lg:col-span-2">
          <div className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-sm font-semibold text-foreground">
                  📈 Revenue 7 Hari Terakhir
                </h3>
                <p className="text-xs text-muted-foreground">
                  Trend penjualan harian (IDR)
                </p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-emerald-600">
                  {formatIDR(
                    stats.revenueLast7Days.reduce((s, d) => s + d.revenue, 0)
                  )}
                </p>
                <p className="text-[10px] text-muted-foreground">Total minggu ini</p>
              </div>
            </div>
            <div className="h-[220px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stats.revenueLast7Days} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0.1} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                  <XAxis
                    dataKey="label"
                    tick={{ fontSize: 11, fill: "#6b7280" }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: "#6b7280" }}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
                  />
                  <Tooltip
                    content={({ active, payload, label }) => {
                      if (!active || !payload?.length) return null;
                      const data = payload[0].payload as DailyRevenue;
                      return (
                        <div className="rounded-lg border border-border bg-popover p-2 shadow-md text-xs">
                          <p className="font-medium text-foreground">{label}</p>
                          <p className="text-emerald-600">
                            Revenue: {formatIDR(data.revenue)}
                          </p>
                          <p className="text-blue-600">
                            Orders: {data.orderCount}
                          </p>
                        </div>
                      );
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#10b981"
                    strokeWidth={2}
                    fill="url(#colorRevenue)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </AdminCard>

        {/* Orders by status — Donut */}
        <AdminCard>
          <div className="p-4">
            <h3 className="text-sm font-semibold text-foreground mb-1">
              🔄 Status Pesanan
            </h3>
            <p className="text-xs text-muted-foreground mb-3">Distribusi semua order</p>
            <div className="h-[180px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats.ordersByStatus.filter((s) => s.count > 0)}
                    dataKey="count"
                    nameKey="label"
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={75}
                    paddingAngle={2}
                  >
                    {stats.ordersByStatus
                      .filter((s) => s.count > 0)
                      .map((entry) => (
                        <Cell key={entry.status} fill={entry.color} />
                      ))}
                  </Pie>
                  <Tooltip
                    content={({ active, payload }) => {
                      if (!active || !payload?.length) return null;
                      const data = payload[0].payload as StatusItem;
                      return (
                        <div className="rounded-lg border border-border bg-popover p-2 shadow-md text-xs">
                          <p className="font-medium" style={{ color: data.color }}>
                            {data.label}
                          </p>
                          <p className="text-foreground">{data.count} pesanan</p>
                        </div>
                      );
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-2 space-y-1">
              {stats.ordersByStatus
                .filter((s) => s.count > 0)
                .map((s) => (
                  <div key={s.status} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5">
                      <span
                        className="h-2.5 w-2.5 rounded-full"
                        style={{ backgroundColor: s.color }}
                      />
                      <span className="text-muted-foreground">{s.label}</span>
                    </div>
                    <span className="font-medium text-foreground">{s.count}</span>
                  </div>
                ))}
            </div>
          </div>
        </AdminCard>
      </div>

      {/* === Charts Row 2: Top Products + Category Pie === */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Top 5 products — Horizontal bar */}
        <AdminCard>
          <div className="p-4">
            <h3 className="text-sm font-semibold text-foreground mb-1">
              🏆 Top 5 Produk Terlaris
            </h3>
            <p className="text-xs text-muted-foreground mb-3">
              Berdasarkan qty terjual (30 hari)
            </p>
            {topProductsColored.length === 0 ? (
              <div className="py-10 text-center text-sm text-muted-foreground">
                <Package className="mx-auto mb-2 h-8 w-8 opacity-40" />
                Belum ada penjualan
              </div>
            ) : (
              <div className="h-[220px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={topProductsColored}
                    layout="vertical"
                    margin={{ top: 0, right: 10, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" horizontal={false} />
                    <XAxis
                      type="number"
                      tick={{ fontSize: 11, fill: "#6b7280" }}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      type="category"
                      dataKey="name"
                      tick={{ fontSize: 11, fill: "#6b7280" }}
                      tickLine={false}
                      axisLine={false}
                      width={100}
                      tickFormatter={(v) => (v.length > 14 ? v.slice(0, 13) + "…" : v)}
                    />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (!active || !payload?.length) return null;
                        const p = payload[0].payload as TopProduct;
                        return (
                          <div className="rounded-lg border border-border bg-popover p-2 shadow-md text-xs">
                            <p className="font-medium text-foreground">
                              {p.emoji} {p.name}
                            </p>
                            <p className="text-muted-foreground">{p.category}</p>
                            <p className="text-emerald-600 mt-1">
                              Qty: {p.qty} | Revenue: {formatIDR(p.revenue)}
                            </p>
                          </div>
                        );
                      }}
                    />
                    <Bar dataKey="qty" radius={[0, 6, 6, 0]}>
                      {topProductsColored.map((p) => (
                        <Cell key={p.itemCode} fill={p.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        </AdminCard>

        {/* Revenue by category — Pie */}
        <AdminCard>
          <div className="p-4">
            <h3 className="text-sm font-semibold text-foreground mb-1">
              🥧 Revenue per Kategori
            </h3>
            <p className="text-xs text-muted-foreground mb-3">
              Distribusi pendapatan (30 hari)
            </p>
            {categoryColored.length === 0 ? (
              <div className="py-10 text-center text-sm text-muted-foreground">
                <Package className="mx-auto mb-2 h-8 w-8 opacity-40" />
                Belum ada penjualan
              </div>
            ) : (
              <div className="h-[220px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryColored}
                      dataKey="revenue"
                      nameKey="category"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label={({ category, percent }) =>
                        `${category} ${((percent || 0) * 100).toFixed(0)}%`
                      }
                      labelLine={false}
                      style={{ fontSize: 11 }}
                    >
                      {categoryColored.map((c) => (
                        <Cell key={c.category} fill={c.fill} />
                      ))}
                    </Pie>
                    <Tooltip
                      content={({ active, payload }) => {
                        if (!active || !payload?.length) return null;
                        const c = payload[0].payload as CategoryRevenue;
                        return (
                          <div className="rounded-lg border border-border bg-popover p-2 shadow-md text-xs">
                            <p className="font-medium text-foreground">{c.category}</p>
                            <p className="text-emerald-600">
                              Revenue: {formatIDR(c.revenue)}
                            </p>
                            <p className="text-muted-foreground">
                              {c.orderCount} item terjual
                            </p>
                          </div>
                        );
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        </AdminCard>
      </div>

      {/* === Lists Row: Recent Orders + Low Stock === */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Recent orders */}
        <AdminCard>
          <div className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-foreground">
                📋 Pesanan Terbaru
              </h3>
              <span className="text-xs text-muted-foreground">5 terakhir</span>
            </div>
            {stats.recentOrders.length === 0 ? (
              <div className="py-8 text-center text-sm text-muted-foreground">
                Belum ada pesanan
              </div>
            ) : (
              <div className="space-y-2">
                {stats.recentOrders.map((order) => {
                  const statusMeta = stats.ordersByStatus.find(
                    (s) => s.status === order.status
                  );
                  return (
                    <div
                      key={order.id}
                      className="flex items-center justify-between rounded-lg border border-border/60 bg-secondary/30 p-2.5"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-medium text-foreground">
                            #{order.trackingId}
                          </span>
                          <span
                            className="rounded px-1.5 py-0.5 text-[10px] font-medium text-white"
                            style={{ backgroundColor: statusMeta?.color }}
                          >
                            {statusMeta?.label || STATUS_LABELS[order.status] || order.status}
                          </span>
                        </div>
                        <p className="mt-0.5 truncate text-xs text-muted-foreground">
                          {order.customerName} · {timeAgo(order.createdAt)}
                        </p>
                      </div>
                      <span className="ml-2 text-sm font-semibold text-foreground">
                        {formatIDR(order.total)}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </AdminCard>

        {/* Low stock alert */}
        <AdminCard>
          <div className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-foreground">
                ⚠️ Stok Menipis
              </h3>
              <span className="text-xs text-muted-foreground">Stok &lt; 10</span>
            </div>
            {stats.lowStockProducts.length === 0 ? (
              <div className="py-8 text-center text-sm text-muted-foreground">
                <Package className="mx-auto mb-2 h-8 w-8 opacity-40" />
                Semua stok aman
              </div>
            ) : (
              <div className="space-y-2">
                {stats.lowStockProducts.map((p) => (
                  <div
                    key={p.id}
                    className="flex items-center justify-between rounded-lg border border-border/60 bg-secondary/30 p-2.5"
                  >
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      <span className="text-xl">{p.emoji}</span>
                      <div className="min-w-0">
                        <p className="truncate text-xs font-medium text-foreground">
                          {p.name}
                        </p>
                        <p className="text-[10px] text-muted-foreground">
                          {p.itemCode} · {p.category}
                        </p>
                      </div>
                    </div>
                    <div className="ml-2 text-right">
                      <span
                        className={cn(
                          "rounded px-1.5 py-0.5 text-xs font-bold",
                          p.stock === 0
                            ? "bg-rose-500/20 text-rose-700"
                            : "bg-amber-500/20 text-amber-700"
                        )}
                      >
                        {p.stock} {p.stock === 0 ? "habis" : "tersisa"}
                      </span>
                      <p className="mt-0.5 text-[10px] text-muted-foreground">
                        {formatIDR(p.price)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </AdminCard>
      </div>

      {/* === Phase 2: Product Dashboard Section === */}
      {/* Stock KPI cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <KpiCard
          title="Total Stok (unit)"
          value={String(stats.totalStockUnits)}
          icon={<Package className="h-5 w-5" />}
          gradient="from-cyan-500 to-blue-600"
          subtitle="Semua produk published"
        />
        <KpiCard
          title="Nilai Stok"
          value={formatIDR(stats.totalStockValue)}
          icon={<DollarSign className="h-5 w-5" />}
          gradient="from-emerald-500 to-green-600"
          subtitle="Stock × harga"
        />
        <KpiCard
          title="Produk Published"
          value={String(stats.erpSyncStatus.totalProducts)}
          icon={<Package className="h-5 w-5" />}
          gradient="from-violet-500 to-purple-600"
          subtitle="Total di DB"
        />
        <KpiCard
          title="Sync ERPNext"
          value={String(stats.erpSyncStatus.syncedProducts)}
          icon={<TrendingUp className="h-5 w-5" />}
          gradient="from-amber-500 to-orange-600"
          subtitle={
            stats.erpSyncStatus.lastSyncAt
              ? `Last: ${timeAgo(stats.erpSyncStatus.lastSyncAt)}`
              : "Belum pernah sync"
          }
        />
      </div>

      {/* ERPNext Sync Status Card */}
      <AdminCard>
        <div className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-sm font-semibold text-foreground">
                🔄 ERPNext Sync Status
              </h3>
              <p className="text-xs text-muted-foreground">
                Status sinkronisasi produk dengan ERPNext
              </p>
            </div>
            <span
              className={cn(
                "rounded-full px-2.5 py-1 text-xs font-medium",
                stats.erpSyncStatus.isConfigured
                  ? "bg-emerald-500/20 text-emerald-700"
                  : "bg-rose-500/20 text-rose-700"
              )}
            >
              {stats.erpSyncStatus.isConfigured ? "● Configured" : "● Not Configured"}
            </span>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-lg border border-border/60 bg-secondary/30 p-3 text-center">
              <p className="text-2xl font-bold text-foreground">
                {stats.erpSyncStatus.totalProducts}
              </p>
              <p className="text-[10px] text-muted-foreground">Total Produk</p>
            </div>
            <div className="rounded-lg border border-border/60 bg-secondary/30 p-3 text-center">
              <p className="text-2xl font-bold text-emerald-600">
                {stats.erpSyncStatus.syncedProducts}
              </p>
              <p className="text-[10px] text-muted-foreground">Tersinkron</p>
            </div>
            <div className="rounded-lg border border-border/60 bg-secondary/30 p-3 text-center">
              <p className="text-2xl font-bold text-amber-600">
                {stats.erpSyncStatus.totalProducts - stats.erpSyncStatus.syncedProducts}
              </p>
              <p className="text-[10px] text-muted-foreground">Manual Only</p>
            </div>
          </div>
          {stats.erpSyncStatus.lastSyncAt && (
            <p className="mt-3 text-center text-xs text-muted-foreground">
              Sync terakhir: {timeAgo(stats.erpSyncStatus.lastSyncAt)}
            </p>
          )}
        </div>
      </AdminCard>

      {/* Stock per category — Bar chart */}
      <AdminCard>
        <div className="p-4">
          <h3 className="text-sm font-semibold text-foreground mb-1">
            📦 Stok per Kategori
          </h3>
          <p className="text-xs text-muted-foreground mb-3">
            Distribusi stok + jumlah produk per kategori
          </p>
          {stats.stockByCategory.length === 0 ? (
            <div className="py-10 text-center text-sm text-muted-foreground">
              <Package className="mx-auto mb-2 h-8 w-8 opacity-40" />
              Belum ada produk
            </div>
          ) : (
            <>
              <div className="h-[220px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={stats.stockByCategory.map((c, i) => ({
                      ...c,
                      fill: CHART_COLORS[i % CHART_COLORS.length],
                    }))}
                    margin={{ top: 5, right: 10, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                    <XAxis
                      dataKey="category"
                      tick={{ fontSize: 11, fill: "#6b7280" }}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      tick={{ fontSize: 11, fill: "#6b7280" }}
                      tickLine={false}
                      axisLine={false}
                    />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (!active || !payload?.length) return null;
                        const c = payload[0].payload as {
                          category: string;
                          stock: number;
                          productCount: number;
                          value: number;
                        };
                        return (
                          <div className="rounded-lg border border-border bg-popover p-2 shadow-md text-xs">
                            <p className="font-medium text-foreground">{c.category}</p>
                            <p className="text-blue-600">Stok: {c.stock} unit</p>
                            <p className="text-violet-600">Produk: {c.productCount}</p>
                            <p className="text-emerald-600">Nilai: {formatIDR(c.value)}</p>
                          </div>
                        );
                      }}
                    />
                    <Bar dataKey="stock" radius={[6, 6, 0, 0]}>
                      {stats.stockByCategory.map((c, i) => (
                        <Cell key={c.category} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              {/* Detail table */}
              <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-2">
                {stats.stockByCategory.map((c, i) => (
                  <div
                    key={c.category}
                    className="rounded-lg border border-border/60 bg-secondary/30 p-2"
                  >
                    <div className="flex items-center gap-1.5">
                      <span
                        className="h-2.5 w-2.5 rounded-full"
                        style={{ backgroundColor: CHART_COLORS[i % CHART_COLORS.length] }}
                      />
                      <span className="text-xs font-medium text-foreground truncate">
                        {c.category}
                      </span>
                    </div>
                    <p className="mt-1 text-lg font-bold text-foreground">{c.stock}</p>
                    <p className="text-[10px] text-muted-foreground">
                      {c.productCount} produk · {formatIDR(c.value)}
                    </p>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </AdminCard>

      {/* Payment methods (compact) */}
      {stats.ordersByPaymentMethod.length > 0 && (
        <AdminCard>
          <div className="p-4">
            <h3 className="text-sm font-semibold text-foreground mb-3">
              💳 Metode Pembayaran
            </h3>
            <div className="grid grid-cols-3 gap-3">
              {stats.ordersByPaymentMethod.map((pm, i) => (
                <div
                  key={pm.method}
                  className="rounded-lg border border-border/60 bg-secondary/30 p-3 text-center"
                >
                  <div
                    className="mx-auto mb-1 flex h-8 w-8 items-center justify-center rounded-full text-white"
                    style={{ backgroundColor: CHART_COLORS[i % CHART_COLORS.length] }}
                  >
                    <span className="text-xs font-bold">{pm.count}</span>
                  </div>
                  <p className="text-xs font-medium text-foreground">{pm.label}</p>
                  <p className="text-[10px] text-muted-foreground">
                    {formatIDR(pm.revenue)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </AdminCard>
      )}
    </div>
  );
}

// ============================================================
// KPI Card — colorful gradient card with icon + value + subtitle
// ============================================================
function KpiCard({
  title,
  value,
  icon,
  gradient,
  subtitle,
  subtitleIcon,
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
  gradient: string;
  subtitle?: string;
  subtitleIcon?: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "relative overflow-hidden rounded-xl bg-gradient-to-br p-4 text-white shadow-sm",
        gradient
      )}
    >
      <div className="relative z-10">
        <div className="flex items-center justify-between">
          <p className="text-xs font-medium text-white/80">{title}</p>
          <div className="rounded-lg bg-white/20 p-1.5">{icon}</div>
        </div>
        <p className="mt-2 text-xl font-bold tracking-tight">{value}</p>
        {subtitle && (
          <p className="mt-1 flex items-center gap-1 text-[10px] text-white/70">
            {subtitleIcon}
            {subtitle}
          </p>
        )}
      </div>
      {/* Decorative circle */}
      <div className="absolute -right-6 -bottom-6 h-20 w-20 rounded-full bg-white/10" />
      <div className="absolute -right-2 -top-2 h-12 w-12 rounded-full bg-white/5" />
    </motion.div>
  );
}
