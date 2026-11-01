"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Loader2, MapPin, Bike, Navigation } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { formatIDR } from "@/lib/mock-data";

// ============================================================
// GojekShippingCalculator — address autocomplete + shipping calc.
// ============================================================
// Uses Google Places Autocomplete (loaded via script tag) for
// address input. When customer selects an address, gets lat/lng
// → calls /api/delivery/calculate-shipping → shows fee.
//
// The API key is fetched from /api/admin/delivery/maps-settings
// (public endpoint returns apiKey for client-side Places API).
// ============================================================

interface GojekShippingCalculatorProps {
  onShippingChange: (fee: number, distanceKm: number, address: string) => void;
}

declare global {
  interface Window {
    google: any;
  }
}

let scriptLoaded = false;
let scriptLoading = false;

function loadGoogleMapsScript(apiKey: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (scriptLoaded && window.google?.maps?.places) {
      resolve();
      return;
    }
    if (scriptLoading) {
      // Wait for existing script to load
      const check = setInterval(() => {
        if (scriptLoaded && window.google?.maps?.places) {
          clearInterval(check);
          resolve();
        }
      }, 100);
      return;
    }
    scriptLoading = true;
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&callback=initMapAutocomplete`;
    script.async = true;
    script.defer = true;

    window.initMapAutocomplete = () => {
      scriptLoaded = true;
      scriptLoading = false;
      resolve();
    };

    script.onerror = () => {
      scriptLoading = false;
      reject(new Error("Failed to load Google Maps"));
    };

    document.head.appendChild(script);
  });
}

export function GojekShippingCalculator({ onShippingChange }: GojekShippingCalculatorProps) {
  const [apiKey, setApiKey] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [calculating, setCalculating] = useState(false);
  const [address, setAddress] = useState("");
  const [fee, setFee] = useState<number | null>(null);
  const [distanceKm, setDistanceKm] = useState<number | null>(null);
  const [durationMin, setDurationMin] = useState<number | null>(null);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<any>(null);
  const placeRef = useRef<any>(null);

  // Fetch API key + check if configured
  useEffect(() => {
    fetch("/api/delivery/maps-public")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data?.apiKey) {
          setApiKey(data.apiKey);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // Initialize Places Autocomplete when API key available + input ready
  useEffect(() => {
    if (!apiKey || !inputRef.current) return;

    let cancelled = false;

    loadGoogleMapsScript(apiKey)
      .then(() => {
        if (cancelled || !inputRef.current || !window.google?.maps?.places) return;

        autocompleteRef.current = new window.google.maps.places.Autocomplete(inputRef.current, {
          types: ["geocode"],
          componentRestrictions: { country: "id" }, // Indonesia only
          fields: ["formatted_address", "geometry", "name"],
        });

        autocompleteRef.current.addListener("place_changed", () => {
          const place = autocompleteRef.current.getPlace();
          if (!place?.geometry?.location) {
            setError("Pilih alamat dari daftar saran");
            return;
          }

          placeRef.current = place;
          setAddress(place.formatted_address || place.name || "");
          setError("");

          const lat = place.geometry.location.lat();
          const lng = place.geometry.location.lng();

          // Calculate shipping
          setCalculating(true);
          fetch("/api/delivery/calculate-shipping", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ lat, lng }),
          })
            .then((r) => r.json())
            .then((data) => {
              if (data.success) {
                setFee(data.fee);
                setDistanceKm(data.distanceKm);
                setDurationMin(data.durationMin);
                onShippingChange(data.fee, data.distanceKm, place.formatted_address || "");
              } else {
                setError(data.message || "Gagal menghitung ongkir");
                setFee(null);
                onShippingChange(0, 0, "");
              }
            })
            .catch(() => {
              setError("Koneksi gagal");
              setFee(null);
            })
            .finally(() => setCalculating(false));
        });
      })
      .catch(() => {
        if (!cancelled) setError("Gagal memuat Google Maps");
      });

    return () => {
      cancelled = true;
    };
  }, [apiKey, onShippingChange]);

  // Reset
  const handleReset = useCallback(() => {
    setAddress("");
    setFee(null);
    setDistanceKm(null);
    setDurationMin(null);
    setError("");
    onShippingChange(0, 0, "");
    if (inputRef.current) inputRef.current.value = "";
  }, [onShippingChange]);

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-xs text-muted-foreground py-2">
        <Loader2 className="h-3.5 w-3.5 animate-spin" /> Memuat...
      </div>
    );
  }

  if (!apiKey) {
    return (
      <div className="rounded-lg bg-amber-500/5 p-2.5 ring-1 ring-amber-500/20">
        <p className="text-[10px] text-muted-foreground">
          ⚠️ Google Maps belum dikonfigurasi. Ongkir dibayar ke kurir langsung.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <Label className="text-[11px] font-medium text-muted-foreground flex items-center gap-1.5">
        <MapPin className="h-3 w-3" /> Alamat Pengiriman Gojek
      </Label>
      <div className="relative">
        <Input
          ref={inputRef}
          type="text"
          placeholder="Ketik alamat lengkap (mis: Jl. Urip Sumoharjo No. 12)"
          className="h-9 text-xs pl-8"
          disabled={calculating}
          onChange={(e) => {
            setAddress(e.target.value);
            if (fee !== null) {
              setFee(null);
              setDistanceKm(null);
              onShippingChange(0, 0, "");
            }
          }}
        />
        <MapPin className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground pointer-events-none" />
        {calculating && (
          <Loader2 className="absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 animate-spin text-primary" />
        )}
      </div>

      {error && <p className="text-[10px] text-destructive">{error}</p>}

      {fee !== null && distanceKm !== null && (
        <div className="rounded-lg bg-emerald-500/5 p-2.5 ring-1 ring-emerald-500/20 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-muted-foreground flex items-center gap-1">
              <Navigation className="h-3 w-3" /> Jarak: {distanceKm} km
              {durationMin ? ` · ~${durationMin} menit` : ""}
            </span>
            <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
              {formatIDR(fee)}
            </span>
          </div>
          <p className="text-[9px] text-muted-foreground">
            🛵 Estimasi ongkir berdasarkan jarak. Dibayar saat checkout.
          </p>
        </div>
      )}
    </div>
  );
}
