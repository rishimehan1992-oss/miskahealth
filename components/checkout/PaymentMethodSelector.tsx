"use client";

import { COD_SHIPPING_FEE, formatInr, type PaymentMethod } from "@/lib/cart/pricing";
import { useCart } from "@/components/cart/CartProvider";
import { trackAddPaymentInfo } from "@/lib/meta/pixel";

type Props = {
  value: PaymentMethod;
  onChange: (method: PaymentMethod) => void;
};

export default function PaymentMethodSelector({ value, onChange }: Props) {
  const { pricedLines, subtotal } = useCart();
  const items = pricedLines.map((l) => ({ id: l.slug, quantity: l.quantity, item_price: l.unitPrice }));
  return (
    <div className="mb-6" role="radiogroup" aria-label="Payment method">
      <p className="text-[11px] tracking-[0.14em] uppercase font-semibold text-[#0A0A0A] mb-3">
        How do you want to pay?
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-xl">
        <label
          className={`flex cursor-pointer gap-3 p-4 border-2 transition-colors ${
            value === "prepaid"
              ? "border-[#1C3A2A] bg-[#1C3A2A]/[0.04]"
              : "border-[#E5E2DB] bg-white hover:border-[#CCC9C2]"
          }`}
        >
          <input
            type="radio"
            name="payment-method"
            value="prepaid"
            checked={value === "prepaid"}
            onChange={() => {
              onChange("prepaid");
              trackAddPaymentInfo({ value: subtotal, items, payment_method: "prepaid" });
            }}
            className="mt-1 accent-[#1C3A2A]"
          />
          <span>
            <span className="block text-[14px] font-semibold text-[#0A0A0A]">Pay now</span>
            <span className="block text-[12px] text-[#666] mt-1 font-light">
              UPI, cards, wallets · <strong className="text-[#1C3A2A] font-medium">Free shipping</strong>
            </span>
          </span>
        </label>

        <label
          className={`flex cursor-pointer gap-3 p-4 border-2 transition-colors ${
            value === "cod"
              ? "border-[#1C3A2A] bg-[#1C3A2A]/[0.04]"
              : "border-[#E5E2DB] bg-white hover:border-[#CCC9C2]"
          }`}
        >
          <input
            type="radio"
            name="payment-method"
            value="cod"
            checked={value === "cod"}
            onChange={() => {
              onChange("cod");
              trackAddPaymentInfo({ value: subtotal, items, payment_method: "cod" });
            }}
            className="mt-1 accent-[#1C3A2A]"
          />
          <span>
            <span className="block text-[14px] font-semibold text-[#0A0A0A]">Cash on delivery</span>
            <span className="block text-[12px] text-[#666] mt-1 font-light">
              Pay when your order arrives · Shipping {formatInr(COD_SHIPPING_FEE)}
            </span>
          </span>
        </label>
      </div>
    </div>
  );
}
