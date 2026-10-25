import { headers } from "next/headers";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// ============================================================
// Admin auth — NextAuth session + password gate fallback.
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
  method: "nextauth" | "password_gate";
}

export async function verifyAuth(): Promise<AuthResult | null> {
  // 1. Try NextAuth session
  try {
    const session = await getServerSession(authOptions);
    if (session?.user?.email) {
      return {
        userId: session.user.id || "",
        email: session.user.email,
        name: session.user.name,
        role: (session.user as { role?: string }).role || "viewer",
        method: "nextauth",
      };
    }
  } catch (err) {
    console.error("[admin-auth] NextAuth session check failed:", err);
  }

  // 2. Fallback: password gate (Bearer token = ADMIN_PASSWORD)
  if (ADMIN_PASSWORD) {
    const headersList = await headers();
    const auth = headersList.get("authorization") || "";
    if (auth.startsWith("Bearer ")) {
      const token = auth.slice(7).trim();
      if (safeCompare(token, ADMIN_PASSWORD)) {
        return {
          userId: "",
          email: "admin@password-gate",
          role: "admin",
          method: "password_gate" as const,
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

export function verifyPassword(password: string): boolean {
  if (!ADMIN_PASSWORD) {
    console.error("[admin-auth] ADMIN_PASSWORD env var not set");
    return false;
  }
  return safeCompare(password, ADMIN_PASSWORD);
}
