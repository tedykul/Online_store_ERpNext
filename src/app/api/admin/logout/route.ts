import { NextResponse } from "next/server";
import { verifyAuth } from "@/lib/admin-auth";
import { logAdminAction } from "@/lib/audit";

export const dynamic = "force-dynamic";

// POST /api/admin/logout — audit log logout (best-effort).
// The actual session invalidation happens client-side (clears token
// from sessionStorage). NextAuth JWT session can be invalidated
// server-side via signOut() on the client, which is also best-effort.
export async function POST() {
  const auth = await verifyAuth();
  if (auth) {
    await logAdminAction({
      action: "logout",
      target: `logout:${auth.email}`,
      success: true,
      userId: auth.userId || undefined,
      userEmail: auth.email,
    });
  }
  return NextResponse.json({ success: true });
}
