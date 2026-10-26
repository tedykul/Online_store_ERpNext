import { NextRequest, NextResponse } from "next/server";
import { getAllProducts, createProduct, type ProductInput } from "@/lib/products-db";
import { requirePermission, isAuthResult } from "@/lib/permissions";
import { logAdminAction } from "@/lib/audit";

export const dynamic = "force-dynamic";

// GET /api/admin/products — list all products (admin)
export async function GET() {
  const auth = await requirePermission("products:read");
  if (!isAuthResult(auth)) return auth; // 401/403 NextResponse

  try {
    const products = await getAllProducts();
    return NextResponse.json({ success: true, products });
  } catch (err: any) {
    console.error("[api/admin/products] GET error:", err);
    return NextResponse.json(
      { success: false, message: "Server error." },
      { status: 500 }
    );
  }
}

// POST /api/admin/products — create new product
export async function POST(req: NextRequest) {
  const auth = await requirePermission("products:write");
  if (!isAuthResult(auth)) return auth;

  try {
    const body = (await req.json().catch(() => ({}))) as Partial<ProductInput>;
    if (!body.itemCode || typeof body.itemCode !== "string" || !body.itemCode.trim()) {
      return NextResponse.json(
        { success: false, message: "Item code diperlukan." },
        { status: 422 }
      );
    }
    if (!body.name || typeof body.name !== "string" || body.name.trim().length < 2) {
      return NextResponse.json(
        { success: false, message: "Nama minimal 2 karakter." },
        { status: 422 }
      );
    }
    try {
      const product = await createProduct(body as ProductInput);
      await logAdminAction({
        action: "create",
        target: `product:${product.id}`,
        success: true,
        userId: auth.userId,
        userEmail: auth.email,
      });
      return NextResponse.json({ success: true, product }, { status: 201 });
    } catch (err: any) {
      // P2002 = unique constraint violation (itemCode already exists)
      if (err?.code === "P2002") {
        return NextResponse.json(
          { success: false, message: "Item code sudah digunakan." },
          { status: 409 }
        );
      }
      throw err;
    }
  } catch (err: any) {
    console.error("[api/admin/products] POST error:", err);
    return NextResponse.json(
      { success: false, message: "Server error." },
      { status: 500 }
    );
  }
}
