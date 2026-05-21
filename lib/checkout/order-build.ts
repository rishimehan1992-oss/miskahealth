import { getProductBySlug } from "@/data/products";
import { cartSubtotal, orderTotal, priceCartLines, shippingFee } from "@/lib/cart/pricing";
import type { CartLine } from "@/lib/cart/types";
import { validateShipping, hasErrors } from "./validate";
import type { ShippingAddress } from "./types";
import type { OrderItem } from "@/lib/orders/types";

export function buildOrderFromCart(lines: CartLine[], shipping: ShippingAddress) {
  const shippingErrors = validateShipping(shipping);
  if (hasErrors(shippingErrors)) {
    return { error: "Invalid shipping address" as const };
  }

  const priced = priceCartLines(lines);
  if (priced.length === 0) {
    return { error: "Cart is empty" as const };
  }

  for (const line of lines) {
    const p = getProductBySlug(line.slug);
    if (!p?.available || p.price == null) {
      return { error: `Product unavailable: ${line.slug}` as const };
    }
  }

  const subtotal = cartSubtotal(priced);
  const ship = shippingFee(subtotal);
  const total = orderTotal(subtotal);
  const amountPaise = total * 100;

  const items: OrderItem[] = priced.map((l) => ({
    slug: l.slug,
    name: l.name,
    quantity: l.quantity,
    unitPrice: l.unitPrice,
    lineTotal: l.lineTotal,
  }));

  return {
    subtotal,
    shippingFee: ship,
    total,
    amountPaise,
    items,
    shipping,
  };
}
