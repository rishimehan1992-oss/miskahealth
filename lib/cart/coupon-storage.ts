const COUPON_KEY = "miska-coupon-v1";

export function readCouponCode(): string | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(COUPON_KEY);
    if (!raw) return null;
    const trimmed = raw.trim();
    return trimmed || null;
  } catch {
    return null;
  }
}

export function writeCouponCode(code: string | null) {
  if (typeof window === "undefined") return;
  if (!code) {
    localStorage.removeItem(COUPON_KEY);
  } else {
    localStorage.setItem(COUPON_KEY, code.trim());
  }
  window.dispatchEvent(new CustomEvent("miska-coupon-updated"));
}

export function clearCouponCode() {
  writeCouponCode(null);
}
