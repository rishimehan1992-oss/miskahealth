import { NextResponse } from "next/server";
import { verifyWebhookSignature } from "@/lib/razorpay/verify";
import { getOrderByRazorpayOrderId, updateOrderStatus } from "@/lib/orders/store";

export async function POST(request: Request) {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!secret) {
    return NextResponse.json({ error: "Webhook secret not configured" }, { status: 503 });
  }

  const rawBody = await request.text();
  const signature = request.headers.get("x-razorpay-signature") ?? "";

  if (!verifyWebhookSignature(rawBody, signature, secret)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  let event: { event?: string; payload?: { payment?: { entity?: Record<string, string> } } };
  try {
    event = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (event.event === "payment.captured") {
    const payment = event.payload?.payment?.entity;
    const razorpayOrderId = payment?.order_id;
    const paymentId = payment?.id;
    if (razorpayOrderId) {
      const existing = await getOrderByRazorpayOrderId(razorpayOrderId);
      if (existing && existing.status !== "paid") {
        await updateOrderStatus(razorpayOrderId, {
          status: "paid",
          paymentId,
          paidAt: new Date().toISOString(),
        });
      }
    }
  }

  return NextResponse.json({ received: true });
}
