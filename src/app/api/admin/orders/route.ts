import { NextRequest, NextResponse } from "next/server";
import { listOrders, type OrderStatus } from "@/lib/orders";
import { verifyAdmin } from "@/lib/admin-auth";
import { logAdminAction } from "@/lib/audit";

export const dynamic = "force-dynamic";

// GET /api/admin/orders — list orders with optional filtering
// Query params: limit, offset, status, search
export async function GET(req: NextRequest) {
  if (!(await verifyAdmin())) {
    return NextResponse.json(
      { success: false, message: "Unauthorized." },
      { status: 401 }
    );
  }
  try {
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get("limit") || "50", 10);
    const offset = parseInt(searchParams.get("offset") || "0", 10);
    const status = searchParams.get("status") as OrderStatus | null;
    const search = searchParams.get("search") || undefined;

    const result = await listOrders({
      limit: isNaN(limit) ? 50 : limit,
      offset: isNaN(offset) ? 0 : offset,
      status: status || undefined,
      search,
    });

    return NextResponse.json({
      success: true,
      orders: result.orders,
      total: result.total,
    });
  } catch (err: any) {
    console.error("[api/admin/orders] GET error:", err);
    return NextResponse.json(
      { success: false, message: "Server error." },
      { status: 500 }
    );
  }
}
