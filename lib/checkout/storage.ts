import type { PaymentMethod } from "@/lib/cart/pricing";
import type { ShippingAddress } from "./types";

const SHIPPING_KEY = "miska-shipping-v1";
const PAYMENT_METHOD_KEY = "miska-payment-method-v1";

export function readShipping(): ShippingAddress | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(SHIPPING_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as ShippingAddress;
  } catch {
    return null;
  }
}

export function writeShipping(address: ShippingAddress) {
  localStorage.setItem(SHIPPING_KEY, JSON.stringify(address));
}

export function clearShipping() {
  localStorage.removeItem(SHIPPING_KEY);
}

export function readPaymentMethod(): PaymentMethod {
  if (typeof window === "undefined") return "prepaid";
  try {
    const raw = localStorage.getItem(PAYMENT_METHOD_KEY);
    if (raw === "cod" || raw === "prepaid") return raw;
  } catch {
    /* ignore */
  }
  return "prepaid";
}

export function writePaymentMethod(method: PaymentMethod) {
  localStorage.setItem(PAYMENT_METHOD_KEY, method);
}

export function clearPaymentMethod() {
  localStorage.removeItem(PAYMENT_METHOD_KEY);
}
