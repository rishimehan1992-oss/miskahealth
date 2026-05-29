import { NextResponse } from "next/server";
import { buildOrderFromCart } from "@/lib/checkout/order-build";
import type { CartLine } from "@/lib/cart/types";
import type { ShippingAddress } from "@/lib/checkout/types";
import { persistOrder } from "@/lib/orders/persist";
import { createClient } from "@/lib/supabase/server";
import { notifyNewOrder } from "@/lib/telegram";
import type { OrderRecord } from "@/lib/orders/types";

type Body = {
  lines: CartLine[];
  shipping: ShippingAddress;
  couponCode?: string;
};

export async function POST(request: Request) {
  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  if (!body.lines?.length || !body.shipping) {
    return NextResponse.json({ error: "Cart and shipping are required" }, { status: 400 });
  }

  const built = buildOrderFromCart(body.lines, body.shipping, "cod", body.couponCode);
  if ("error" in built) {
    return NextResponse.json({ error: built.error }, { status: 400 });
  }

  const orderId = `miska_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;

  const record: OrderRecord = {
    id: orderId,
    razorpayOrderId: `cod_${orderId}`,
    status: "cod_pending",
    paymentMethod: "cod",
    amountPaise: built.amountPaise,
    subtotal: built.subtotal,
    discountAmount: built.discountAmount,
    couponCode: built.couponCode,
    shippingFee: built.shippingFee,
    items: built.items,
    shipping: body.shipping,
    createdAt: new Date().toISOString(),
  };

  let userId: string | null = null;
  try {
    const supabase = await createClient();
    const { data } = await supabase.auth.getUser();
    userId = data.user?.id ?? null;
  } catch {
    /* guest checkout */
  }

  try {
    await persistOrder(record, userId);
  } catch (err) {
    console.error("COD order persist failed:", err);
    return NextResponse.json({ error: "Could not save order. Try again." }, { status: 502 });
  }

  // non-blocking Telegram notification
  void notifyNewOrder(record);

  return NextResponse.json({
    orderId: record.id,
    order: record,
  });
}
