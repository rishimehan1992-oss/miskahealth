import { getProductBySlug } from "@/data/products";
import type { CartLine } from "./types";

export type PaymentMethod = "prepaid" | "cod";

export const COD_SHIPPING_FEE = 49;

export type PricedLine = {
  slug: string;
  name: string;
  volume: string;
  image: string;
  unitPrice: number;
  mrp: number | null;
  quantity: number;
  lineTotal: number;
};

export function priceCartLines(lines: CartLine[]): PricedLine[] {
  return lines
    .map((line) => {
      const p = getProductBySlug(line.slug);
      if (!p?.available || p.price == null) return null;
      return {
        slug: p.slug,
        name: p.name,
        volume: p.volume,
        image: p.images.main,
        unitPrice: p.price,
        mrp: p.mrp,
        quantity: line.quantity,
        lineTotal: p.price * line.quantity,
      };
    })
    .filter((x): x is PricedLine => x != null);
}

export function cartSubtotal(lines: PricedLine[]) {
  return lines.reduce((sum, l) => sum + l.lineTotal, 0);
}

/** Prepaid: free shipping. COD: flat ₹49. */
export function shippingFee(subtotal: number, method: PaymentMethod = "prepaid") {
  if (subtotal <= 0) return 0;
  return method === "cod" ? COD_SHIPPING_FEE : 0;
}

export function orderTotal(
  subtotal: number,
  method: PaymentMethod = "prepaid",
  discount = 0
) {
  const discountedSubtotal = Math.max(0, subtotal - discount);
  return discountedSubtotal + shippingFee(subtotal, method);
}

export function formatInr(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function shippingLabel(method: PaymentMethod) {
  if (method === "cod") return formatInr(COD_SHIPPING_FEE);
  return "Free";
}
