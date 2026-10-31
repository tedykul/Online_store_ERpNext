import { NextRequest, NextResponse } from "next/server";
import { getErpConfig } from "@/lib/integration-config";

// ============================================================
// ERPNext Image Proxy
// ============================================================
// Proxies images stored in ERPNext's /files/ folder so they can
// be served on the SayurLogi storefront (same-origin, no CORS).
//
// Reads ERPNext config (URL + API key + secret) from DB
// (IntegrationConfig table) — same source as the admin panel
// settings, NOT from .env. This ensures the proxy works whether
// ERPNext was configured via admin UI or env vars.
//
// Browser caches the response for 30 days (immutable), so the
// first load per image = 1 proxy request; subsequent loads are
// served from browser cache.
// ============================================================

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path: segments } = await params;
  if (!segments || segments.length === 0) {
    return new NextResponse("Not found", { status: 404 });
  }

  const imagePath = segments.join("/");

  // Read ERPNext config from DB (admin panel config), not env
  const config = await getErpConfig();
  if (!config.url) {
    return new NextResponse("ERPNext not configured", { status: 503 });
  }

  // Build ERPNext file URL
  const erpBaseUrl = config.url.replace(/\/$/, "");
  const erpUrl = `${erpBaseUrl}/files/${imagePath}`;

  try {
    const res = await fetch(erpUrl, {
      headers: {
        Authorization: `token ${config.apiKey}:${config.apiSecret}`,
        Accept: "image/*",
      },
      // 10s timeout — image fetch shouldn't block too long
      signal: AbortSignal.timeout(10000),
    });

    if (!res.ok) {
      console.error(`[erp-image] fetch failed: ${res.status} for ${erpUrl}`);
      return new NextResponse("Image not found", { status: 404 });
    }

    const contentType = res.headers.get("content-type") || "image/png";
    const buffer = await res.arrayBuffer();

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=2592000, immutable", // 30 days
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (err: any) {
    console.error("[erp-image] error:", err.message);
    return new NextResponse("Error fetching image", { status: 500 });
  }
}
