import { NextRequest, NextResponse } from "next/server";

// ============================================================
// ERPNext Image Proxy
// ============================================================
// Proxies images stored in ERPNext's /files/ folder so they can
// be served on the SayurLogi storefront (same-origin, no CORS).
//
// ERPNext stores uploaded files in:
//   - public/files/  (is_private=0, accessible without auth)
//   - private/files/ (is_private=1, requires auth)
//
// We pass auth token anyway so both public + private work.
//
// Browser caches the response for 30 days (immutable), so the
// first load per image = 1 proxy request; subsequent loads are
// served from browser cache.
// ============================================================

export const dynamic = "force-dynamic";
export const revalidate = 0;

const ERP_URL = process.env.ERPNEXT_URL || "";
const API_KEY = process.env.ERPNEXT_API_KEY || "";
const API_SECRET = process.env.ERPNEXT_API_SECRET || "";

export async function GET(
  _req: NextRequest,
  { params }: { params: { path: string[] } }
) {
  const segments = params.path || [];
  if (segments.length === 0) {
    return new NextResponse("Not found", { status: 404 });
  }

  const imagePath = segments.join("/");
  const erpUrl = `${ERP_URL}/files/${imagePath}`;

  try {
    const res = await fetch(erpUrl, {
      headers: {
        Authorization: `token ${API_KEY}:${API_SECRET}`,
        Accept: "image/*",
      },
    });

    if (!res.ok) {
      return new NextResponse("Image not found", { status: 404 });
    }

    const contentType =
      res.headers.get("content-type") || "image/png";
    const buffer = await res.arrayBuffer();

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=2592000, immutable", // 30 days
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch {
    return new NextResponse("Error fetching image", { status: 500 });
  }
}
