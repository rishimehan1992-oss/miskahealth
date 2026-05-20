import type { CartLine, CartState } from "./types";

const CART_KEY = "miska-cart-v1";

export function readCart(): CartState {
  if (typeof window === "undefined") return { lines: [], updatedAt: new Date().toISOString() };
  try {
    const raw = localStorage.getItem(CART_KEY);
    if (!raw) return { lines: [], updatedAt: new Date().toISOString() };
    const parsed = JSON.parse(raw) as CartState;
    if (!Array.isArray(parsed.lines)) return { lines: [], updatedAt: new Date().toISOString() };
    return parsed;
  } catch {
    return { lines: [], updatedAt: new Date().toISOString() };
  }
}

export function writeCart(lines: CartLine[]) {
  const state: CartState = { lines, updatedAt: new Date().toISOString() };
  localStorage.setItem(CART_KEY, JSON.stringify(state));
  window.dispatchEvent(new CustomEvent("miska-cart-updated"));
  return state;
}
