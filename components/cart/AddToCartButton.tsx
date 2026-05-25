"use client";

import { useState } from "react";
import { ShoppingBag, Check } from "lucide-react";
import { useCart } from "./CartProvider";
import type { Product } from "@/data/products";

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
