import { NextRequest, NextResponse } from "next/server";
import { createSalesOrder } from "@/lib/erpnext";
import type { CheckoutPayload } from "@/types/grocery";

export const dynamic = "force-dynamic";

// POST /api/checkout
export async function POST(req: NextRequest) {
  try {
    const payload: CheckoutPayload = await req.json();

    // basic validation
    if (!payload.customer?.name || !payload.customer?.phone || !payload.customer?.address) {
      return NextResponse.json(
        { success: false, message: "Nama, telepon, dan alamat wajib diisi." },
        { status: 400 }
      );
    }
    if (!payload.items?.length) {
      return NextResponse.json(
        { success: false, message: "Keranjang belanja kosong." },
        { status: 400 }
      );
    }

    const result = await createSalesOrder({
      customerName: payload.customer.name,
      email: payload.customer.email,
      phone: payload.customer.phone,
      address: payload.customer.address,
      city: payload.customer.city,
      notes: payload.customer.notes,
      items: payload.items.map((i) => ({
        itemCode: i.product.itemCode,
        qty: i.quantity,
        rate: i.product.price,
      })),
      deliveryMethod: payload.deliveryMethod,
      paymentMethod: payload.paymentMethod,
    });

    return NextResponse.json(result, { status: result.success ? 200 : 500 });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message || "Server error" },
      { status: 500 }
    );
  }
}
