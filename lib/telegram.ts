import type { OrderRecord } from "@/lib/orders/types";

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

async function send(text: string) {
  if (!BOT_TOKEN || !CHAT_ID) return;
  try {
    await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text,
        parse_mode: "HTML",
        disable_web_page_preview: true,
      }),
    });
  } catch (err) {
    console.warn("Telegram notify failed:", err);
  }
}

function inr(paise: number) {
  return `₹${(paise / 100).toLocaleString("en-IN")}`;
}

export async function notifyNewOrder(order: OrderRecord) {
  const isCod = order.paymentMethod === "cod";
  const statusEmoji = isCod ? "📦" : "💳";
  const method = isCod ? "COD" : "Prepaid";
  const items = order.items
    .map((i) => `  • ${i.name} ×${i.quantity} — ₹${i.lineTotal}`)
    .join("\n");

  const coupon = order.couponCode
    ? `\n🏷 Coupon: <b>${order.couponCode}</b> (−₹${order.discountAmount ?? 99})`
    : "";

  const msg = `${statusEmoji} <b>New ${method} Order</b>
─────────────────
🛒 <b>${order.id}</b>
👤 ${order.shipping.fullName}
📱 ${order.shipping.phone}
📍 ${order.shipping.city}, ${order.shipping.state} ${order.shipping.pincode}

${items}
─────────────────${coupon}
📦 Shipping: ₹${order.shippingFee}
💰 <b>Total: ${inr(order.amountPaise)}</b>`;

  await send(msg);
}

export async function notifyAddToCart(payload: {
  productName: string;
  quantity: number;
  price: number;
  sessionId?: string;
}) {
  const msg = `🛍 <b>Add to Cart</b>
${payload.productName} ×${payload.quantity} — ₹${payload.price * payload.quantity}`;
  await send(msg);
}
