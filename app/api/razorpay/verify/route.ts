import { NextResponse } from "next/server";
import { buildOrderFromCart } from "@/lib/checkout/order-build";
import type { CartLine } from "@/lib/cart/types";
import type { ShippingAddress } from "@/lib/checkout/types";
import { getRazorpayClient } from "@/lib/razorpay/config";
import { verifyPaymentSignature } from "@/lib/razorpay/verify";
import { fetchOrderById, persistOrder } from "@/lib/orders/persist";
import { createClient } from "@/lib/supabase/server";
import type { OrderRecord } from "@/lib/orders/types";

type Body = {
  orderId: string;
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
  lines?: CartLine[];
  shipping?: ShippingAddress;
};

export async function POST(request: Request) {
  const secret = process.env.RAZORPAY_KEY_SECRET;
  if (!secret) {
    return NextResponse.json({ error: "Razorpay not configured" }, { status: 503 });
  }

  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const { orderId, razorpayOrderId, razorpayPaymentId, razorpaySignature, lines, shipping } = body;
  if (!orderId || !razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
    return NextResponse.json({ error: "Missing payment fields" }, { status: 400 });
  }

  const valid = verifyPaymentSignature(
    razorpayOrderId,
    razorpayPaymentId,
    razorpaySignature,
    secret
  );

  if (!valid) {
    return NextResponse.json({ error: "Invalid payment signature" }, { status: 400 });
  }

  let order = await fetchOrderById(orderId);

  if ((!order || order.razorpayOrderId !== razorpayOrderId) && lines?.length && shipping) {
    const built = buildOrderFromCart(lines, shipping);
    if ("error" in built) {
      return NextResponse.json({ error: built.error }, { status: 400 });
    }

    const razorpay = getRazorpayClient();
    if (razorpay) {
      try {
        const rzOrder = await razorpay.orders.fetch(razorpayOrderId);
        const rzAmount = Number(rzOrder.amount);
        if (rzAmount !== built.amountPaise) {
          return NextResponse.json({ error: "Order amount mismatch" }, { status: 400 });
        }
        const notes = rzOrder.notes as Record<string, string> | undefined;
        if (notes?.miska_order_id && notes.miska_order_id !== orderId) {
          return NextResponse.json({ error: "Order id mismatch" }, { status: 400 });
        }
      } catch (err) {
        console.error("Razorpay fetch order failed:", err);
      }
    }

    order = {
      id: orderId,
      razorpayOrderId,
      status: "created",
      amountPaise: built.amountPaise,
      subtotal: built.subtotal,
      shippingFee: built.shippingFee,
      items: built.items,
      shipping,
      createdAt: new Date().toISOString(),
    };
  }

  if (!order || order.razorpayOrderId !== razorpayOrderId) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  const updated: OrderRecord = {
    ...order,
    status: "paid",
    paymentId: razorpayPaymentId,
    paidAt: new Date().toISOString(),
  };
  let userId: string | null = updated.userId ?? null;
  try {
    const supabase = await createClient();
    const { data } = await supabase.auth.getUser();
    userId = data.user?.id ?? userId;
  } catch {
    /* guest */
  }

  await persistOrder({ ...updated, userId: userId ?? undefined }, userId);

  return NextResponse.json({
    success: true,
    orderId: updated.id,
    paymentId: razorpayPaymentId,
    order: updated,
  });
}
