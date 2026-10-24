"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X, Lock, Loader2, AlertCircle, LogOut,
  Home, Sparkles, Phone, HelpCircle, Users, MessageSquare, Layers, PanelBottom, ScrollText, Package,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getAdminToken, clearAdminToken, loginAdmin } from "@/lib/admin-client";
import { HeroPromoContactEditor } from "./sections/hero-promo-contact-editor";
import { FaqEditor } from "./sections/faq-editor";
import { TestimonialEditor } from "./sections/testimonial-editor";
import { AboutEditor } from "./sections/about-editor";
import { CategoryEditor } from "./sections/category-editor";
import { FooterEditor } from "./sections/footer-editor";
import { AuditLogViewer } from "./sections/audit-log-viewer";
import { OrderEditor } from "./sections/order-editor";
import { toast } from "sonner";

// ============================================================
// AdminOverlay — full-screen content management overlay.
// ============================================================
// Mount in page.tsx (hidden by default). Open via:
//   - Footer admin button (gear icon)
//   - Keyboard shortcut Ctrl+Shift+A
// Password gate → if no token in sessionStorage, show login form.
// After login: sidebar tabs + content editor per section.
// ============================================================

type Tab = "orders" | "hero" | "promo" | "contact" | "faq" | "testimonials" | "about" | "categories" | "footer" | "audit";

const TABS: { id: Tab; label: string; icon: typeof Home }[] = [
  { id: "orders", label: "Pesanan", icon: Package },
  { id: "hero", label: "Hero", icon: Home },
  { id: "promo", label: "Promo", icon: Sparkles },
  { id: "contact", label: "Kontak", icon: Phone },
  { id: "faq", label: "FAQ", icon: HelpCircle },
  { id: "testimonials", label: "Testimoni", icon: MessageSquare },
  { id: "about", label: "Tentang", icon: Users },
  { id: "categories", label: "Kategori", icon: Layers },
  { id: "footer", label: "Footer", icon: PanelBottom },
  { id: "audit", label: "Audit Log", icon: ScrollText },
];

interface AdminOverlayProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AdminOverlay({ open, onOpenChange }: AdminOverlayProps) {
  // Lazy init: read token from sessionStorage on client, false on SSR.
  const [authed, setAuthed] = useState(() => !!getAdminToken());
  // mounted: false on SSR, true on client. Used to skip rendering
  // during hydration (avoid flash of login form when token exists).
  const [mounted] = useState(() => typeof window !== "undefined");
  const [activeTab, setActiveTab] = useState<Tab>("orders");

  // Keyboard shortcut: Ctrl+Shift+A toggles admin
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === "A") {
        e.preventDefault();
        onOpenChange(!open);
      }
      if (e.key === "Escape" && open) {
        onOpenChange(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onOpenChange]);

  const handleLogout = () => {
    clearAdminToken();
    setAuthed(false);
    toast.success("Logged out dari admin");
  };

  // Don't render anything until mounted (avoid hydration flash)
  if (!mounted || !open) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-[100] bg-background"
        role="dialog"
        aria-label="Admin dashboard"
        aria-modal="true"
      >
        {!authed ? (
          <LoginGate
            onSuccess={() => setAuthed(true)}
            onClose={() => onOpenChange(false)}
          />
        ) : (
          <div className="flex h-full flex-col">
            {/* Top bar */}
            <header className="flex items-center justify-between border-b border-border bg-secondary/50 px-4 py-3">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground text-sm font-bold">
                  S
                </div>
                <div>
                  <h1 className="text-sm font-bold leading-tight">SayurBox Admin</h1>
                  <p className="text-[10px] text-muted-foreground leading-tight">
                    Content Management
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => window.location.reload()}
                  className="h-8 text-xs"
                  title="Reload halaman untuk lihat perubahan"
                >
                  🔄 Preview
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="h-8 text-xs"
                >
                  <LogOut className="h-3.5 w-3.5 mr-1" />
                  Logout
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onOpenChange(false)}
                  className="h-8 w-8"
                  aria-label="Tutup admin"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </header>

            {/* Body: sidebar + content */}
            <div className="flex flex-1 overflow-hidden">
              {/* Sidebar */}
              <nav className="w-16 md:w-48 shrink-0 border-r border-border bg-secondary/30 overflow-y-auto scrollbar-grocery">
                <ul className="p-2 space-y-1">
                  {TABS.map((tab) => (
                    <li key={tab.id}>
                      <button
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-xs font-medium transition-colors ${
                          activeTab === tab.id
                            ? "bg-primary text-primary-foreground"
                            : "text-foreground hover:bg-accent"
                        }`}
                        aria-current={activeTab === tab.id ? "page" : undefined}
                      >
                        <tab.icon className="h-4 w-4 shrink-0" />
                        <span className="hidden md:inline">{tab.label}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </nav>

              {/* Content area */}
              <div className="flex-1 overflow-y-auto scrollbar-grocery p-4 md:p-6">
                <div className="mx-auto max-w-3xl">
                  {activeTab === "orders" && <OrderEditor />}
                  {activeTab === "hero" && <HeroPromoContactEditor section="hero" />}
                  {activeTab === "promo" && <HeroPromoContactEditor section="promo" />}
                  {activeTab === "contact" && <HeroPromoContactEditor section="contact" />}
                  {activeTab === "faq" && <FaqEditor />}
                  {activeTab === "testimonials" && <TestimonialEditor />}
                  {activeTab === "about" && <AboutEditor />}
                  {activeTab === "categories" && <CategoryEditor />}
                  {activeTab === "footer" && <FooterEditor />}
                  {activeTab === "audit" && <AuditLogViewer />}
                </div>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}

// ============================================================
// LoginGate — password form
// ============================================================
function LoginGate({
  onSuccess,
  onClose,
}: {
  onSuccess: () => void;
  onClose: () => void;
}) {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) {
      setError("Password diperlukan");
      return;
    }
    setLoading(true);
    setError("");
    const result = await loginAdmin(password);
    setLoading(false);
    if (result.success) {
      onSuccess();
      toast.success("Login berhasil!");
    } else {
      setError(result.message || "Password salah");
    }
  };

  return (
    <div className="flex min-h-full items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-sm rounded-2xl border border-border bg-card p-6 shadow-2xl"
      >
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <Lock className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold">Admin Login</h2>
              <p className="text-xs text-muted-foreground">SayurBox Content Manager</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground"
            aria-label="Tutup"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="space-y-1.5">
            <Label htmlFor="admin-password" className="text-xs font-medium">
              Password Admin
            </Label>
            <Input
              id="admin-password"
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (error) setError("");
              }}
              placeholder="Masukkan password..."
              disabled={loading}
              autoFocus
              aria-invalid={!!error}
            />
          </div>

          {error && (
            <p className="flex items-center gap-1 text-xs text-destructive" role="alert">
              <AlertCircle className="h-3 w-3" />
              {error}
            </p>
          )}

          <Button
            type="submit"
            disabled={loading}
            className="w-full h-10 rounded-lg"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Memverifikasi...
              </>
            ) : (
              <>
                <Lock className="h-4 w-4 mr-2" />
                Masuk
              </>
            )}
          </Button>
        </form>

        <p className="mt-4 text-center text-[10px] text-muted-foreground">
          💡 Hint: Tekan <kbd className="rounded bg-secondary px-1">Ctrl+Shift+A</kbd> untuk buka admin
        </p>
      </motion.div>
    </div>
  );
}
