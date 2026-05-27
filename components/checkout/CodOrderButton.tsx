"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/components/cart/CartProvider";
import { readShipping, clearShipping, clearPaymentMethod } from "@/lib/checkout/storage";
import { clearCouponCode } from "@/lib/cart/coupon-storage";
import { formatInr, orderTotal, type PaymentMethod } from "@/lib/cart/pricing";

type Props = {
  disabled?: boolean;
  paymentMethod: PaymentMethod;
  className?: string;
};

export default function CodOrderButton({ disabled, paymentMethod, className = "" }: Props) {
  const router = useRouter();
  const { lines, subtotal, discountAmount, couponCode, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const total = orderTotal(subtotal, paymentMethod, discountAmount);

  const handlePlace = async () => {
    setError(null);
    const shipping = readShipping();
    if (!shipping) {
      setError("Add delivery details before placing your order.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/orders/place-cod", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lines, shipping, couponCode: couponCode ?? undefined }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error ?? "Could not place order");
      }

      if (data.order) {
        sessionStorage.setItem("miska-last-order", JSON.stringify(data.order));
      }
      clearCart();
      clearShipping();
      clearPaymentMethod();
      clearCouponCode();
      router.push(`/checkout/success?order=${data.orderId}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Order could not be placed");
      setLoading(false);
    }
  };

  return (
    <>
      <button
        type="button"
        disabled={disabled || loading || paymentMethod !== "cod"}
        onClick={handlePlace}
        className={`w-full max-w-md bg-[#1C3A2A] text-white py-4 text-[11px] tracking-[0.18em] uppercase font-semibold hover:bg-[#152d20] transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${className}`}
      >
        {loading ? "Placing order…" : `Place COD order · ${formatInr(total)}`}
      </button>
      {error && <p className="mt-3 text-[12px] text-[#B42318] font-light max-w-md">{error}</p>}
    </>
  );
}
