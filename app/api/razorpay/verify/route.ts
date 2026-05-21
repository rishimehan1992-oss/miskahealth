import { NextResponse } from "next/server";
import { verifyPaymentSignature } from "@/lib/razorpay/verify";
import { getOrderById, saveOrder } from "@/lib/orders/store";

type Body = {
  orderId: string;
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
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

  const { orderId, razorpayOrderId, razorpayPaymentId, razorpaySignature } = body;
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

  const order = await getOrderById(orderId);
  if (!order || order.razorpayOrderId !== razorpayOrderId) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  const updated = {
    ...order,
    status: "paid" as const,
    paymentId: razorpayPaymentId,
    paidAt: new Date().toISOString(),
  };
  await saveOrder(updated);

  return NextResponse.json({
    success: true,
    orderId: updated.id,
    paymentId: razorpayPaymentId,
  });
}
