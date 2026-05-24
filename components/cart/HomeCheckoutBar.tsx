"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "./CartProvider";
import { formatInr, orderTotal } from "@/lib/cart/pricing";

/** When bag has items on home, one-tap path to checkout. */
export default function HomeCheckoutBar() {
  const pathname = usePathname();
  const { itemCount, subtotal, ready } = useCart();

  if (pathname !== "/" || !ready || itemCount === 0) return null;

  return (
    <div className="fixed bottom-0 inset-x-0 z-40 md:hidden bg-[#0A0A0A]/95 backdrop-blur-sm border-t border-[#333] px-4 py-3 safe-area-pb">
      <Link
        href="/checkout"
        className="flex items-center justify-between w-full max-w-lg mx-auto text-white touch-manipulation"
      >
        <span className="text-[11px] tracking-[0.12em] uppercase font-semibold">
          Checkout · {itemCount} {itemCount === 1 ? "item" : "items"}
        </span>
        <span className="text-[15px] font-semibold">{formatInr(orderTotal(subtotal))}</span>
      </Link>
    </div>
  );
}
