import { NextRequest, NextResponse } from "next/server";
import { verifyPassword } from "@/lib/admin-auth";
import { logAdminAction } from "@/lib/audit";
import { checkRateLimit } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

// POST /api/admin/login
// Body: { password: string }
// Returns 200 if correct, 401 if wrong, 429 if rate limited.
export async function POST(req: NextRequest) {
  try {
    // Rate limit check (5 attempts per 15 min, block 24h after 20 attempts)
    const rateLimit = await checkRateLimit("admin-login");
    if (rateLimit.blocked) {
      await logAdminAction({
        action: "login_rate_limited",
        target: "login",
        success: false,
        detail: `Blocked until ${rateLimit.resetAt?.toISOString()}`,
      });
      return NextResponse.json(
        {
          success: false,
          message: "Terlalu banyak percobaan. Coba lagi nanti.",
          retryAfter: rateLimit.retryAfterSeconds,
        },
        {
          status: 429,
          headers: { "Retry-After": String(rateLimit.retryAfterSeconds) },
        }
      );
    }

    const { password } = await req.json();
    if (!password || typeof password !== "string") {
      return NextResponse.json(
        { success: false, message: "Password diperlukan." },
        { status: 400 }
      );
    }
    if (verifyPassword(password)) {
      await logAdminAction({
        action: "login_success",
        target: "login",
        success: true,
      });
      return NextResponse.json({ success: true, message: "Login berhasil." });
    }
    await logAdminAction({
      action: "login_failed",
      target: "login",
      success: false,
      detail: "Wrong password",
    });
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
