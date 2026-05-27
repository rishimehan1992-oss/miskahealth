import type { CartLine } from "./types";

/** ₹99 off when cart includes shampoo + oil, or shampoo + serum */
export const COMBO_DISCOUNT_INR = 99;

/** Accepted codes (case-insensitive). Primary code shown to customers: COMBO99 */
export const COMBO_COUPON_CODES = ["COMBO99", "99"] as const;

const SHAMPOO = "rosemary-shampoo";
const OIL = "rosemary-hair-oil";
const SERUM = "hair-scalp-serum";

const COMBO_SETS: ReadonlyArray<readonly [string, string]> = [
  [SHAMPOO, OIL],
  [SHAMPOO, SERUM],
];

export function normalizeCouponCode(raw: string) {
  return raw.trim().toUpperCase();
}

export function cartHasCombo(lines: CartLine[]) {
  const slugs = new Set(
    lines.filter((l) => l.quantity > 0).map((l) => l.slug)
  );
  return COMBO_SETS.some(([a, b]) => slugs.has(a) && slugs.has(b));
}

export type CouponValidation =
  | { valid: true; code: string; discount: number }
  | { valid: false; error: string };

export function validateComboCoupon(
  rawCode: string,
  lines: CartLine[]
): CouponValidation {
  const code = normalizeCouponCode(rawCode);
  if (!code) {
    return { valid: false, error: "Enter a coupon code" };
  }

  const allowed = COMBO_COUPON_CODES.map((c) => c.toUpperCase());
  if (!allowed.includes(code)) {
    return { valid: false, error: "Invalid coupon code" };
  }

  if (!cartHasCombo(lines)) {
    return {
      valid: false,
      error: "Add Shampoo + Oil or Shampoo + Serum to use this coupon",
    };
  }

  return { valid: true, code, discount: COMBO_DISCOUNT_INR };
}
