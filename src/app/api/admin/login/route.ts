import { NextRequest, NextResponse } from "next/server";
import { verifyPassword } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

// POST /api/admin/login
// Body: { password: string }
// Returns 200 if correct, 401 if wrong.
export async function POST(req: NextRequest) {
  try {
    const { password } = await req.json();
    if (!password || typeof password !== "string") {
      return NextResponse.json(
        { success: false, message: "Password diperlukan." },
        { status: 400 }
      );
    }
    if (verifyPassword(password)) {
      return NextResponse.json({ success: true, message: "Login berhasil." });
    }
    return NextResponse.json(
      { success: false, message: "Password salah." },
      { status: 401 }
    );
  } catch {
    return NextResponse.json(
      { success: false, message: "Request tidak valid." },
      { status: 400 }
    );
  }
}
