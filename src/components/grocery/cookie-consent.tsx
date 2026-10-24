"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cookie } from "lucide-react";
import { Button } from "@/components/ui/button";

// ============================================================
// CookieConsent — GDPR-style cookie consent banner.
// ============================================================
// Shows on first visit. User can Accept or Decline. Choice persists
// in localStorage (key: cookie-consent-v1). Once decided, banner
// stays hidden until key changes (e.g., policy update).
//
// Mount once in root layout. No props required.
// ============================================================

const STORAGE_KEY = "cookie-consent-v1";

type ConsentChoice = "accepted" | "declined";

function readConsent(): ConsentChoice | null {
  if (typeof window === "undefined") return null;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "accepted" || stored === "declined") return stored;
    return null;
  } catch {
    return null;
  }
}

export function CookieConsent() {
  // Start with null (hidden) on SSR & first paint. After mount, read
  // localStorage to check if user already consented. This avoids
  // hydration mismatch (server & client both render null initially).
  const [choice, setChoice] = useState<ConsentChoice | null>(null);
  const [mounted, setMounted] = useState(false);

  // Sync with localStorage after mount — legitimate external system sync.
  // This is the standard SSR pattern for reading client-only storage
  // without causing hydration mismatch.
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    const stored = readConsent();
    setChoice(stored);
    setMounted(true);
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  const handleAccept = () => {
    setChoice("accepted");
    try {
      localStorage.setItem(STORAGE_KEY, "accepted");
    } catch {
      // ignore storage errors
    }
  };

  const handleDecline = () => {
    setChoice("declined");
    try {
      localStorage.setItem(STORAGE_KEY, "declined");
    } catch {
      // ignore storage errors
    }
  };

  // Show banner only after mount & if no choice made yet (null = first visit).
  // Before mount, render nothing to avoid hydration flash.
  const showBanner = mounted && choice === null;

  return (
    <AnimatePresence>
      {showBanner && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6"
          role="dialog"
          aria-label="Pemberitahuan cookie"
          aria-live="polite"
        >
          <div className="mx-auto max-w-3xl rounded-2xl border border-border/60 bg-card p-4 shadow-2xl md:p-5">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:gap-4">
              {/* Icon */}
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Cookie className="h-5 w-5" />
              </div>

              {/* Text */}
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-bold">Kami menggunakan cookie 🍪</h3>
                <p className="mt-0.5 text-xs text-muted-foreground leading-relaxed">
                  Cookie membantu kami memberikan pengalaman terbaik — menyimpan keranjang,
                  wishlist, dan preferensi. Dengan lanjut menggunakan situs ini, kamu setuju
                  dengan{" "}
                  <a
                    href="#faq"
                    onClick={(e) => {
                      e.preventDefault();
                      document.getElementById("faq")?.scrollIntoView({ behavior: "smooth" });
                    }}
                    className="font-medium text-primary hover:underline"
                  >
                    kebijakan privasi
                  </a>{" "}
                  kami.
                </p>
              </div>

              {/* Actions */}
              <div className="flex shrink-0 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDecline}
                  className="h-9 rounded-full text-xs"
                >
                  Tolak
                </Button>
                <Button
                  size="sm"
                  onClick={handleAccept}
                  className="h-9 rounded-full text-xs shadow-sm"
                >
                  Setuju
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
