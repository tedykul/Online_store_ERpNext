// ============================================================
// Admin client helpers — session-cookie based auth.
// ============================================================
// The login route sets an httpOnly `admin_session` cookie on
// the response, so the browser sends it automatically with
// every same-origin request. adminFetch therefore does NOT
// attach any Authorization header — credentials:"include"
// (same-origin default) is enough.
//
// The only thing we keep in sessionStorage is a small flag +
// the current user object, purely for UI display (so the
// overlay can render the avatar/name without an extra round
// trip). These are NOT secrets — the cookie is the credential.
//
// Two login paths (unchanged signatures):
//   1. Email + password → /api/admin/login → returns AdminUser
//   2. Password only (empty email) → same endpoint, legacy gate
// ============================================================

const USER_KEY = "admin-user";
const AUTHED_KEY = "admin-authed";

// ============================================================
// Types
// ============================================================

export type AdminRole = "super_admin" | "admin" | "staff" | "viewer";

export interface AdminUser {
  id: string | null;
  email: string;
  name: string | null;
  role: AdminRole;
  isActive?: boolean;
  lastLoginAt?: string | null;
  createdAt?: string;
}

// ============================================================
// UI-only storage (NOT credentials). The httpOnly cookie is
// the real session token and lives only on the server side.
// ============================================================

/** Persist the current user for UI display (avatar, name, role). */
export function setAdminUser(user: AdminUser | null): void {
  if (typeof window === "undefined") return;
  try {
    if (user) {
      sessionStorage.setItem(USER_KEY, JSON.stringify(user));
      sessionStorage.setItem(AUTHED_KEY, "1");
    } else {
      sessionStorage.removeItem(USER_KEY);
      sessionStorage.removeItem(AUTHED_KEY);
    }
  } catch {
    // ignore
  }
}

/** Read the cached UI user (or null). Not authoritative —
 *  always confirm via checkAuthStatus() before trusting. */
export function getAdminUser(): AdminUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(USER_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as AdminUser;
  } catch {
    return null;
  }
}

/** Quick UI flag (no network). Use only to avoid a flash of the
 *  login form; verify with checkAuthStatus() on mount. */
export function getAdminAuthedFlag(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return sessionStorage.getItem(AUTHED_KEY) === "1";
  } catch {
    return false;
  }
}

/** Store current user id (sessionStorage) for self-protection in
 *  the user editor (prevent disabling/deleting own account). */
export function setCurrentUserId(id: string | null): void {
  if (typeof window === "undefined") return;
  try {
    if (id) sessionStorage.setItem("admin-user-id", id);
    else sessionStorage.removeItem("admin-user-id");
  } catch {
    // ignore
  }
}

export function getCurrentUserId(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return sessionStorage.getItem("admin-user-id");
  } catch {
    return null;
  }
}

// ============================================================
// Login / logout / session check
// ============================================================

/**
 * Login with email + password. The server sets the httpOnly
 * session cookie on success; we only cache the returned user
 * for UI display. Returns the AdminUser on success.
 */
export async function loginAdminNextAuth(
  email: string,
  password: string
): Promise<{ success: boolean; message: string; user?: AdminUser }> {
  try {
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email || undefined, password }),
      credentials: "include",
    });
    const data = await res.json();
    if (data.success) {
      const user = data.user as AdminUser | undefined;
      if (user) {
        setAdminUser(user);
        if (user.id) setCurrentUserId(user.id);
      }
      return { success: true, message: data.message || "Login berhasil", user };
    }
    return { success: false, message: data.message || "Login gagal" };
  } catch {
    return { success: false, message: "Koneksi gagal." };
  }
}

/**
 * Legacy login — password only (no email). Calls /api/admin/login
 * with just { password }. Kept for backward compat with the old
 * single-password admin gate.
 */
export async function loginAdminLegacy(
  password: string
): Promise<{ success: boolean; message: string; user?: AdminUser }> {
  return loginAdminNextAuth("", password);
}

/** Legacy alias kept for external callers using the old
 *  single-argument signature. Behaves like loginAdminLegacy. */
export async function loginAdmin(
  password: string
): Promise<{ success: boolean; message: string }> {
  const res = await loginAdminLegacy(password);
  return { success: res.success, message: res.message };
}

/**
 * Logout — destroy the server session + clear the cookie, then
 * wipe the UI cache. Best-effort server call (non-blocking on
 * error — the client-side clear is what matters for UX).
 */
export async function logoutAdmin(): Promise<void> {
  try {
    await fetch("/api/admin/logout", {
      method: "POST",
      credentials: "include",
    });
  } catch {
    // ignore — client-side clear is what matters
  }
  setAdminUser(null);
  setCurrentUserId(null);
}

/**
 * Check auth status via GET /api/admin/login. The httpOnly cookie
 * is sent automatically (credentials:"include"). Returns the
 * AdminUser if authenticated, null otherwise. Also refreshes the
 * cached UI user so the header stays in sync.
 */
export async function checkAuthStatus(): Promise<AdminUser | null> {
  try {
    const res = await fetch("/api/admin/login", {
      method: "GET",
      credentials: "include",
    });
    if (!res.ok) {
      setAdminUser(null);
      return null;
    }
    const data = await res.json();
    if (!data.authed || !data.user) {
      setAdminUser(null);
      return null;
    }
    const user = data.user as AdminUser;
    setAdminUser(user);
    if (user.id) setCurrentUserId(user.id);
    return user;
  } catch {
    return null;
  }
}

// ============================================================
// Fetch wrapper
// ============================================================

/**
 * Fetch wrapper for admin API routes. No Authorization header —
 * the httpOnly session cookie is sent automatically with
 * same-origin requests (credentials:"include"). Returns parsed
 * JSON. Throws Error with `status` + `message` on non-OK.
 */
export async function adminFetch<T = unknown>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...((options.headers as Record<string, string>) || {}),
  };

  const res = await fetch(url, {
    ...options,
    headers,
    credentials: "include",
  });
  const data = await res.json();
  if (!res.ok || !data.success) {
    const err = new Error(data.message || "Request failed") as Error & {
      status?: number;
    };
    err.status = res.status;
    throw err;
  }
  return data as T;
}
