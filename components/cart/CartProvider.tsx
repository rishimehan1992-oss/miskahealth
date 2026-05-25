"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { readCart, writeCart } from "@/lib/cart/storage";
import { cartSubtotal, priceCartLines, type PricedLine } from "@/lib/cart/pricing";
import type { CartLine } from "@/lib/cart/types";

type CartContextValue = {
  lines: CartLine[];
  pricedLines: PricedLine[];
  itemCount: number;
  subtotal: number;
  ready: boolean;
  drawerOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addItem: (slug: string, productId: number, qty?: number) => void;
  setQuantity: (slug: string, quantity: number) => void;
  removeItem: (slug: string) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [ready, setReady] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const sync = useCallback(() => {
    setLines(readCart().lines);
    setReady(true);
  }, []);

  useEffect(() => {
    sync();
    const onUpdate = () => sync();
    window.addEventListener("miska-cart-updated", onUpdate);
    window.addEventListener("storage", onUpdate);
    return () => {
      window.removeEventListener("miska-cart-updated", onUpdate);
      window.removeEventListener("storage", onUpdate);
    };
  }, [sync]);

  useEffect(() => {
    if (!drawerOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setDrawerOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [drawerOpen]);

  const persist = useCallback((next: CartLine[]) => {
    setLines(next);
    writeCart(next);
  }, []);

  const openCart = useCallback(() => setDrawerOpen(true), []);
  const closeCart = useCallback(() => setDrawerOpen(false), []);

  const addItem = useCallback(
    (slug: string, productId: number, qty = 1) => {
      const existing = lines.find((l) => l.slug === slug);
      const next = existing
        ? lines.map((l) =>
            l.slug === slug ? { ...l, quantity: Math.min(10, l.quantity + qty) } : l
          )
        : [...lines, { slug, productId, quantity: qty }];
      persist(next);
    },
    [lines, persist]
  );

  const setQuantity = useCallback(
    (slug: string, quantity: number) => {
      if (quantity < 1) {
        persist(lines.filter((l) => l.slug !== slug));
        return;
      }
      persist(lines.map((l) => (l.slug === slug ? { ...l, quantity: Math.min(10, quantity) } : l)));
    },
    [lines, persist]
  );

  const removeItem = useCallback(
    (slug: string) => {
      persist(lines.filter((l) => l.slug !== slug));
    },
    [lines, persist]
  );

  const clearCart = useCallback(() => persist([]), [persist]);

  const pricedLines = useMemo(() => priceCartLines(lines), [lines]);
  const itemCount = useMemo(() => lines.reduce((n, l) => n + l.quantity, 0), [lines]);
  const subtotal = useMemo(() => cartSubtotal(pricedLines), [pricedLines]);

  const value = useMemo(
    () => ({
      lines,
      pricedLines,
      itemCount,
      subtotal,
      ready,
      drawerOpen,
      openCart,
      closeCart,
      addItem,
      setQuantity,
      removeItem,
      clearCart,
    }),
    [
      lines,
      pricedLines,
      itemCount,
      subtotal,
      ready,
      drawerOpen,
      openCart,
      closeCart,
      addItem,
      setQuantity,
      removeItem,
      clearCart,
    ]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
