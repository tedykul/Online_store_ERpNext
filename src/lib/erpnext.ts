import type { Product, Category } from "@/types/grocery";
import { MOCK_PRODUCTS, MOCK_PRODUCTS_ENRICHED, MOCK_CATEGORIES } from "./mock-data";

// ============================================================
// ERPNext Client — talks to Frappe REST API
// ============================================================
// Env variables (set in .env.local):
//   ERPNEXT_URL      = http://192.168.1.14:8001
//   ERPNEXT_API_KEY  = <from ERPNext User > API Access>
//   ERPNEXT_API_SECRET = <from ERPNext User > API Access>
// ============================================================

const ERP_URL = process.env.ERPNEXT_URL || "";
const API_KEY = process.env.ERPNEXT_API_KEY || "";
const API_SECRET = process.env.ERPNEXT_API_SECRET || "";

/** Whether ERPNext is configured in env */
export function isErpnextConfigured(): boolean {
  return Boolean(ERP_URL && API_KEY && API_SECRET);
}

/** Auth header: token <key>:<secret> (Frappe standard) */
function authHeader(): string {
  return `token ${API_KEY}:${API_SECRET}`;
}

/** Build absolute URL for ERPNext endpoint */
function erpUrl(path: string, params?: Record<string, string | number | undefined>): string {
  const url = new URL(`${ERP_URL.replace(/\/$/, "")}${path}`);
  if (params) {
    for (const [k, v] of Object.entries(params)) {
      if (v !== undefined) url.searchParams.set(k, String(v));
    }
  }
  return url.toString();
}

/**
 * Fetch with timeout (5s) so the UI never hangs if ERPNext is offline.
 */
async function fetchWithTimeout(url: string, init: RequestInit = {}, timeoutMs = 5000) {
  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      ...init,
      signal: controller.signal,
      headers: {
        Authorization: authHeader(),
        "Content-Type": "application/json",
        Accept: "application/json",
        ...(init.headers || {}),
      },
    });
    return res;
  } finally {
    clearTimeout(t);
  }
}

// ------------------------------------------------------------
// PRODUCTS — read from ERPNext Item doctype
// ------------------------------------------------------------
export async function fetchProducts(category?: string): Promise<{
  products: Product[];
  source: "erpnext" | "mock";
}> {
  if (!isErpnextConfigured()) {
    // Mock mode — return enriched products (with rating, benefits, etc.)
    const products = category
      ? MOCK_PRODUCTS_ENRICHED.filter((p) => p.category === category)
      : MOCK_PRODUCTS_ENRICHED;
    return { products, source: "mock" };
  }

  try {
    // ERPNext Item list with filters:
    // - is_sales_item = 1
    // - disabled = 0
    // - optional item_group filter
    const filters: string[] = [["is_sales_item", "=", 1], ["disabled", "=", 0]];
    if (category) filters.push(["item_group", "=", category]);

    const url = erpUrl("/api/resource/Item", {
      fields: JSON.stringify([
        "name",
        "item_code",
        "item_name",
        "description",
        "item_group",
        "stock_uom",
        "image",
      ]),
      filters: JSON.stringify(filters),
      limit_page_length: 200,
    });

    const res = await fetchWithTimeout(url);
    if (!res.ok) throw new Error(`ERPNext ${res.status}`);
    const json = await res.json();
    const items: any[] = json.data || [];

    // Fetch price for each item (Item Price doctype)
    const products: Product[] = await Promise.all(
      items.map(async (it) => {
        const price = await fetchItemPrice(it.name);
        const stock = await fetchItemStock(it.name);
        return {
          id: it.name,
          itemCode: it.item_code || it.name,
          name: it.item_name || it.name,
          description: it.description || "",
          category: it.item_group || "Lainnya",
          price: price ?? 0,
          unit: it.stock_uom || "pcs",
          stock,
          emoji: "🛒", // ERPNext has no emoji; use generic
          image: it.image || undefined,
        };
      })
    );

    return { products, source: "erpnext" };
  } catch (err) {
    console.error("[ERPNext] fetchProducts failed, falling back to mock:", err);
    const products = category
      ? MOCK_PRODUCTS_ENRICHED.filter((p) => p.category === category)
      : MOCK_PRODUCTS_ENRICHED;
    return { products, source: "mock" };
  }
}

/** Get selling rate from Item Price (Selling, Standard) */
async function fetchItemPrice(itemName: string): Promise<number | null> {
  try {
    const url = erpUrl("/api/resource/Item Price", {
      filters: JSON.stringify([["item_code", "=", itemName], ["selling", "=", 1]]),
      fields: JSON.stringify(["price_list_rate"]),
      limit_page_length: 1,
    });
    const res = await fetchWithTimeout(url);
    if (!res.ok) return null;
    const json = await res.json();
    return json.data?.[0]?.price_list_rate ?? null;
  } catch {
    return null;
  }
}

/** Get actual qty from stock bin (first warehouse found) */
async function fetchItemStock(itemName: string): Promise<number> {
  try {
    const url = erpUrl("/api/resource/Bin", {
      filters: JSON.stringify([["item_code", "=", itemName]]),
      fields: JSON.stringify(["actual_qty"]),
      limit_page_length: 1,
    });
    const res = await fetchWithTimeout(url);
    if (!res.ok) return 0;
    const json = await res.json();
    return json.data?.[0]?.actual_qty ?? 0;
  } catch {
    return 0;
  }
}

