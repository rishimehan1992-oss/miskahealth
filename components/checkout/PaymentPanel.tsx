"use client";

import { formatInr, orderTotal } from "@/lib/cart/pricing";
import { useCart } from "@/components/cart/CartProvider";
import RazorpayPayButton from "./RazorpayPayButton";
import type { ShippingAddress } from "@/lib/checkout/types";
import { validateShipping, hasErrors } from "@/lib/checkout/validate";

type Props = {
  shipping: ShippingAddress | null;
  /** Pay button lives in sticky mobile bar; show here on desktop only */
  showPayButton?: "all" | "desktop";
};

export default function PaymentPanel({ shipping, showPayButton = "all" }: Props) {
  const { subtotal } = useCart();
  const total = orderTotal(subtotal);
  const razorpayReady = Boolean(process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID);
  const shippingValid = shipping ? !hasErrors(validateShipping(shipping)) : false;

  const payBtnClass =
    showPayButton === "desktop" ? "hidden lg:block max-w-md" : "max-w-md";

  return (
    <div>
      <p className="text-[13px] text-[#666] font-light mb-4">
        UPI, cards, netbanking via Razorpay ·{" "}
        <strong className="text-[#0A0A0A]">{formatInr(total)}</strong>
      </p>

      <div className={payBtnClass}>
        <RazorpayPayButton disabled={!razorpayReady || !shippingValid} />
      </div>

      {!shippingValid && (
        <p className="mt-4 text-[12px] text-[#999] font-light">
          Complete delivery details before paying.
        </p>
      )}
      {shippingValid && !razorpayReady && (
        <p className="mt-4 text-[12px] text-[#999] font-light max-w-md">
          Razorpay keys are not configured. Add them to <code className="text-[11px]">.env.local</code>.
        </p>
      )}
      {shippingValid && razorpayReady && showPayButton === "desktop" && (
        <p className="lg:hidden mt-3 text-[12px] text-[#999]">Use the Pay button below.</p>
      )}
    </div>
  );
}
