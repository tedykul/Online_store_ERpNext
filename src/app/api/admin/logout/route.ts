import { NextResponse } from "next/server";
import { verifyAuth } from "@/lib/admin-auth";
import { logAdminAction } from "@/lib/audit";
import {
  readSessionToken,
  destroySessionByToken,
  clearSessionCookieOnResponse,
} from "@/lib/session";

export const dynamic = "force-dynamic";

// ============================================================
// POST /api/admin/logout
// ============================================================
// Destroys the server-side Session row (by cookie token) and
// clears the admin_session cookie. Best-effort audit log. The
// client also clears its own state on success.
// ============================================================

export async function POST() {
  const auth = await verifyAuth();
  const token = await readSessionToken();

  if (auth) {
    await logAdminAction({
      action: "logout",
      target: `logout:${auth.email}`,
      success: true,
      userId: auth.userId || undefined,
      userEmail: auth.email,
    });
  }

  if (token) {
    await destroySessionByToken(token);
  }

  const res = NextResponse.json({ success: true });
  clearSessionCookieOnResponse(res);
  return res;
}
