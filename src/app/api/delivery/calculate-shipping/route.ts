import { NextRequest, NextResponse } from "next/server";
import { calculateGojekShipping, getMapsSettings } from "@/lib/google-maps";

export const dynamic = "force-dynamic";

// ============================================================
// POST /api/delivery/calculate-shipping
// ============================================================
// Body: { address: string } OR { lat: number, lng: number }
// 
// If address provided: server-side geocode via Google Geocoding
// API → get lat/lng → calculate distance + fee.
// If lat/lng provided: skip geocoding, direct distance calc.
//
// Returns: { success, fee, distanceKm, durationMin, error? }
// ============================================================

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const settings = await getMapsSettings();

    if (!settings.configured) {
      return NextResponse.json(
        { success: false, message: "Google Maps belum dikonfigurasi. Hubungi admin." },
        { status: 503 }
      );
    }

    let lat: number;
    let lng: number;

    // If lat/lng provided directly, use them
    if (typeof body.lat === "number" && typeof body.lng === "number") {
      lat = body.lat;
      lng = body.lng;
    } else if (typeof body.address === "string" && body.address.trim()) {
      // Geocode address server-side
      const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(body.address)}&components=country:ID&key=${settings.apiKey}`;
      
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 8000);
      const geoRes = await fetch(geocodeUrl, { signal: controller.signal });
      clearTimeout(timeout);

      if (!geoRes.ok) {
        return NextResponse.json(
          { success: false, message: "Gagal mencari alamat." },
          { status: 400 }
        );
      }

      const geoData = await geoRes.json();
      if (geoData.status !== "OK" || !geoData.results?.[0]?.geometry?.location) {
        return NextResponse.json(
          { success: false, message: "Alamat tidak ditemukan. Coba ketik lebih lengkap." },
          { status: 400 }
        );
      }

      lat = geoData.results[0].geometry.location.lat;
      lng = geoData.results[0].geometry.location.lng;
    } else {
      return NextResponse.json(
        { success: false, message: "Alamat atau koordinat diperlukan." },
        { status: 400 }
      );
    }

    // Calculate distance + fee
    const result = await calculateGojekShipping(lat, lng);

    if (result.error) {
      return NextResponse.json({ success: false, message: result.error }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      fee: result.fee,
      distanceKm: result.distanceKm,
      durationMin: result.durationMin,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: "Server error." }, { status: 500 });
  }
}
