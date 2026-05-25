import { createAdminClient } from "@/lib/supabase/admin";
import type { PaymentMethod } from "@/lib/cart/pricing";
import type { OrderRecord } from "./types";

type ShippingPayload = OrderRecord["shipping"] & { paymentMethod?: PaymentMethod };

function parsePaymentMethod(
  shipping: ShippingPayload,
  razorpayOrderId: string,
  status: string
): { paymentMethod: PaymentMethod; status: OrderRecord["status"] } {
  const method =
    shipping.paymentMethod ?? (razorpayOrderId.startsWith("cod_") ? "cod" : "prepaid");
  const orderStatus: OrderRecord["status"] =
    method === "cod" && status === "created" ? "cod_pending" : (status as OrderRecord["status"]);
  return { paymentMethod: method, status: orderStatus };
}

function rowToOrder(
  row: {
    id: string;
    user_id: string | null;
    razorpay_order_id: string;
    razorpay_payment_id: string | null;
    status: string;
    amount_paise: number;
    subtotal: number;
    shipping_fee: number;
    shipping: OrderRecord["shipping"];
    created_at: string;
    paid_at: string | null;
  },
  items: {
    product_slug: string;
    product_name: string;
    quantity: number;
    unit_price: number;
    line_total: number;
  }[]
): OrderRecord {
  const ship = row.shipping as ShippingPayload;
  const { paymentMethod, status } = parsePaymentMethod(ship, row.razorpay_order_id, row.status);
  const { paymentMethod: _pm, ...shipping } = ship;

  return {
    id: row.id,
    userId: row.user_id ?? undefined,
    razorpayOrderId: row.razorpay_order_id,
    paymentId: row.razorpay_payment_id ?? undefined,
    status,
    paymentMethod,
    amountPaise: row.amount_paise,
    subtotal: row.subtotal,
    shippingFee: row.shipping_fee,
    shipping,
    items: items.map((i) => ({
      slug: i.product_slug,
      name: i.product_name,
      quantity: i.quantity,
      unitPrice: i.unit_price,
      lineTotal: i.line_total,
    })),
    createdAt: row.created_at,
    paidAt: row.paid_at ?? undefined,
  };
}

export async function saveOrderToSupabase(order: OrderRecord, userId?: string | null) {
  const admin = createAdminClient();
  if (!admin) return false;

  const dbStatus = order.status === "cod_pending" ? "created" : order.status;
  const shippingPayload: ShippingPayload = {
    ...order.shipping,
    paymentMethod: order.paymentMethod,
  };

  const { error: orderError } = await admin.from("orders").upsert({
    id: order.id,
    user_id: userId ?? order.userId ?? null,
    razorpay_order_id: order.razorpayOrderId,
    razorpay_payment_id: order.paymentId ?? null,
    status: dbStatus,
    amount_paise: order.amountPaise,
    subtotal: order.subtotal,
    shipping_fee: order.shippingFee,
    shipping: shippingPayload,
    created_at: order.createdAt,
    paid_at: order.paidAt ?? null,
  });

  if (orderError) {
    console.error("Supabase orders upsert:", orderError);
    return false;
  }

  await admin.from("order_items").delete().eq("order_id", order.id);

  const { error: itemsError } = await admin.from("order_items").insert(
    order.items.map((item) => ({
      order_id: order.id,
      product_slug: item.slug,
      product_name: item.name,
      quantity: item.quantity,
      unit_price: item.unitPrice,
      line_total: item.lineTotal,
    }))
  );

  if (itemsError) {
    console.error("Supabase order_items insert:", itemsError);
    return false;
  }

  return true;
}

export async function getOrderFromSupabase(id: string): Promise<OrderRecord | null> {
  const admin = createAdminClient();
  if (!admin) return null;

  const { data: row, error } = await admin.from("orders").select("*").eq("id", id).maybeSingle();
  if (error || !row) return null;

  const { data: items } = await admin.from("order_items").select("*").eq("order_id", id);
  return rowToOrder(row, items ?? []);
}

export async function getOrderByRazorpayIdFromSupabase(
  razorpayOrderId: string
): Promise<OrderRecord | null> {
  const admin = createAdminClient();
  if (!admin) return null;

  const { data: row } = await admin
    .from("orders")
    .select("*")
    .eq("razorpay_order_id", razorpayOrderId)
    .maybeSingle();
  if (!row) return null;

  const { data: items } = await admin.from("order_items").select("*").eq("order_id", row.id);
  return rowToOrder(row, items ?? []);
}
