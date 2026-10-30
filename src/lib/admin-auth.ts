import { headers } from "next/headers";
import { db } from "@/lib/db";
import {
  readSessionToken,
  getSessionByToken,
} from "@/lib/session";

// ============================================================
// Admin auth — session-cookie based, with a password-gate
// fallback for dev/legacy callers.
// ============================================================
// Primary path: login route mints a Session row + sets the
// admin_session httpOnly cookie. verifyAuth() reads the cookie,
// looks up the Session, and returns the linked User's real
// id/email/role. This fixes Mode 1 (email+password login) so
// every request is identified as the actual user, with the
// correct role for the permissions matrix.
//
// Fallback: a Bearer token equal to the ADMIN_PASSWORD env var
// is still accepted for backwards compatibility (scripts, dev
// curl, etc.). It authenticates as an anonymous password-gate
// admin (role "admin", no userId).
// ============================================================

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "";

function safeCompare(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}

export interface AuthResult {
  userId: string;
  email: string;
  name?: string | null;
  role: string;
  method: "session" | "password_gate";
}

// ============================================================
// verifyAuth — the single entry point for "is this request
// authenticated, and as whom?"
// ============================================================
// 1. Read admin_session cookie → Session row → linked User.
//    Returns the real user's id/email/role (method "session").
// 2. If no cookie, fall back to Bearer ADMIN_PASSWORD env.
//    Returns anonymous admin (method "password_gate").
// 3. Otherwise null.
//
// Expired/cleaned sessions are handled inside getSessionByToken.
// ============================================================

export async function verifyAuth(): Promise<AuthResult | null> {
  // 1. Session cookie path (preferred).
  const token = await readSessionToken();
  if (token) {
    const session = await getSessionByToken(token);
    if (session) {
      // Resolve the linked User (if any) for fresh id/email/name/role.
      if (session.userId) {
        const user = await db.user.findUnique({
          where: { id: session.userId },
          select: { id: true, email: true, name: true, role: true, active: true },
        });
        if (user && user.active) {
          return {
            userId: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            method: "session",
          };
        }
        // User deleted/disabled — session is invalid. Best-effort delete.
        await db.session.delete({ where: { id: session.id } }).catch(() => {});
        return null;
      }
      // Anonymous password-gate session (legacy mode). Use snapshotted
      // email + role from the session row.
      return {
        userId: "",
        email: session.email || "admin@password-gate",
        name: null,
        role: session.role,
        method: "password_gate",
      };
    }
  }

  // 2. Bearer fallback (legacy / dev / scripts).
  if (ADMIN_PASSWORD) {
    const headersList = await headers();
    const auth = headersList.get("authorization") || "";
    if (auth.startsWith("Bearer ")) {
      const bearer = auth.slice(7).trim();
      if (safeCompare(bearer, ADMIN_PASSWORD)) {
        return {
          userId: "",
          email: "admin@password-gate",
          name: null,
          role: "admin",
          method: "password_gate",
        };
      }
    }
  }

  return null;
}

export async function verifyAdmin(): Promise<boolean> {
  const result = await verifyAuth();
  return result !== null;
}

// ============================================================
// verifyPassword — used by the login route's password-gate
// mode (email empty). Compares against the ADMIN_PASSWORD env.
// ============================================================

export function verifyPassword(password: string): boolean {
  if (!ADMIN_PASSWORD) {
    console.error("[admin-auth] ADMIN_PASSWORD env var not set");
    return false;
  }
  return safeCompare(password, ADMIN_PASSWORD);
}
