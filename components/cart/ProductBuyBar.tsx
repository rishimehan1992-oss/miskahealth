"use client";

import Link from "next/link";
import AddToCartButton from "./AddToCartButton";
import type { Product } from "@/data/products";
import { pageShell } from "@/lib/layout";

type Props = {
  product: Product;
  variant?: "inline" | "sticky";
};

export default function ProductBuyBar({ product, variant = "inline" }: Props) {
  if (!product.available || product.price == null) return null;

  if (variant === "sticky") {
    return (
      <div className="fixed bottom-0 inset-x-0 z-40 sm:hidden bg-white/95 backdrop-blur-md border-t border-[#E5E2DB] p-4 safe-area-pb">
        <div className={`${pageShell} flex gap-2`}>
          <AddToCartButton
            product={product}
            className="flex-1 py-4 text-[10px] tracking-[0.16em] uppercase"
          />
          <Link
            href="/cart"
            className="shrink-0 px-4 py-4 border border-[#CCC9C2] text-[10px] tracking-[0.12em] uppercase text-[#666] font-semibold"
          >
            Bag
          </Link>
        </div>
      </div>
    );
  }

  return (
    <section className="border-t border-[#E5E2DB] bg-white py-10 sm:py-12 hidden sm:block">
      <div className={`${pageShell} flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6`}>
        <div>
          <p className="font-serif text-[22px] text-[#0A0A0A] mb-1">{product.name}</p>
          <p className="text-[13px] text-[#888] font-light">
            {product.volume} · ₹{product.price}
          </p>
        </div>
        <div className="flex gap-3 shrink-0">
          <AddToCartButton
            product={product}
            className="px-10 py-4 text-[11px] tracking-[0.18em] uppercase"
          />
          <Link
            href="/cart"
            className="inline-flex items-center justify-center border border-[#CCC9C2] text-[#444] px-8 py-4 text-[11px] tracking-[0.15em] uppercase font-medium hover:border-[#0A0A0A]"
          >
            View bag
          </Link>
        </div>
      </div>
    </section>
  );
}
