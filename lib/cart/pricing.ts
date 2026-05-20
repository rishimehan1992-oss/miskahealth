import { getProductBySlug } from "@/data/products";
import type { CartLine } from "./types";

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

/** Flat shipping until Razorpay + rules are configured */
export function shippingFee(subtotal: number) {
  if (subtotal <= 0) return 0;
  return subtotal >= 999 ? 0 : 49;
}

export function orderTotal(subtotal: number) {
  return subtotal + shippingFee(subtotal);
}

export function formatInr(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}
