"use client";

import { formatInr, orderTotal, shippingLabel, type PaymentMethod } from "@/lib/cart/pricing";
import { useCart } from "@/components/cart/CartProvider";
import RazorpayPayButton from "./RazorpayPayButton";
import CodOrderButton from "./CodOrderButton";
import PaymentMethodSelector from "./PaymentMethodSelector";
import type { ShippingAddress } from "@/lib/checkout/types";
import { validateShipping, hasErrors } from "@/lib/checkout/validate";

type Props = {
  shipping: ShippingAddress | null;
  paymentMethod: PaymentMethod;
  onPaymentMethodChange: (method: PaymentMethod) => void;
  showPayButton?: "all" | "desktop";
};

export default function PaymentPanel({
  shipping,
  paymentMethod,
  onPaymentMethodChange,
  showPayButton = "all",
}: Props) {
  const { subtotal, discountAmount } = useCart();
  const total = orderTotal(subtotal, paymentMethod, discountAmount);
  const razorpayReady = Boolean(process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID);
  const shippingValid = shipping ? !hasErrors(validateShipping(shipping)) : false;

  const payBtnClass =
    showPayButton === "desktop" ? "hidden lg:block max-w-md" : "max-w-md";

  return (
    <div>
      <PaymentMethodSelector value={paymentMethod} onChange={onPaymentMethodChange} />

      <dl className="mb-5 max-w-md text-[13px] font-light space-y-2">
        <div className="flex justify-between text-[#666]">
          <dt>Shipping ({paymentMethod === "cod" ? "COD" : "prepaid"})</dt>
          <dd className="font-medium text-[#0A0A0A]">{shippingLabel(paymentMethod)}</dd>
        </div>
        <div className="flex justify-between text-[#0A0A0A] font-semibold text-[15px] pt-2 border-t border-[#EDE9E1]">
          <dt>Total</dt>
          <dd>{formatInr(total)}</dd>
        </div>
      </dl>

      <div className={payBtnClass}>
        {paymentMethod === "prepaid" ? (
          <RazorpayPayButton
            disabled={!razorpayReady || !shippingValid}
            paymentMethod={paymentMethod}
          />
        ) : (
          <CodOrderButton
            disabled={!shippingValid}
            paymentMethod={paymentMethod}
          />
        )}
      </div>

      {!shippingValid && (
        <p className="mt-4 text-[12px] text-[#999] font-light">
          Complete delivery details before {paymentMethod === "cod" ? "placing your order" : "paying"}.
        </p>
      )}
      {shippingValid && paymentMethod === "prepaid" && !razorpayReady && (
        <p className="mt-4 text-[12px] text-[#999] font-light max-w-md">
          Razorpay keys are not configured. Add them to <code className="text-[11px]">.env.local</code>.
        </p>
      )}
      {shippingValid && showPayButton === "desktop" && (
        <p className="lg:hidden mt-3 text-[12px] text-[#999]">
          Use the button below to {paymentMethod === "cod" ? "place your order" : "pay"}.
        </p>
      )}
    </div>
  );
}
