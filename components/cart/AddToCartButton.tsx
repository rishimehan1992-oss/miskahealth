"use client";

import { useState } from "react";
import { ShoppingBag, Check } from "lucide-react";
import { useCart } from "./CartProvider";
import type { Product } from "@/data/products";
import { trackAddToCart } from "@/lib/meta/pixel";

async function notifyCart(product: { name: string; price: number }, qty: number) {
  try {
    await fetch("/api/notify/cart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productName: product.name, quantity: qty, price: product.price }),
    });
  } catch {
    /* non-blocking */
  }
}

type Props = {
  product: Product;
  className?: string;
  variant?: "primary" | "secondary";
  label?: string;
};

export default function AddToCartButton({
  product,
  className = "",
  variant = "primary",
  label,
}: Props) {
  const { addItem, openCart } = useCart();
  const [added, setAdded] = useState(false);

  if (!product.available || product.price == null) return null;

  const base =
    variant === "primary"
      ? "inline-flex items-center justify-center gap-2 bg-[#1C3A2A] text-white font-semibold hover:bg-[#152d20] transition-colors"
      : "inline-flex items-center justify-center gap-2 border border-[#1C3A2A] text-[#1C3A2A] font-semibold hover:bg-[#1C3A2A]/5 transition-colors";

  return (
    <button
      type="button"
      onClick={() => {
        addItem(product.slug, product.id);
        trackAddToCart({ id: product.slug, name: product.name, price: product.price ?? 0 });
        void notifyCart({ name: product.name, price: product.price ?? 0 }, 1);
        openCart();
        setAdded(true);
        window.setTimeout(() => setAdded(false), 2000);
      }}
      className={`${base} touch-manipulation ${className}`}
    >
      {added ? (
        <>
          <Check size={14} />
          Added
        </>
      ) : (
        <>
          <ShoppingBag size={14} />
          {label ?? "Add to cart"}
        </>
      )}
    </button>
  );
}
