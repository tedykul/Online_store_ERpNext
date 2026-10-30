import { NextRequest, NextResponse } from "next/server";
import { verifyAdmin } from "@/lib/admin-auth";
import {
  getAllConfigForDisplay,
  setConfigValue,
  refreshConfig,
  getErpConfig,
  ERP_KEYS,
  encrypt,
  isConfigured,
} from "@/lib/integration-config";
import { logAdminAction } from "@/lib/audit";

// ============================================================
// Integration Config API — manage ERPNext connection settings.
// ============================================================
// GET    /api/admin/integration         → get all config (secrets masked)
// POST   /api/admin/integration         → save config (encrypts secrets)
// POST   /api/admin/integration/test    → test ERPNext connection
// ============================================================

export const dynamic = "force-dynamic";

// GET — return all config (secrets shown for admin editing)
export async function GET() {
  if (!(await verifyAdmin())) {
    return NextResponse.json(
      { success: false, message: "Unauthorized." },
      { status: 401 }
    );
  }

  try {
    const config = await getAllConfigForDisplay();
    const currentConfig = getErpConfig();

    return NextResponse.json({
      success: true,
      config: {
        erpnext_url: config[ERP_KEYS.URL]?.value || currentConfig.url || "",
        erpnext_api_key: config[ERP_KEYS.API_KEY]?.value || currentConfig.apiKey || "",
        erpnext_api_secret: config[ERP_KEYS.API_SECRET]?.value || currentConfig.apiSecret || "",
        erpnext_site: config[ERP_KEYS.SITE]?.value || currentConfig.site || "",
        erpnext_warehouse: config[ERP_KEYS.WAREHOUSE]?.value || currentConfig.warehouse || "",
        erpnext_company: config[ERP_KEYS.COMPANY]?.value || currentConfig.company || "",
      },
      isConfigured: isConfigured(),
    });
  } catch (err: any) {
    console.error("[api/admin/integration] GET error:", err);
    return NextResponse.json(
      { success: false, message: "Server error." },
      { status: 500 }
    );
  }
}

// POST — save config
export async function POST(req: NextRequest) {
  const auth = await verifyAdmin();
  if (!auth) {
    return NextResponse.json(
      { success: false, message: "Unauthorized." },
      { status: 401 }
    );
  }

  try {
    const body = (await req.json().catch(() => ({}))) as Record<string, string>;

    // Save each config value
    const savePromises: Promise<void>[] = [];

    if (body.erpnext_url !== undefined) {
      savePromises.push(setConfigValue(ERP_KEYS.URL, body.erpnext_url));
    }
    if (body.erpnext_api_key !== undefined) {
      savePromises.push(setConfigValue(ERP_KEYS.API_KEY, body.erpnext_api_key));
    }
    if (body.erpnext_api_secret !== undefined) {
      savePromises.push(setConfigValue(ERP_KEYS.API_SECRET, body.erpnext_api_secret, true));
    }
    if (body.erpnext_site !== undefined) {
      savePromises.push(setConfigValue(ERP_KEYS.SITE, body.erpnext_site));
    }
    if (body.erpnext_warehouse !== undefined) {
      savePromises.push(setConfigValue(ERP_KEYS.WAREHOUSE, body.erpnext_warehouse));
    }
    if (body.erpnext_company !== undefined) {
      savePromises.push(setConfigValue(ERP_KEYS.COMPANY, body.erpnext_company));
    }

    await Promise.all(savePromises);

    // Refresh in-memory cache so new config takes effect immediately
    await refreshConfig();

    await logAdminAction({
      action: "update",
      target: "integration:erpnext",
      success: true,
    });

    return NextResponse.json({
      success: true,
      message: "Konfigurasi ERPNext berhasil disimpan.",
      isConfigured: isConfigured(),
    });
  } catch (err: any) {
    console.error("[api/admin/integration] POST error:", err);
    return NextResponse.json(
      { success: false, message: "Server error." },
      { status: 500 }
    );
  }
}
