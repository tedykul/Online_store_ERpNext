import { NextRequest, NextResponse } from "next/server";
import { writeFile, unlink, mkdir } from "fs/promises";
import path from "path";
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
  "image/x-icon",
  "image/vnd.microsoft.icon",
];

const MAX_SIZE = 2 * 1024 * 1024; // 2MB

const EXT_BY_MIME: Record<string, string> = {
  "image/png": "png",
  "image/jpeg": "ico", // jpeg is rare for favicon but accept
  "image/jpg": "jpg",
  "image/webp": "webp",
  "image/gif": "gif",
  "image/svg+xml": "svg",
  "image/x-icon": "ico",
  "image/vnd.microsoft.icon": "ico",
};

// POST /api/admin/favicon/upload — upload custom favicon.
// Saves to public/favicon-custom.{ext} and stores path in SiteSetting.faviconUrl.
export async function POST(req: NextRequest) {
  const auth = await requirePermission("favicon:upload");
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
          message: `Tipe file tidak didukung: ${file.type}. Gunakan ICO/PNG/SVG/GIF/WebP.`,
        },
        { status: 422 }
      );
    }
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { success: false, message: "Ukuran file melebihi 2MB." },
        { status: 413 }
      );
    }

    const ext = EXT_BY_MIME[file.type] || "ico";
    const filename = `favicon-custom.${ext}`;
    const uploadDir = path.join(process.cwd(), "public");
    await mkdir(uploadDir, { recursive: true });
    const filepath = path.join(uploadDir, filename);
    const bytes = await file.arrayBuffer();
    await writeFile(filepath, Buffer.from(bytes));

    // Clean up old favicon files with different extensions.
    for (const oldExt of ["png", "jpg", "webp", "gif", "svg", "ico"]) {
      if (oldExt === ext) continue;
      const oldPath = path.join(uploadDir, `favicon-custom.${oldExt}`);
      try {
        await unlink(oldPath);
      } catch {
        // ignore — file may not exist
      }
    }

    const url = `/${filename}`;
    await db.siteSetting.upsert({
      where: { id: "singleton" },
      update: { faviconUrl: url },
      create: { id: "singleton", faviconUrl: url },
    });

    await logAdminAction({
      action: "update",
      target: `favicon:${url}`,
      success: true,
      userId: auth.userId,
      userEmail: auth.email,
    });
    return NextResponse.json({ success: true, url });
  } catch (err: any) {
    console.error("[api/admin/favicon/upload] POST error:", err);
    return NextResponse.json(
      { success: false, message: "Server error." },
      { status: 500 }
    );
  }
}
