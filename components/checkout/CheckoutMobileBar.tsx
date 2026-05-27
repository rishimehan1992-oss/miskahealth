"use client";

import Link from "next/link";
import { formatInr, orderTotal, type PaymentMethod } from "@/lib/cart/pricing";
import { useCart } from "@/components/cart/CartProvider";
import type { CheckoutStep } from "@/lib/checkout/types";
import RazorpayPayButton from "./RazorpayPayButton";
import CodOrderButton from "./CodOrderButton";

type Props = {
  step: CheckoutStep;
  formId?: string;
  payDisabled?: boolean;
  paymentMethod: PaymentMethod;
};

export default function CheckoutMobileBar({
  step,
  formId,
  payDisabled,
  paymentMethod,
}: Props) {
  const { subtotal, discountAmount } = useCart();
  const total = orderTotal(subtotal, paymentMethod, discountAmount);

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#F9F8F5]/95 backdrop-blur-sm border-t border-[#E5E2DB] px-4 py-3 safe-area-pb">
      <div className="flex items-center gap-3 max-w-lg mx-auto">
        <div className="min-w-0 flex-1">
          <p className="text-[10px] tracking-[0.12em] uppercase text-[#999]">Total</p>
          <p className="text-[18px] font-semibold text-[#0A0A0A]">{formatInr(total)}</p>
        </div>
        {step === "delivery" ? (
          <>
            <Link
              href="/cart"
              className="shrink-0 py-3 px-3 border border-[#CCC9C2] text-[10px] tracking-[0.1em] uppercase text-[#666]"
            >
              Bag
            </Link>
            <button
              type="submit"
              form={formId}
              className="shrink-0 flex-1 max-w-[200px] bg-[#1C3A2A] text-white py-3.5 text-[10px] tracking-[0.15em] uppercase font-semibold"
            >
              Continue to pay
            </button>
          </>
        ) : paymentMethod === "prepaid" ? (
          <div className="flex-1 max-w-[240px]">
            <RazorpayPayButton
              disabled={payDisabled}
              paymentMethod={paymentMethod}
              className="max-w-none w-full py-3.5 text-[10px]"
            />
          </div>
        ) : (
          <div className="flex-1 max-w-[240px]">
            <CodOrderButton
              disabled={payDisabled}
              paymentMethod={paymentMethod}
              className="max-w-none w-full py-3.5 text-[10px]"
            />
          </div>
        )}
      </div>
    </div>
  );
}
