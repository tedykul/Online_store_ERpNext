// ============================================================
// Admin client helpers — auth token management + fetch wrapper.
// ============================================================
// Token stored in sessionStorage (cleared when tab closes — more
// secure than localStorage for admin session). All admin API calls
// go through adminFetch which auto-attaches Bearer token.
//
// Two login paths supported:
//   1. NextAuth (preferred): email + password → /api/admin/login
//      returns AdminUser + token. Used by AdminOverlay LoginGate
//      when email field is filled.
//   2. Legacy password gate (fallback): password-only → same
//      endpoint, empty email. Used when NextAuth not configured.
//
// After login, current user id is stored in sessionStorage under
// "admin-user-id" so admin sections (e.g. UserEditor) can read it
// for self-protection (prevent disabling/deleting own account).
// ============================================================

const TOKEN_KEY = "admin-token";
const USER_ID_KEY = "admin-user-id";

// ============================================================
// Types
// ============================================================

export type AdminRole = "super_admin" | "admin" | "staff";

export interface AdminUser {
  id: string;
  email: string;
  name: string | null;
  role: AdminRole;
  isActive: boolean;
  lastLoginAt: string | null;
  createdAt: string;
}

// ============================================================
// Token + user id storage (sessionStorage)
// ============================================================

/** Get stored admin password (sessionStorage). */
export function getAdminToken(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return sessionStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

/** Store admin password (sessionStorage). Cleared on tab close. */
export function setAdminToken(token: string): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(TOKEN_KEY, token);
  } catch {
    // ignore
  }
}

/** Clear admin password. */
export function clearAdminToken(): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.removeItem(TOKEN_KEY);
  } catch {
    // ignore
  }
}

/** Store current user id (sessionStorage) for self-protection. */
export function setCurrentUserId(id: string | null): void {
  if (typeof window === "undefined") return;
  try {
    if (id) sessionStorage.setItem(USER_ID_KEY, id);
    else sessionStorage.removeItem(USER_ID_KEY);
  } catch {
    // ignore
  }
}

/** Read current user id (sessionStorage) — used for self-protection. */
export function getCurrentUserId(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return sessionStorage.getItem(USER_ID_KEY);
  } catch {
    return null;
  }
}

// ============================================================
// Login / logout / session check
// ============================================================

/**
 * Login via NextAuth credentials provider.
 * Sends email + password to /api/admin/login. On success, stores
 * token + user id in sessionStorage and returns AdminUser.
 *
 * Email is optional — if empty/undefined, server treats request as
 * legacy password gate (password only). This keeps backward compat
 * with the old single-password admin.
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
    });
    const data = await res.json();
    if (data.success) {
      setAdminToken(password);
      if (data.user?.id) setCurrentUserId(data.user.id);
      return {
        success: true,
        message: data.message || "Login berhasil",
        user: data.user as AdminUser | undefined,
      };
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

/**
 * Legacy alias kept for any external callers still using the old
 * single-argument signature. Behaves identically to loginAdminLegacy.
 */
export async function loginAdmin(
  password: string
): Promise<{ success: boolean; message: string }> {
  const res = await loginAdminLegacy(password);
  return { success: res.success, message: res.message };
}

/**
 * Logout — clear token + user id from sessionStorage.
 * Optionally calls /api/admin/logout to invalidate server-side
 * session (best-effort, non-blocking).
 */
export async function logoutAdmin(): Promise<void> {
  // Fire-and-forget server logout (may 404 if route not configured)
  try {
    await fetch("/api/admin/logout", { method: "POST" });
  } catch {
    // ignore — client-side clear is what matters
  }
  clearAdminToken();
  setCurrentUserId(null);
}

/**
 * Check auth status — calls /api/admin/auth/me to validate the
 * current token and fetch the AdminUser. Returns null if not
 * authenticated (no token, 401, network error, etc.).
 *
 * Used by AdminOverlay on mount to determine if session is still
 * valid and to populate the user display in the header.
 */
export async function checkAuthStatus(): Promise<AdminUser | null> {
  const token = getAdminToken();
  if (!token) return null;
  try {
    const res = await fetch("/api/admin/login", {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) return null;
    const data = await res.json();
    if (!data.authed || !data.user) return null;
    // Keep user id fresh in sessionStorage
    if (data.user.id) setCurrentUserId(data.user.id);
    return data.user as AdminUser;
  } catch {
    return null;
  }
}

// ============================================================
// Fetch wrapper
// ============================================================

/**
 * Fetch wrapper that auto-attaches Bearer token. Returns parsed JSON.
 * Throws Error with `status` and `message` on non-OK response.
 */
export async function adminFetch<T = unknown>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getAdminToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string> || {}),
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(url, { ...options, headers });
  const data = await res.json();
  if (!res.ok || !data.success) {
    const err = new Error(data.message || "Request failed") as Error & { status?: number };
    err.status = res.status;
    throw err;
  }
  return data as T;
}
