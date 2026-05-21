import { NextResponse } from "next/server";
import { buildOrderFromCart } from "@/lib/checkout/order-build";
import type { CartLine } from "@/lib/cart/types";
import type { ShippingAddress } from "@/lib/checkout/types";
import { getRazorpayClient, getRazorpayKeyId, isRazorpayConfigured } from "@/lib/razorpay/config";
import { saveOrder } from "@/lib/orders/store";
import type { OrderRecord } from "@/lib/orders/types";

type Body = {
  lines: CartLine[];
  shipping: ShippingAddress;
};

export async function POST(request: Request) {
  if (!isRazorpayConfigured()) {
    return NextResponse.json({ error: "Razorpay is not configured" }, { status: 503 });
  }

  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  if (!body.lines?.length || !body.shipping) {
    return NextResponse.json({ error: "Cart and shipping are required" }, { status: 400 });
  }

  const built = buildOrderFromCart(body.lines, body.shipping);
  if ("error" in built) {
    return NextResponse.json({ error: built.error }, { status: 400 });
  }

  const razorpay = getRazorpayClient();
  if (!razorpay) {
    return NextResponse.json({ error: "Razorpay client unavailable" }, { status: 503 });
  }

  const orderId = `miska_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;

  try {
    const rzOrder = await razorpay.orders.create({
      amount: built.amountPaise,
      currency: "INR",
      receipt: orderId,
      notes: {
        miska_order_id: orderId,
        customer_email: body.shipping.email,
        customer_phone: body.shipping.phone,
      },
    });

    const record: OrderRecord = {
      id: orderId,
      razorpayOrderId: rzOrder.id,
      status: "created",
      amountPaise: built.amountPaise,
      subtotal: built.subtotal,
      shippingFee: built.shippingFee,
      items: built.items,
      shipping: body.shipping,
      createdAt: new Date().toISOString(),
    };

    await saveOrder(record);

    return NextResponse.json({
      keyId: getRazorpayKeyId(),
      orderId: record.id,
      razorpayOrderId: rzOrder.id,
      amount: built.amountPaise,
      currency: "INR",
      customer: {
        name: body.shipping.fullName,
        email: body.shipping.email,
        contact: body.shipping.phone,
      },
    });
  } catch (err) {
    console.error("Razorpay create order failed:", err);
    return NextResponse.json(
      { error: "Could not create payment order. Check Razorpay keys and account status." },
      { status: 502 }
    );
  }
}
