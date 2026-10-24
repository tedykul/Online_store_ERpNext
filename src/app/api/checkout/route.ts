import { NextRequest, NextResponse } from "next/server";
import { createSalesOrder } from "@/lib/erpnext";
import { createOrder } from "@/lib/orders";
import { createPayment } from "@/lib/payments";
import { estimateDelivery } from "@/lib/delivery";
import type { CheckoutPayload } from "@/types/grocery";

export const dynamic = "force-dynamic";

// POST /api/checkout
// Creates Sales Order in ERPNext (or mock) + Order record in Prisma
// for tracking. Returns trackingId for customer.
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

    // 1. Create Sales Order in ERPNext (or mock)
    const erpResult = await createSalesOrder({
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

    if (!erpResult.success) {
      return NextResponse.json(erpResult, { status: 500 });
    }

    // 2. Calculate pricing for Order record
    const subtotal = payload.items.reduce(
      (sum, i) => sum + i.product.price * i.quantity,
      0
    );
    const FREE_SHIPPING_THRESHOLD = 50000;
    const freeShipping =
      subtotal >= FREE_SHIPPING_THRESHOLD || payload.deliveryMethod === "pickup";
    const shipping = freeShipping ? 0 : 9000;
    const total = subtotal + shipping;

    // 3. Estimate delivery time
    const estimate = estimateDelivery(payload.deliveryMethod);

    // 4. Create Order record in Prisma for tracking
    const order = await createOrder({
      customerName: payload.customer.name,
      customerEmail: payload.customer.email,
      customerPhone: payload.customer.phone,
      customerAddress: payload.customer.address,
      customerCity: payload.customer.city,
      customerNotes: payload.customer.notes,
      items: payload.items,
      subtotal,
      shipping,
      total,
      deliveryMethod: payload.deliveryMethod,
      paymentMethod: payload.paymentMethod,
      erpSalesOrderName: erpResult.salesOrderName,
      estimatedDelivery: estimate.earliestDate.toISOString(),
    });

    // 5. Create payment record (mock gateway)
    const payment = await createPayment(
      order.id,
      order.trackingId,
      payload.paymentMethod,
      total
    );

    return NextResponse.json({
      success: true,
      message: erpResult.message,
      salesOrderName: erpResult.salesOrderName,
      trackingId: order.trackingId,
      orderId: order.id,
      paymentId: payment.success ? payment.paymentId : undefined,
      payment: payment.success ? {
        method: payment.method,
        status: payment.status,
        amount: payment.amount,
        vaNumber: payment.vaNumber,
        vaBank: payment.vaBank,
        paymentUrl: payment.paymentUrl,
        ewalletProvider: payment.ewalletProvider,
        message: payment.message,
      } : undefined,
      mock: erpResult.mock,
      estimatedDelivery: {
        dateLabel: estimate.dateLabel,
        timeWindow: estimate.timeWindow,
        sameDay: estimate.sameDay,
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message || "Server error" },
      { status: 500 }
    );
  }
}
