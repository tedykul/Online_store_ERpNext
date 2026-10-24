import { headers } from "next/headers";

// ============================================================
// Admin auth — simple password gate via Bearer token.
// ============================================================
// Pattern: client sends password as `Authorization: Bearer <password>`.
// Server compares to ADMIN_PASSWORD env var using constant-time compare
// to prevent timing attacks. Returns true if match.
//
// This is intentionally simple — suitable for internal admin tools
// with trusted users. For public-facing admin, upgrade to NextAuth.js
// (separate sprint).
// ============================================================

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "";

/** Constant-time string comparison to prevent timing attacks. */
function safeCompare(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}

/**
 * Verify admin password from Authorization header.
 * Returns true if valid, false otherwise.
 * Reads `Authorization: Bearer <password>` from request headers.
 */
export async function verifyAdmin(): Promise<boolean> {
  if (!ADMIN_PASSWORD) {
    console.error("[admin-auth] ADMIN_PASSWORD env var not set");
    return false;
  }
  const headersList = await headers();
  const auth = headersList.get("authorization") || "";
  if (!auth.startsWith("Bearer ")) return false;
  const token = auth.slice(7).trim();
  return safeCompare(token, ADMIN_PASSWORD);
}

/**
 * Verify admin password from a plain string (for login endpoint).
 * Used by POST /api/admin/login which receives password in body.
 */
export function verifyPassword(password: string): boolean {
  if (!ADMIN_PASSWORD) {
    console.error("[admin-auth] ADMIN_PASSWORD env var not set");
    return false;
  }
  return safeCompare(password, ADMIN_PASSWORD);
}
