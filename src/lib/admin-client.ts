// ============================================================
// Admin client helpers — auth token management + fetch wrapper.
// ============================================================
// Token stored in sessionStorage (cleared when tab closes — more
// secure than localStorage for admin session). All admin API calls
// go through adminFetch which auto-attaches Bearer token.
// ============================================================

const TOKEN_KEY = "admin-token";

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

/**
 * Verify password via /api/admin/login. Returns true if valid.
 * On success, stores password as token in sessionStorage.
 */
export async function loginAdmin(password: string): Promise<{ success: boolean; message: string }> {
  try {
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    const data = await res.json();
    if (data.success) {
      setAdminToken(password);
    }
    return data;
  } catch {
    return { success: false, message: "Koneksi gagal." };
  }
}

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
