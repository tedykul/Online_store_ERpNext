"use client";

import { useState, useEffect } from "react";
import {
  Loader2, Save, Plug, CheckCircle2, XCircle, Eye, EyeOff,
  RefreshCw, Link2, KeyRound, Building2, Warehouse, Globe,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  AdminSectionHeading,
  AdminCard,
  AdminField,
} from "../admin-ui";
import { adminFetch } from "@/lib/admin-client";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

// ============================================================
// IntegrationEditor — ERPNext connection settings (admin UI).
// ============================================================
// Admin can edit URL, API key, API secret, site, warehouse,
// company without SSH/env restart. Test connection button
// validates config before saving.
// ============================================================

interface IntegrationConfig {
  erpnext_url: string;
  erpnext_api_key: string;
  erpnext_api_secret: string;
  erpnext_site: string;
  erpnext_warehouse: string;
  erpnext_company: string;
}

interface TestResult {
  connected: boolean;
  ping?: string;
  authUser?: string;
  error?: string;
}

export function IntegrationEditor() {
  const [config, setConfig] = useState<IntegrationConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<TestResult | null>(null);
  const [showSecret, setShowSecret] = useState(false);
  const [syncing, setSyncing] = useState(false);

  // Form state
  const [form, setForm] = useState<IntegrationConfig>({
    erpnext_url: "",
    erpnext_api_key: "",
    erpnext_api_secret: "",
    erpnext_site: "",
    erpnext_warehouse: "Stores - S",
    erpnext_company: "SayurLogi",
  });

  useEffect(() => {
    fetchConfig();
  }, []);

  async function fetchConfig() {
    setLoading(true);
    try {
      const res = await adminFetch<{ success: boolean; config: IntegrationConfig; isConfigured: boolean }>(
        "/api/admin/integration"
      );
      setConfig(res.config);
      setForm(res.config);
    } catch (err: any) {
      toast.error(err.message || "Gagal memuat konfigurasi");
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    setSaving(true);
    try {
      await adminFetch("/api/admin/integration", {
        method: "POST",
        body: JSON.stringify(form),
      });
      toast.success("Konfigurasi disimpan");
      setTestResult(null);
    } catch (err: any) {
      toast.error(err.message || "Gagal menyimpan");
    } finally {
      setSaving(false);
    }
  }

  async function handleTest() {
    setTesting(true);
    setTestResult(null);
    try {
      // Save first (so test uses latest values)
      await adminFetch("/api/admin/integration", {
        method: "POST",
        body: JSON.stringify(form),
      });

      // Then test
      const res = await adminFetch<{ success: boolean; connected: boolean; ping?: string; authUser?: string; error?: string; message?: string }>(
        "/api/admin/integration/test",
        { method: "POST" }
      );

      setTestResult({
        connected: res.connected,
        ping: res.ping,
        authUser: res.authUser,
        error: res.error,
      });

      if (res.connected) {
        toast.success(res.message || "Koneksi berhasil!");
      } else {
        toast.error(res.error || "Koneksi gagal");
      }
    } catch (err: any) {
      setTestResult({ connected: false, error: err.message });
      toast.error(err.message || "Test gagal");
    } finally {
      setTesting(false);
    }
  }

  async function handleSync() {
    setSyncing(true);
    try {
      const res = await adminFetch<{ success: boolean; message: string }>(
        "/api/admin/products/sync",
        { method: "POST" }
      );
      toast.success(res.message || "Sync selesai");
    } catch (err: any) {
      toast.error(err.message || "Sync gagal");
    } finally {
      setSyncing(false);
    }
  }

  const set = (field: keyof IntegrationConfig, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
        <span className="ml-2 text-sm text-muted-foreground">Memuat konfigurasi...</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <AdminSectionHeading
        title="🔗 Integrasi ERPNext"
        description="Atur koneksi ke ERPNext — bisa diedit tanpa restart server."
      />

      {/* Status Badge */}
      <AdminCard>
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={cn(
              "flex h-10 w-10 items-center justify-center rounded-full",
              testResult?.connected
                ? "bg-emerald-500/20"
                : testResult?.connected === false
                ? "bg-rose-500/20"
                : "bg-amber-500/20"
            )}>
              {testResult?.connected ? (
                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
              ) : testResult?.connected === false ? (
                <XCircle className="h-5 w-5 text-rose-600" />
              ) : (
                <Plug className="h-5 w-5 text-amber-600" />
              )}
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">
                {testResult?.connected
                  ? "Terhubung ke ERPNext"
                  : testResult?.connected === false
                  ? "Koneksi gagal"
                  : "Belum di-test"}
              </p>
              {testResult?.authUser && (
                <p className="text-xs text-muted-foreground">
                  Login sebagai: {testResult.authUser}
                </p>
              )}
              {testResult?.error && (
                <p className="text-xs text-rose-600">{testResult.error}</p>
              )}
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleTest}
            disabled={testing}
            className="h-9"
          >
            {testing ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Plug className="h-4 w-4" />
            )}
            <span className="ml-1">Test Connection</span>
          </Button>
        </div>
      </AdminCard>

      {/* Config Form */}
      <AdminCard>
        <div className="p-4 space-y-4">
          {/* URL */}
          <AdminField label="ERPNext URL" hint="Alamat server ERPNext (mis. http://sayurlogi:8000)">
            <div className="relative">
              <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={form.erpnext_url}
                onChange={(e) => set("erpnext_url", e.target.value)}
                placeholder="http://sayurlogi:8000"
                className="pl-9 h-9"
              />
            </div>
          </AdminField>

          {/* API Key */}
          <AdminField label="API Key" hint="Dari ERPNext → User → API Access">
            <div className="relative">
              <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={form.erpnext_api_key}
                onChange={(e) => set("erpnext_api_key", e.target.value)}
                placeholder="36e7c972d033fbe"
                className="pl-9 h-9 font-mono text-xs"
              />
            </div>
          </AdminField>

          {/* API Secret */}
          <AdminField label="API Secret" hint="Disimpan terenkripsi di database">
            <div className="relative">
              <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type={showSecret ? "text" : "password"}
                value={form.erpnext_api_secret}
                onChange={(e) => set("erpnext_api_secret", e.target.value)}
                placeholder="••••••••••••••••"
                className="pl-9 pr-9 h-9 font-mono text-xs"
              />
              <button
                type="button"
                onClick={() => setShowSecret(!showSecret)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showSecret ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </AdminField>

          {/* Site + Warehouse + Company (grid) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <AdminField label="Site Name" hint="Nama site Frappe (opsional)">
              <Input
                value={form.erpnext_site}
                onChange={(e) => set("erpnext_site", e.target.value)}
                placeholder="sayurlogi"
                className="h-9"
              />
            </AdminField>

            <AdminField label="Warehouse" hint="Gudang default untuk stok">
              <div className="relative">
                <Warehouse className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  value={form.erpnext_warehouse}
                  onChange={(e) => set("erpnext_warehouse", e.target.value)}
                  placeholder="Stores - S"
                  className="pl-9 h-9"
                />
              </div>
            </AdminField>

            <AdminField label="Company" hint="Nama perusahaan di ERPNext">
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  value={form.erpnext_company}
                  onChange={(e) => set("erpnext_company", e.target.value)}
                  placeholder="SayurLogi"
                  className="pl-9 h-9"
                />
              </div>
            </AdminField>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-2 pt-2 border-t border-border/60">
            <Button
              onClick={handleSave}
              disabled={saving}
              size="sm"
              className="h-9"
            >
              {saving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              <span className="ml-1">Simpan Konfigurasi</span>
            </Button>

            <Button
              variant="outline"
              onClick={handleTest}
              disabled={testing}
              size="sm"
              className="h-9"
            >
              {testing ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Plug className="h-4 w-4" />
              )}
              <span className="ml-1">Test Connection</span>
            </Button>

            <Button
              variant="outline"
              onClick={handleSync}
              disabled={syncing}
              size="sm"
              className="h-9"
            >
              {syncing ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
              <span className="ml-1">Sync Produk Sekarang</span>
            </Button>
          </div>
        </div>
      </AdminCard>

      {/* Info Card */}
      <AdminCard>
        <div className="p-4">
          <h3 className="text-sm font-semibold text-foreground mb-2">
            ℹ️ Informasi
          </h3>
          <div className="space-y-2 text-xs text-muted-foreground">
            <p>
              <strong className="text-foreground">Prioritas config:</strong> Database → Env vars → Kosong
            </p>
            <p>
              <strong className="text-foreground">API Secret:</strong> Disimpan terenkripsi (AES-256-CBC) di database.
              Tidak ada yang bisa lihat tanpa akses server.
            </p>
            <p>
              <strong className="text-foreground">Pindah hosting:</strong> Cukup edit form ini, klik Save + Test Connection.
              Tidak perlu SSH atau restart server.
            </p>
            <p>
              <strong className="text-foreground">Cara dapat API Key/Secret:</strong> Login ERPNext →
              buka User profile → section "API Access" → Generate New API Key.
            </p>
          </div>
        </div>
      </AdminCard>
    </div>
  );
}
