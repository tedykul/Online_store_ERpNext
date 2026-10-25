import { NextRequest, NextResponse } from "next/server";
import { verifyPassword, verifyAuth } from "@/lib/admin-auth";
import { logAdminAction } from "@/lib/audit";
import { checkRateLimit } from "@/lib/rate-limit";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

interface LoginRequestBody {
  email?: unknown;
  password?: unknown;
}

export async function POST(req: NextRequest) {
  try {
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

    const body = (await req.json().catch(() => ({}))) as LoginRequestBody;
    const { email, password } = body;

    if (!password || typeof password !== "string") {
      return NextResponse.json(
        { success: false, message: "Password diperlukan." },
        { status: 400 }
      );
    }

    // Mode 1: NextAuth (email + password) — check User table with bcrypt
    if (email && typeof email === "string") {
      const normalizedEmail = email.toLowerCase().trim();
      const user = await db.user.findUnique({
        where: { email: normalizedEmail },
      });

      if (!user || !user.passwordHash || !user.active) {
        await logAdminAction({
          action: "login_failed",
          target: `login:${normalizedEmail}`,
          success: false,
          detail: user ? "Account disabled" : "User not found",
        });
        return NextResponse.json(
          { success: false, message: "Email atau password salah." },
          { status: 401 }
        );
      }

      const valid = await bcrypt.compare(password, user.passwordHash);
      if (!valid) {
        await logAdminAction({
          action: "login_failed",
          target: `login:${normalizedEmail}`,
          success: false,
          detail: "Wrong password",
        });
        return NextResponse.json(
          { success: false, message: "Email atau password salah." },
          { status: 401 }
        );
      }

      await logAdminAction({
        action: "login_success",
        target: `login:${normalizedEmail}`,
        success: true,
        userId: user.id,
        userEmail: user.email,
      });
      return NextResponse.json({
        success: true,
        message: "Login berhasil.",
        user: { id: user.id, email: user.email, name: user.name, role: user.role },
      });
    }

    // Mode 2: Password gate fallback (password only)
    if (verifyPassword(password)) {
      await logAdminAction({
        action: "login_success",
        target: "login:password-gate",
        success: true,
      });
      return NextResponse.json({ success: true, message: "Login berhasil." });
    }

    await logAdminAction({
      action: "login_failed",
      target: "login:password-gate",
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

// GET /api/admin/login — check current auth status
export async function GET() {
  const result = await verifyAuth();
  if (!result) {
    return NextResponse.json({ authed: false });
  }
  return NextResponse.json({
    authed: true,
    method: result.method,
    user: {
      id: result.userId,
      email: result.email,
      name: result.name,
      role: result.role,
    },
  });
}
