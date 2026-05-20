"use client";

import { CreditCard, Lock } from "lucide-react";
import { formatInr, orderTotal } from "@/lib/cart/pricing";
import { useCart } from "@/components/cart/CartProvider";

type Props = {
  signedIn: boolean;
  onPay?: () => void;
};

export default function PaymentPanel({ signedIn, onPay }: Props) {
  const { subtotal } = useCart();
  const total = orderTotal(subtotal);
  const razorpayReady = Boolean(process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID);

  return (
    <div className="bg-white border border-[#E5E2DB] p-8 sm:p-10">
      <div className="flex items-start gap-4 mb-8">
        <span className="w-10 h-10 flex items-center justify-center bg-[#F0EDE7] text-[#1C3A2A] shrink-0">
          <CreditCard size={18} />
        </span>
        <div>
          <h2 className="font-serif text-[22px] font-light text-[#0A0A0A] mb-2">Secure payment</h2>
          <p className="text-[14px] text-[#666] leading-[1.85] font-light">
            Pay with UPI, cards, netbanking, or wallets via Razorpay. Amount due:{" "}
            <strong className="text-[#0A0A0A] font-semibold">{formatInr(total)}</strong>
          </p>
        </div>
      </div>

      <ul className="space-y-3 mb-8 text-[13px] text-[#666]">
        <li className="flex items-center gap-2">
          <Lock size={14} className="text-[#1C3A2A] shrink-0" />
          256-bit encrypted checkout
        </li>
        <li className="flex items-center gap-2">
          <Lock size={14} className="text-[#1C3A2A] shrink-0" />
          Instant order confirmation by email
        </li>
      </ul>

      <button
        type="button"
        disabled={!signedIn || !razorpayReady}
        onClick={onPay}
        className="w-full bg-[#1C3A2A] text-white py-4 text-[11px] tracking-[0.18em] uppercase font-semibold hover:bg-[#152d20] transition-colors disabled:opacity-45 disabled:cursor-not-allowed"
      >
        Pay {formatInr(total)}
      </button>

      {!signedIn && (
        <p className="mt-4 text-[12px] text-[#999] text-center">Complete Google sign-in to unlock payment.</p>
      )}
      {signedIn && !razorpayReady && (
        <p className="mt-4 text-[12px] text-[#999] text-center">
          Razorpay keys are not configured yet. Add them to enable live payments.
        </p>
      )}
    </div>
  );
}
