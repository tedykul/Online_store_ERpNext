import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { verifyAdmin } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

// GET /api/admin/content — read singleton site content (no auth needed
// for read since content is public anyway; but kept under /admin for
// consistency with admin UI which always sends auth header).
export async function GET() {
  try {
    const row = await db.siteSetting.findUnique({ where: { id: "singleton" } });
    return NextResponse.json({ success: true, content: row });
  } catch (err: any) {
    console.error("[api/admin/content] GET error:", err);
    return NextResponse.json(
      { success: false, message: "Server error." },
      { status: 500 }
    );
  }
}

// POST /api/admin/content — update singleton site content.
// Body: partial SiteSetting fields (only provided fields are updated).
// Requires auth.
export async function POST(req: NextRequest) {
  if (!(await verifyAdmin())) {
    return NextResponse.json(
      { success: false, message: "Unauthorized." },
      { status: 401 }
    );
  }
  try {
    const body = await req.json();
    // Whitelist allowed fields — ignore unknown keys for safety.
    const allowedFields = [
      "heroBadge", "heroTitleA", "heroTitleHighlight", "heroTitleB",
      "heroSubtitle", "heroCtaPrimary", "heroCtaSecondary",
      "promoId", "promoTitle", "promoDescription",
      "contactPhone", "contactEmail", "contactAddress", "contactHours",
      "aboutBadge", "aboutTitleA", "aboutTitleHighlight", "aboutTitleB",
      "aboutSubtitle", "aboutStoryH3", "aboutStoryP1", "aboutStoryP2",
      "aboutStat1Value", "aboutStat1Label", "aboutStat2Value", "aboutStat2Label",
      "aboutStat3Value", "aboutStat3Label", "aboutStat4Value", "aboutStat4Label",
      "aboutValue1Title", "aboutValue1Desc",
      "aboutValue2Title", "aboutValue2Desc",
      "aboutValue3Title", "aboutValue3Desc",
      "aboutValue4Title", "aboutValue4Desc",
      "footerBrandText", "footerTagline",
    ];
    const data: Record<string, string | null> = {};
    for (const key of allowedFields) {
      if (key in body) {
        const val = body[key];
        // Allow null (reset to default) or string
        data[key] = val === null || val === "" ? null : String(val);
      }
    }

    if (Object.keys(data).length === 0) {
      return NextResponse.json(
        { success: false, message: "Tidak ada field untuk diupdate." },
        { status: 400 }
      );
    }

    // Upsert: create singleton if not exists
    const updated = await db.siteSetting.upsert({
      where: { id: "singleton" },
      update: data,
      create: { id: "singleton", ...data },
    });

    return NextResponse.json({
      success: true,
      message: "Konten berhasil disimpan.",
      content: updated,
    });
  } catch (err: any) {
    console.error("[api/admin/content] POST error:", err);
    return NextResponse.json(
      { success: false, message: "Server error." },
      { status: 500 }
    );
  }
}
