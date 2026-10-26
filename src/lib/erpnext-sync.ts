import { db } from "@/lib/db";
import { fetchProducts, isErpnextConfigured } from "@/lib/erpnext";

// ============================================================
// ERPNext sync — pull products from ERPNext into the local DB.
// ============================================================
// This is a one-way sync (ERPNext → local DB). It creates or
// updates Product rows keyed by itemCode. Existing rows keep
// their admin-edited fields (organic, onSale, tags, benefits,
// storageTip, origin, published, order) — only ERPNext-sourced
// fields (name, description, category, price, unit, stock, image)
// are overwritten.
//
// downloadImage: optional helper used by the upload route when
// importing product photos from ERPNext URLs.
// ============================================================

export interface SyncResult {
  source: "erpnext" | "mock" | "unknown";
  synced: number;
  total: number;
  message: string;
  lastSyncAt: Date | null;
}

/**
 * Sync all products from ERPNext into local DB.
 * - If ERPNext not configured → fall back to mock, but still upsert
 *   mock products into DB so admin can edit them.
 * - If ERPNext configured but unreachable → fetchProducts returns
 *   mock data (handled in erpnext.ts).
 */
export async function syncAllFromErpnext(): Promise<SyncResult> {
  const configured = isErpnextConfigured();
  const source: "erpnext" | "mock" | "unknown" = configured
    ? "erpnext"
    : "mock";

  try {
    const { products, source: fetchedSource } = await fetchProducts();
    let synced = 0;
    for (const p of products) {
      if (!p.itemCode) continue;
      // ERPNext-sourced fields to upsert.
      const erpData = {
        name: p.name,
        description: p.description || "",
        category: p.category || "Lainnya",
        price: p.price || 0,
        oldPrice: p.oldPrice ?? null,
        unit: p.unit || "pcs",
        stock: p.stock ?? 0,
        emoji: p.emoji || "🛒",
        image: p.image || null,
        erpSyncedAt: new Date(),
      };
      await db.product.upsert({
        where: { itemCode: p.itemCode },
        create: {
          itemCode: p.itemCode,
          ...erpData,
          // New products default to published=true so the sync result
          // is immediately visible on the storefront.
          published: true,
        },
        update: erpData,
      });
      synced++;
    }

    return {
      source: fetchedSource === "erpnext" ? "erpnext" : source,
      synced,
      total: products.length,
      message:
        synced > 0
          ? `${synced} produk tersinkron dari ${
              fetchedSource === "erpnext" ? "ERPNext" : "mock data"
            }`
          : "Tidak ada produk untuk disinkron",
      lastSyncAt: new Date(),
    };
  } catch (err) {
    console.error("[erpnext-sync] syncAllFromErpnext failed:", err);
    return {
      source,
      synced: 0,
      total: 0,
      message: `Sync gagal: ${err instanceof Error ? err.message : "unknown error"}`,
      lastSyncAt: null,
    };
  }
}

/**
 * Sync a single ERPNext item by itemCode. Useful for on-demand
 * refresh of one product without re-syncing the whole catalog.
 */
export async function syncSingleItem(itemCode: string): Promise<{
  ok: boolean;
  message: string;
}> {
  try {
    const { products } = await fetchProducts();
    const match = products.find((p) => p.itemCode === itemCode);
    if (!match) {
      return { ok: false, message: `Item ${itemCode} tidak ditemukan di ERPNext` };
    }
    await db.product.upsert({
      where: { itemCode: match.itemCode },
      create: {
        itemCode: match.itemCode,
        name: match.name,
        description: match.description || "",
        category: match.category || "Lainnya",
        price: match.price || 0,
        unit: match.unit || "pcs",
        stock: match.stock ?? 0,
        emoji: match.emoji || "🛒",
        image: match.image || null,
        published: true,
        erpSyncedAt: new Date(),
      },
      update: {
        name: match.name,
        description: match.description || "",
        category: match.category || "Lainnya",
        price: match.price || 0,
        unit: match.unit || "pcs",
        stock: match.stock ?? 0,
        emoji: match.emoji || "🛒",
        image: match.image || null,
        erpSyncedAt: new Date(),
      },
    });
    return { ok: true, message: `${itemCode} tersinkron` };
  } catch (err) {
    return {
      ok: false,
      message: `Sync gagal: ${err instanceof Error ? err.message : "unknown error"}`,
    };
  }
}

/**
 * Download an image from a URL and return it as a Buffer.
 * Used when migrating ERPNext-hosted product photos into /public.
 */
export async function downloadImage(url: string): Promise<Buffer> {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Download gagal: ${res.status} ${res.statusText}`);
  }
  const arrayBuffer = await res.arrayBuffer();
  return Buffer.from(arrayBuffer);
}
