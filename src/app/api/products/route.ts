import { NextRequest, NextResponse } from "next/server";
import { fetchProducts } from "@/lib/erpnext";

export const dynamic = "force-dynamic";

// GET /api/products?category=Sayuran
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category") || undefined;

  const { products, source } = await fetchProducts(category);

  return NextResponse.json({
    success: true,
    count: products.length,
    source, // "erpnext" | "mock"
    products,
  });
}
