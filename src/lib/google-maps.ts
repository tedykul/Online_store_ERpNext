import { db } from "@/lib/db";

// ============================================================
// Google Maps — Distance Matrix API + settings management.
// ============================================================
// Settings stored in IntegrationConfig table:
//   google_maps_api_key  — API key (encrypted)
//   store_latitude       — store lat (string)
//   store_longitude      — store lng (string)
//   gojek_base_fare      — base fare in IDR (string)
//   gojek_per_km_rate    — per km rate in IDR (string)
//
// Distance Matrix API: server-side call to Google Maps to get
// road distance between store + customer address.
// ============================================================

const KEYS = {
  API_KEY: "google_maps_api_key",
  STORE_LAT: "store_latitude",
  STORE_LNG: "store_longitude",
  BASE_FARE: "gojek_base_fare",
  PER_KM: "gojek_per_km_rate",
} as const;

export interface MapsSettings {
  apiKey: string;
  storeLat: number;
  storeLng: number;
  baseFare: number;
  perKmRate: number;
  configured: boolean;
}

// ============================================================
// getMapsSettings — read from DB (decrypt API key).
// ============================================================

export async function getMapsSettings(): Promise<MapsSettings> {
  const rows = await db.integrationConfig.findMany({
    where: { key: { in: Object.values(KEYS) } },
  });
  const map: Record<string, string> = {};
  rows.forEach((r) => {
    // API key is stored encrypted — need to decrypt
    if (r.key === KEYS.API_KEY && r.isSecret) {
      // Import decrypt from integration-config
      // We'll handle this inline since we can't import async here
      map[r.key] = r.value; // encrypted — will be decrypted below
    } else {
      map[r.key] = r.value;
    }
  });

  // Decrypt API key if encrypted
  let apiKey = map[KEYS.API_KEY] || "";
  if (apiKey && apiKey.includes(":")) {
    // It's encrypted (iv:ciphertext format) — decrypt
    const { decrypt } = await import("@/lib/integration-config");
    apiKey = decrypt(apiKey);
  }

  const storeLat = parseFloat(map[KEYS.STORE_LAT] || "");
  const storeLng = parseFloat(map[KEYS.STORE_LNG] || "");
  const baseFare = parseInt(map[KEYS.BASE_FARE] || "8000", 10);
  const perKmRate = parseInt(map[KEYS.PER_KM] || "2000", 10);

  return {
    apiKey,
    storeLat: isNaN(storeLat) ? 0 : storeLat,
    storeLng: isNaN(storeLng) ? 0 : storeLng,
    baseFare: isNaN(baseFare) ? 8000 : baseFare,
    perKmRate: isNaN(perKmRate) ? 2000 : perKmRate,
    configured: Boolean(apiKey && !isNaN(storeLat) && !isNaN(storeLng)),
  };
}

// ============================================================
// saveMapsSettings — save to DB (encrypt API key).
// ============================================================

export async function saveMapsSettings(opts: {
  apiKey?: string;
  storeLat?: number;
  storeLng?: number;
  baseFare?: number;
  perKmRate?: number;
}): Promise<void> {
  const { encrypt, setConfigValue } = await import("@/lib/integration-config");

  if (opts.apiKey !== undefined) {
    await setConfigValue(KEYS.API_KEY, opts.apiKey, true); // encrypted
  }
  if (opts.storeLat !== undefined) {
    await setConfigValue(KEYS.STORE_LAT, String(opts.storeLat));
  }
  if (opts.storeLng !== undefined) {
    await setConfigValue(KEYS.STORE_LNG, String(opts.storeLng));
  }
  if (opts.baseFare !== undefined) {
    await setConfigValue(KEYS.BASE_FARE, String(opts.baseFare));
  }
  if (opts.perKmRate !== undefined) {
    await setConfigValue(KEYS.PER_KM, String(opts.perKmRate));
  }
}

// ============================================================
// calculateDistance — Google Maps Distance Matrix API.
// ============================================================
// Takes destination lat/lng, returns distance in km + duration.
// Uses store coordinates as origin.
// ============================================================

export async function calculateDistance(destLat: number, destLng: number): Promise<{
  distanceKm: number;
  durationMin: number;
  error?: string;
}> {
  const settings = await getMapsSettings();
  if (!settings.configured) {
    return { distanceKm: 0, durationMin: 0, error: "Google Maps belum dikonfigurasi" };
  }

  const origins = `${settings.storeLat},${settings.storeLng}`;
  const destinations = `${destLat},${destLng}`;
  const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${origins}&destinations=${destinations}&key=${settings.apiKey}&units=metric&mode=driving`;

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);
    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timeout);

    if (!res.ok) {
      return { distanceKm: 0, durationMin: 0, error: `Google Maps API error: ${res.status}` };
    }

    const data = await res.json();
    if (data.status !== "OK" || !data.rows?.[0]?.elements?.[0]) {
      return { distanceKm: 0, durationMin: 0, error: "Rute tidak ditemukan" };
    }

    const element = data.rows[0].elements[0];
    if (element.status !== "OK") {
      return { distanceKm: 0, durationMin: 0, error: "Tidak dapat mencapai lokasi" };
    }

    const distanceKm = element.distance?.value ? element.distance.value / 1000 : 0;
    const durationMin = element.duration?.value ? Math.round(element.duration.value / 60) : 0;

    return { distanceKm: Math.round(distanceKm * 10) / 10, durationMin };
  } catch (err: any) {
    return { distanceKm: 0, durationMin: 0, error: err.message || "Koneksi gagal" };
  }
}

// ============================================================
// calculateGojekShipping — distance + tariff = fee.
// ============================================================

export async function calculateGojekShipping(destLat: number, destLng: number): Promise<{
  fee: number;
  distanceKm: number;
  durationMin: number;
  error?: string;
}> {
  const settings = await getMapsSettings();
  if (!settings.configured) {
    return { fee: 0, distanceKm: 0, durationMin: 0, error: "Google Maps belum dikonfigurasi" };
  }

  const { distanceKm, durationMin, error } = await calculateDistance(destLat, destLng);
  if (error) {
    return { fee: 0, distanceKm: 0, durationMin: 0, error };
  }

  const fee = settings.baseFare + Math.ceil(distanceKm) * settings.perKmRate;
  return { fee, distanceKm, durationMin };
}
