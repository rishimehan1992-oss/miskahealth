import type { ShippingAddress } from "./types";

const SHIPPING_KEY = "miska-shipping-v1";

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

export function clearCheckoutSession() {
  localStorage.removeItem(SHIPPING_KEY);
}
