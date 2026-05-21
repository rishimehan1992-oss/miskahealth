"use client";

import { formatInr, orderTotal } from "@/lib/cart/pricing";
import { useCart } from "@/components/cart/CartProvider";
import RazorpayPayButton from "./RazorpayPayButton";
import type { ShippingAddress } from "@/lib/checkout/types";
import { validateShipping, hasErrors } from "@/lib/checkout/validate";

type Props = {
  shipping: ShippingAddress | null;
};

export default function PaymentPanel({ shipping }: Props) {
  const { subtotal } = useCart();
  const total = orderTotal(subtotal);
  const razorpayReady = Boolean(process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID);
  const shippingValid = shipping ? !hasErrors(validateShipping(shipping)) : false;

  return (
    <div className="shop-divider pt-10">
      <p className="text-[10px] tracking-[0.2em] uppercase text-[#1C3A2A] font-semibold mb-4">Payment</p>
      <h2 className="font-serif text-[26px] sm:text-[30px] font-light text-[#0A0A0A] mb-4">Secure checkout</h2>
      <p className="text-[15px] text-[#666] leading-[1.9] font-light max-w-lg mb-8">
        Pay with UPI, cards, netbanking, or wallets via Razorpay. Amount due:{" "}
        <strong className="text-[#0A0A0A] font-semibold">{formatInr(total)}</strong>
      </p>

      <ul className="space-y-2 mb-10 text-[13px] text-[#888] font-light">
        <li>256-bit encrypted checkout</li>
        <li>Instant order confirmation</li>
      </ul>

      <RazorpayPayButton disabled={!razorpayReady || !shippingValid} />

      {!shippingValid && (
        <p className="mt-5 text-[12px] text-[#999] font-light">
          Complete delivery details on the previous step before paying.
        </p>
      )}
      {shippingValid && !razorpayReady && (
        <p className="mt-5 text-[12px] text-[#999] font-light max-w-md">
          Razorpay keys are not configured. Add them to <code className="text-[11px]">.env.local</code>.
        </p>
      )}
    </div>
  );
}
