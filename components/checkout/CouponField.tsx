"use client";

import { useState } from "react";
import { useCart } from "@/components/cart/CartProvider";
import { COMBO_COUPON_CODES, COMBO_DISCOUNT_INR, cartHasCombo } from "@/lib/cart/coupons";
import { formatInr } from "@/lib/cart/pricing";

export default function CouponField() {
  const { lines, couponCode, discountAmount, applyCoupon, removeCoupon } = useCart();
  const [input, setInput] = useState(couponCode ?? "");
  const [error, setError] = useState<string | null>(null);

  const comboInCart = cartHasCombo(lines);

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    const result = applyCoupon(input);
    if (result.ok) {
      setError(null);
    } else {
      setError(result.error);
    }
  };

  const primaryCode = COMBO_COUPON_CODES[0];

  return (
    <div className="mb-6 pb-6 border-b border-[#EDE9E1]">
      {discountAmount > 0 && couponCode ? (
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-[13px] font-medium text-[#0A0A0A]">
              {couponCode} applied
            </p>
            <p className="text-[12px] text-[#1C3A2A] mt-0.5">
              −{formatInr(discountAmount)} combo discount
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              removeCoupon();
              setInput("");
              setError(null);
            }}
            className="text-[12px] font-semibold text-[#666] hover:text-[#0A0A0A] shrink-0"
          >
            Remove
          </button>
        </div>
      ) : (
        <>
          <p className="text-[12px] text-[#888] mb-2 leading-relaxed">
            Shampoo + Oil or Shampoo + Serum: use{" "}
            <span className="font-semibold text-[#0A0A0A]">{primaryCode}</span> for{" "}
            {formatInr(COMBO_DISCOUNT_INR)} off
            {!comboInCart && (
              <span className="text-[#AAA]"> (add both products to qualify)</span>
            )}
          </p>
          <form onSubmit={handleApply} className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                setError(null);
              }}
              placeholder="Coupon code"
              autoComplete="off"
              className="shop-input shop-input-checkout flex-1 min-w-0 text-[14px] uppercase"
              aria-label="Coupon code"
            />
            <button
              type="submit"
              className="shrink-0 px-4 py-2 border border-[#1C3A2A] text-[11px] tracking-[0.12em] uppercase font-semibold text-[#1C3A2A] hover:bg-[#1C3A2A]/5"
            >
              Apply
            </button>
          </form>
          {error && <p className="text-[12px] text-[#B42318] mt-2">{error}</p>}
        </>
      )}
    </div>
  );
}