// ------------------------------------------------------------
// CATEGORIES — read from Item Group doctype
// ------------------------------------------------------------
export async function fetchCategories(): Promise<{
  categories: Category[];
  source: "erpnext" | "mock";
}> {
  if (!isErpnextConfigured()) {
    return { categories: MOCK_CATEGORIES, source: "mock" };
  }

  try {
    const url = erpUrl("/api/resource/Item Group", {
      fields: JSON.stringify(["name", "parent_item_group", "is_group"]),
      filters: JSON.stringify([["is_group", "=", 0]]),
      limit_page_length: 100,
    });
    const res = await fetchWithTimeout(url);
    if (!res.ok) throw new Error(`ERPNext ${res.status}`);
    const json = await res.json();
    const groups: any[] = json.data || [];

    // Map to our Category shape — assign a default emoji/gradient
    const emojiPool = ["🥬", "🍎", "🌿", "🧺", "🥕", "🌽", "🍇", "🥦"];
    const gradientPool = [
      "from-green-400 to-emerald-600",
      "from-rose-400 to-red-600",
      "from-lime-400 to-green-600",
      "from-amber-400 to-orange-600",
      "from-cyan-400 to-blue-600",
      "from-violet-400 to-purple-600",
    ];
    const categories: Category[] = groups.map((g, i) => ({
      id: g.name,
      name: g.name,
      emoji: emojiPool[i % emojiPool.length],
      gradient: gradientPool[i % gradientPool.length],
      description: "Kategori produk dari ERPNext",
    }));

    return { categories, source: "erpnext" };
  } catch (err) {
    console.error("[ERPNext] fetchCategories failed, falling back to mock:", err);
    return { categories: MOCK_CATEGORIES, source: "mock" };
  }
}

// ------------------------------------------------------------
// CHECKOUT — create Sales Order in ERPNext
// ------------------------------------------------------------
export async function createSalesOrder(payload: {
  customerName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  notes?: string;
  items: { itemCode: string; qty: number; rate: number }[];
  deliveryMethod: string;
  paymentMethod: string;
}): Promise<{ success: boolean; salesOrderName?: string; message: string; mock?: boolean }> {
  if (!isErpnextConfigured()) {
    // Mock — generate a fake SO name
    const fakeName = `SO-MOCK-${Date.now().toString(36).toUpperCase()}`;
    return {
      success: true,
      salesOrderName: fakeName,
      message: "Pesanan berhasil dibuat (mode mock — ERPNext belum dikonfigurasi).",
      mock: true,
    };
  }

  try {
    // Step 1: Ensure Customer exists (by email). If not, create.
    const customerName = await ensureCustomer(payload);

    // Step 2: Build Sales Order payload
    const today = new Date().toISOString().split("T")[0];
    const soPayload = {
      customer: customerName,
      transaction_date: today,
      delivery_date: today,
      customer_address: payload.address,
      // Items
      items: payload.items.map((it) => ({
        item_code: it.itemCode,
        qty: it.qty,
        rate: it.rate,
      })),
      // Custom fields (optional — requires custom fields in ERPNext Sales Order)
      ...(payload.notes ? { additional_notes: payload.notes } : {}),
    };

    // Step 3: Create via Frappe REST API
    const url = erpUrl("/api/resource/Sales Order");
    const res = await fetchWithTimeout(url, {
      method: "POST",
      body: JSON.stringify(soPayload),
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`ERPNext ${res.status}: ${errText}`);
    }
    const json = await res.json();
    const soName = json.data?.name;

    return {
      success: true,
      salesOrderName: soName,
      message: `Pesanan ${soName} berhasil dibuat di ERPNext.`,
    };
  } catch (err: any) {
    console.error("[ERPNext] createSalesOrder failed:", err);
    return {
      success: false,
      message: `Gagal membuat pesanan: ${err.message || "unknown error"}`,
    };
  }
}

/** Find customer by email; if not found, create new Customer in ERPNext */
async function ensureCustomer(payload: {
  customerName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
}): Promise<string> {
  // Try to find existing customer by email
  try {
    const url = erpUrl("/api/resource/Contact", {
      filters: JSON.stringify([["email_id", "=", payload.email]]),
      fields: JSON.stringify(["name", "links"]),
      limit_page_length: 1,
    });
    const res = await fetchWithTimeout(url);
    if (res.ok) {
      const json = await res.json();
      const contact = json.data?.[0];
      if (contact?.links?.[0]?.link_name) {
        return contact.links[0].link_name;
      }
    }
  } catch {
    // ignore — will create new
  }

  // Create new Customer
  const custUrl = erpUrl("/api/resource/Customer");
  const custPayload = {
    customer_name: payload.customerName,
    customer_type: "Individual",
    customer_group: "Individual",
    territory: "Indonesia",
    ...(payload.email ? { email_id: payload.email } : {}),
    ...(payload.phone ? { mobile_no: payload.phone } : {}),
  };
  const res = await fetchWithTimeout(custUrl, {
    method: "POST",
    body: JSON.stringify(custPayload),
  });
  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Gagal membuat customer: ${errText}`);
  }
  const json = await res.json();
  return json.data?.name;
}
