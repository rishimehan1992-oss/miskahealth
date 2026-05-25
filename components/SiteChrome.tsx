"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import CartDrawer from "./cart/CartDrawer";
import { useCart } from "./cart/CartProvider";

type Props = {
  children: React.ReactNode;
};

export default function SiteChrome({ children }: Props) {
  const searchParams = useSearchParams();
  const { openCart } = useCart();

  useEffect(() => {
    if (searchParams.get("cart") === "open") {
      openCart();
    }
  }, [searchParams, openCart]);

  return (
    <>
      <CartDrawer />
      {children}
    </>
  );
}
