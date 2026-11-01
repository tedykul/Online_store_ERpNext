import { NextRequest, NextResponse } from "next/server";
import { calculateGojekShipping } from "@/lib/google-maps";

export const dynamic = "force-dynamic";

// ============================================================
// POST /api/delivery/calculate-shipping
// ============================================================
// Body: { lat, lng }
// Returns: { success, fee, distanceKm, durationMin, error? }
// ============================================================

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const lat = typeof body.lat === "number" ? body.lat : parseFloat(body.lat);
    const lng = typeof body.lng === "number" ? body.lng : parseFloat(body.lng);

    if (isNaN(lat) || isNaN(lng)) {
      return NextResponse.json(
        { success: false, message: "Koordinat tidak valid." },
        { status: 400 }
      );
    }

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
