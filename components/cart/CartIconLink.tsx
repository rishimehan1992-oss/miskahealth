"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { useCart } from "./CartProvider";

type Props = {
  className?: string;
  ariaLabel?: string;
};

export default function CartIconLink({ className = "", ariaLabel }: Props) {
  const { itemCount, ready } = useCart();

  const label =
    ariaLabel ??
    (itemCount > 0 ? `View bag, ${itemCount} items` : "View bag");

  return (
    <Link
      href="/cart"
      className={`relative inline-flex items-center justify-center p-2 text-[#444] hover:text-[#0A0A0A] transition-colors touch-manipulation ${className}`}
      aria-label={label}
      title="View bag"
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
