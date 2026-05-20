"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { useCart } from "./CartProvider";

export default function CartIconLink({ className = "" }: { className?: string }) {
  const { itemCount, ready } = useCart();

  return (
    <Link
      href="/cart"
      className={`relative inline-flex items-center justify-center p-2 text-[#444] hover:text-[#0A0A0A] transition-colors ${className}`}
      aria-label={itemCount > 0 ? `Cart, ${itemCount} items` : "Cart"}
    >
      <ShoppingBag size={20} strokeWidth={1.5} />
      {ready && itemCount > 0 && (
        <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 flex items-center justify-center rounded-full bg-[#1C3A2A] text-white text-[10px] font-semibold leading-none">
          {itemCount > 9 ? "9+" : itemCount}
        </span>
      )}
    </Link>
  );
}
