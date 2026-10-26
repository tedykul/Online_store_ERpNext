import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";
import { requirePermission, isAuthResult } from "@/lib/permissions";
import { logAdminAction } from "@/lib/audit";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

const ALLOWED_MIME = [
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/webp",
  "image/gif",
  "image/svg+xml",
];

const MAX_SIZE = 5 * 1024 * 1024; // 5MB

const EXT_BY_MIME: Record<string, string> = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
  "image/webp": "webp",
  "image/gif": "gif",
  "image/svg+xml": "svg",
};

// POST /api/admin/about/upload — upload About section image.
// Saves to public/about/{uuid}.{ext} and stores path in SiteSetting.aboutImage.
export async function POST(req: NextRequest) {
  const auth = await requirePermission("about:upload");
  if (!isAuthResult(auth)) return auth;

  try {
    const formData = await req.formData().catch(() => null);
    if (!formData) {
      return NextResponse.json(
        { success: false, message: "Form data tidak valid." },
        { status: 400 }
      );
    }
    const file = formData.get("file");
    if (!(file instanceof File)) {
      return NextResponse.json(
        { success: false, message: "File tidak ditemukan." },
        { status: 400 }
      );
    }
    if (!ALLOWED_MIME.includes(file.type)) {
      return NextResponse.json(
        {
          success: false,
          message: `Tipe file tidak didukung: ${file.type}. Gunakan PNG/JPG/WebP/GIF/SVG.`,
        },
        { status: 422 }
      );
    }
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { success: false, message: "Ukuran file melebihi 5MB." },
        { status: 413 }
      );
    }

    const ext = EXT_BY_MIME[file.type] || "png";
    const filename = `${randomUUID()}.${ext}`;
    const uploadDir = path.join(process.cwd(), "public", "about");
    await mkdir(uploadDir, { recursive: true });
    const filepath = path.join(uploadDir, filename);
    const bytes = await file.arrayBuffer();
    await writeFile(filepath, Buffer.from(bytes));

    const url = `/about/${filename}`;
    await db.siteSetting.upsert({
      where: { id: "singleton" },
      update: { aboutImage: url },
      create: { id: "singleton", aboutImage: url },
    });

    await logAdminAction({
      action: "update",
      target: `about-image:${url}`,
      success: true,
      userId: auth.userId,
      userEmail: auth.email,
    });
    return NextResponse.json({ success: true, url });
  } catch (err: any) {
    console.error("[api/admin/about/upload] POST error:", err);
    return NextResponse.json(
      { success: false, message: "Server error." },
      { status: 500 }
    );
  }
}
