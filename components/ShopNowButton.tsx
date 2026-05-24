"use client";

import { usePathname, useRouter } from "next/navigation";
import { useCallback, type ReactNode } from "react";
import { scrollToSection } from "@/lib/scroll-to-section";
import { useCart } from "@/components/cart/CartProvider";

type Props = {
  className?: string;
  /** Override label; default is Shop / Checkout based on cart */
  children?: ReactNode;
  onAfterClick?: () => void;
};

export default function ShopNowButton({ className = "", children, onAfterClick }: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const { itemCount, ready } = useCart();

  const hasItems = ready && itemCount > 0;
  const label = children ?? (hasItems ? "Checkout" : "Shop now");

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      e.stopPropagation();
      onAfterClick?.();

      if (hasItems) {
        router.push("/checkout");
        return;
      }

      if (pathname === "/") {
        scrollToSection("products");
        return;
      }

      router.push("/#products");
    },
    [hasItems, pathname, router, onAfterClick]
  );

  return (
    <button
      type="button"
      onClick={handleClick}
      className={className}
      aria-label={hasItems ? "Go to checkout" : "Browse products"}
    >
      {label}
    </button>
  );
}
