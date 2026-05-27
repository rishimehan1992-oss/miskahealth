"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/components/cart/CartProvider";
import { readShipping } from "@/lib/checkout/storage";
import { formatInr, orderTotal, type PaymentMethod } from "@/lib/cart/pricing";
import { clearPaymentMethod } from "@/lib/checkout/storage";
import { clearCouponCode } from "@/lib/cart/coupon-storage";
import { useRazorpayReady } from "./RazorpayScript";

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => {
      open: () => void;
      on: (event: string, handler: (res: unknown) => void) => void;
    };
  }
}

type Props = {
  disabled?: boolean;
  className?: string;
  paymentMethod: PaymentMethod;
};

export default function RazorpayPayButton({ disabled, className = "", paymentMethod }: Props) {
  const router = useRouter();
  const { lines, pricedLines, subtotal, discountAmount, couponCode, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scriptReady = useRazorpayReady();

  const total = orderTotal(subtotal, paymentMethod, discountAmount);
  const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;

  const handlePay = async () => {
    setError(null);
    const shipping = readShipping();
    if (!shipping) {
      setError("Add delivery details before paying.");
      return;
    }
    if (!keyId) {
      setError("Razorpay is not configured.");
      return;
    }
    if (!scriptReady || !window.Razorpay) {
      setError("Payment is loading. Try again in a moment.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/razorpay/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lines,
          shipping,
          paymentMethod: "prepaid",
          couponCode: couponCode ?? undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error ?? "Could not start payment");
      }

      const rzp = new window.Razorpay({
        key: data.keyId,
        amount: data.amount,
        currency: data.currency,
        name: "MISKA Hair & Skin Science",
        description: "Order payment",
        order_id: data.razorpayOrderId,
        prefill: {
          name: data.customer.name,
          email: data.customer.email,
          contact: data.customer.contact,
        },
        theme: { color: "#1C3A2A" },
        handler: async (response: {
          razorpay_order_id: string;
          razorpay_payment_id: string;
          razorpay_signature: string;
        }) => {
          const shippingNow = readShipping();
          const verifyRes = await fetch("/api/razorpay/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              orderId: data.orderId,
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
              lines,
              shipping: shippingNow,
              couponCode: couponCode ?? undefined,
            }),
          });
          const verifyData = await verifyRes.json();
          if (!verifyRes.ok) {
            setError(verifyData.error ?? "Payment verification failed");
            setLoading(false);
            return;
          }
          if (verifyData.order) {
            sessionStorage.setItem("miska-last-order", JSON.stringify(verifyData.order));
          }
          clearCart();
          localStorage.removeItem("miska-shipping-v1");
          clearPaymentMethod();
          clearCouponCode();
          router.push(`/checkout/success?order=${data.orderId}`);
        },
        modal: {
          ondismiss: () => setLoading(false),
        },
      });

      rzp.on("payment.failed", () => {
        setError("Payment failed or was cancelled. Please try again.");
        setLoading(false);
      });

      rzp.open();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Payment could not be started");
      setLoading(false);
    }
  };

  return (
    <>
      <button
        type="button"
        disabled={disabled || loading || pricedLines.length === 0}
        onClick={handlePay}
        className={`w-full max-w-md bg-[#1C3A2A] text-white py-4 text-[11px] tracking-[0.18em] uppercase font-semibold hover:bg-[#152d20] transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${className}`}
      >
        {loading ? "Opening checkout…" : `Pay ${formatInr(total)}`}
      </button>
      {error && <p className="mt-3 text-[12px] text-[#B42318] font-light max-w-md">{error}</p>}
    </>
  );
}
