import { db } from "@/lib/db";
import crypto from "crypto";

// ============================================================
// Integration Config — DB-backed settings with env fallback.
// ============================================================
// Stores ERPNext connection settings in DB so they can be
// edited via admin UI without restarting the server.
//
// Priority: DB > env vars > empty
// Secrets (isSecret=true) are encrypted with AES-256-CBC.
// Encryption key: INTEGRATION_ENCRYPTION_KEY env var
//   (fallback: derived from NEXTAUTH_SECRET for dev convenience)
//
// In-memory cache: loaded once, refreshed on save.
// ============================================================

const ENCRYPTION_KEY =
  process.env.INTEGRATION_ENCRYPTION_KEY ||
  process.env.NEXTAUTH_SECRET ||
  "dev-encryption-key-change-in-production-32b";

// Pad/truncate key to 32 bytes for AES-256
function getKey(): Buffer {
  return crypto.createHash("sha256").update(ENCRYPTION_KEY).digest();
}

export function encrypt(text: string): string {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv("aes-256-cbc", getKey(), iv);
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");
  return iv.toString("hex") + ":" + encrypted;
}

export function decrypt(encryptedText: string): string {
  try {
    const [ivHex, encrypted] = encryptedText.split(":");
    if (!ivHex || !encrypted) return encryptedText; // not encrypted (plain text fallback)
    const iv = Buffer.from(ivHex, "hex");
    const decipher = crypto.createDecipheriv("aes-256-cbc", getKey(), iv);
    let decrypted = decipher.update(encrypted, "hex", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
  } catch {
    return encryptedText; // return as-is if decryption fails
  }
}

export interface ErpConfig {
  url: string;
  apiKey: string;
  apiSecret: string;
  site: string;
  warehouse: string;
  company: string;
}

// Default config keys
export const ERP_KEYS = {
  URL: "erpnext_url",
  API_KEY: "erpnext_api_key",
  API_SECRET: "erpnext_api_secret",
  SITE: "erpnext_site",
  WAREHOUSE: "erpnext_warehouse",
  COMPANY: "erpnext_company",
} as const;

const SECRET_KEYS = new Set([ERP_KEYS.API_SECRET]);

// In-memory cache
let cachedConfig: ErpConfig | null = null;
let cacheLoaded = false;

/**
 * Get ERPNext config from DB (with env fallback).
 * Uses in-memory cache for sync access after first load.
 * Call refreshConfig() after saving new config.
 */
export function getErpConfig(): ErpConfig {
  if (cacheLoaded && cachedConfig) {
    return cachedConfig;
  }
  // Return env-based config as fallback (sync, for first call before cache loads)
  return {
    url: process.env.ERPNEXT_URL || "",
    apiKey: process.env.ERPNEXT_API_KEY || "",
    apiSecret: process.env.ERPNEXT_API_SECRET || "",
    site: process.env.ERPNEXT_SITE || "",
    warehouse: process.env.ERPNEXT_WAREHOUSE || "Stores - S",
    company: process.env.ERPNEXT_COMPANY || "SayurLogi",
  };
}

/**
 * Load config from DB into cache (async, call on startup or after save).
 * Falls back to env vars if DB is empty.
 */
export async function loadErpConfig(): Promise<ErpConfig> {
  try {
    const rows = await db.integrationConfig.findMany();
    const configMap: Record<string, string> = {};
    rows.forEach((row) => {
      configMap[row.key] = row.isSecret ? decrypt(row.value) : row.value;
    });

    cachedConfig = {
      url: configMap[ERP_KEYS.URL] || process.env.ERPNEXT_URL || "",
      apiKey: configMap[ERP_KEYS.API_KEY] || process.env.ERPNEXT_API_KEY || "",
      apiSecret: configMap[ERP_KEYS.API_SECRET] || process.env.ERPNEXT_API_SECRET || "",
      site: configMap[ERP_KEYS.SITE] || process.env.ERPNEXT_SITE || "",
      warehouse: configMap[ERP_KEYS.WAREHOUSE] || process.env.ERPNEXT_WAREHOUSE || "Stores - S",
      company: configMap[ERP_KEYS.COMPANY] || process.env.ERPNEXT_COMPANY || "SayurLogi",
    };
    cacheLoaded = true;
    return cachedConfig;
  } catch (err) {
    console.warn("[integration-config] Failed to load from DB, using env:", err);
    // Fallback to env
    cachedConfig = {
      url: process.env.ERPNEXT_URL || "",
      apiKey: process.env.ERPNEXT_API_KEY || "",
      apiSecret: process.env.ERPNEXT_API_SECRET || "",
      site: process.env.ERPNEXT_SITE || "",
      warehouse: process.env.ERPNEXT_WAREHOUSE || "Stores - S",
      company: process.env.ERPNEXT_COMPANY || "SayurLogi",
    };
    cacheLoaded = true;
    return cachedConfig;
  }
}

/**
 * Refresh cache (call after saving new config).
 */
export async function refreshConfig(): Promise<ErpConfig> {
  cacheLoaded = false;
  return loadErpConfig();
}

/**
 * Save a config value to DB.
 * If isSecret, encrypts the value before saving.
 */
export async function setConfigValue(key: string, value: string, isSecret = false): Promise<void> {
  const storedValue = isSecret ? encrypt(value) : value;
  await db.integrationConfig.upsert({
    where: { key },
    create: { key, value: storedValue, isSecret },
    update: { value: storedValue, isSecret },
  });
}

/**
 * Get all config values for display (masks secrets).
 */
export async function getAllConfigForDisplay(): Promise<Record<string, { value: string; isSecret: boolean }>> {
  const rows = await db.integrationConfig.findMany();
  const result: Record<string, { value: string; isSecret: boolean }> = {};
  rows.forEach((row) => {
    result[row.key] = {
      value: row.isSecret ? decrypt(row.value) : row.value,
      isSecret: row.isSecret,
    };
  });
  return result;
}

/**
 * Check if ERPNext is configured (has URL + API key + API secret).
 */
export function isConfigured(): boolean {
  const c = getErpConfig();
  return Boolean(c.url && c.apiKey && c.apiSecret);
}
