"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import CheckoutProgress from "./CheckoutProgress";
import ShippingForm from "./ShippingForm";
import CompactAuth from "./CompactAuth";
import SavedAddressPicker from "./SavedAddressPicker";
import DeliveryRecap from "./DeliveryRecap";
import PaymentPanel from "./PaymentPanel";
import OrderSummary from "./OrderSummary";
import MobileOrderSummary from "./MobileOrderSummary";
import CheckoutMobileBar from "./CheckoutMobileBar";
import { useCart } from "@/components/cart/CartProvider";
import {
  EMPTY_SHIPPING,
  parseCheckoutStep,
  type CheckoutStep,
  type ShippingAddress,
} from "@/lib/checkout/types";
import { readShipping, writeShipping, readPaymentMethod, writePaymentMethod } from "@/lib/checkout/storage";
import type { PaymentMethod } from "@/lib/cart/pricing";
import { hasErrors, validateShipping, type FieldErrors } from "@/lib/checkout/validate";
import { useAuth } from "@/components/auth/AuthProvider";
import { pageShell } from "@/lib/layout";

const SHIPPING_FORM_ID = "checkout-shipping";

export default function CheckoutFlow() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const rawStep = searchParams.get("step");
  const step = parseCheckoutStep(rawStep);
  const { pricedLines, itemCount, ready, openCart } = useCart();

  const [shipping, setShipping] = useState<ShippingAddress>(EMPTY_SHIPPING);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("prepaid");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [savedAddressId, setSavedAddressId] = useState<string | null>(null);
  const [saveAddress, setSaveAddress] = useState(true);
  const [addressReloadKey, setAddressReloadKey] = useState(0);
  const { user } = useAuth();
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const saved = readShipping();
    if (saved) setShipping(saved);
    setPaymentMethod(readPaymentMethod());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!rawStep || rawStep === "delivery" || rawStep === "pay") return;
    router.replace(`/checkout?step=${parseCheckoutStep(rawStep)}`);
  }, [rawStep, router]);

  useEffect(() => {
    if (!user?.email) return;
    setShipping((s) => {
      if (s.email) return s;
      return {
        ...s,
        email: user.email ?? s.email,
        fullName:
          s.fullName ||
          (user.user_metadata?.full_name as string) ||
          (user.user_metadata?.name as string) ||
          "",
      };
    });
  }, [user]);

  useEffect(() => {
    if (!ready || !hydrated) return;
    if (itemCount === 0 && step !== "delivery") {
      router.replace("/cart");
    }
  }, [ready, hydrated, itemCount, step, router]);

  const goTo = useCallback(
    (next: CheckoutStep) => {
      router.push(`/checkout?step=${next}`);
      window.scrollTo({ top: 0, behavior: "auto" });
    },
    [router]
  );

  const persistAddress = async (address: ShippingAddress) => {
    if (!user || savedAddressId) return;
    try {
      await fetch("/api/addresses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...address, setDefault: true }),
      });
    } catch {
      /* non-blocking */
    }
  };

  const onShippingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validation = validateShipping(shipping);
    setErrors(validation);
    if (hasErrors(validation)) return;
    writeShipping(shipping);
    if (user && saveAddress && !savedAddressId) {
      await persistAddress(shipping);
    }
    goTo("pay");
  };

  const headline = useMemo(() => {
    switch (step) {
      case "delivery":
        return "Delivery";
      case "pay":
        return "Payment";
    }
  }, [step]);

  const shippingValid = !hasErrors(validateShipping(shipping));
  const razorpayReady = Boolean(process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID);

  if (!hydrated || !ready) {
    return (
      <div className={`${pageShell} py-24 text-center text-[#999] text-[14px]`}>Loading checkout…</div>
    );
  }

  if (itemCount === 0) {
    return (
      <div className={`${pageShell} py-24 text-center`}>
        <p className="text-[15px] text-[#666] mb-6">Your bag is empty.</p>
        <Link
          href="/#products"
          className="inline-flex bg-[#1C3A2A] text-white px-8 py-3.5 text-[11px] tracking-[0.15em] uppercase font-semibold"
        >
          Shop products
        </Link>
      </div>
    );
  }

  return (
    <div className={`${pageShell} py-6 sm:py-12 pb-28 lg:pb-16`}>
      <CheckoutProgress current={step} />
      <MobileOrderSummary showEditLink={step === "pay"} paymentMethod={paymentMethod} />

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] xl:grid-cols-[1fr_340px] gap-8 lg:gap-12">
        <div className="min-w-0">
          <h1 className="font-serif text-[24px] sm:text-[32px] font-light text-[#0A0A0A] mb-4 sm:mb-6">
            {headline}
          </h1>

          {step === "delivery" && (
            <form id={SHIPPING_FORM_ID} onSubmit={onShippingSubmit}>
              <p className="text-[13px] text-[#666] font-light mb-5 max-w-md">
                Delivering across India. Two steps: delivery, then pay.
              </p>

              <CompactAuth
                defaultEmail={shipping.email}
                onSignedIn={() => setAddressReloadKey((k) => k + 1)}
              />

              {user && (
                <SavedAddressPicker
                  key={addressReloadKey}
                  selectedId={savedAddressId}
                  onSelectedIdChange={setSavedAddressId}
                  onSelect={setShipping}
                />
              )}

              <ShippingForm value={shipping} errors={errors} onChange={setShipping} compact />

              {user && !savedAddressId && (
                <label className="mt-4 flex items-center gap-2 text-[12px] text-[#666] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={saveAddress}
                    onChange={(e) => setSaveAddress(e.target.checked)}
                    className="accent-[#1C3A2A]"
                  />
                  Save this address for next time
                </label>
              )}

              <div className="hidden lg:flex mt-8 pt-6 shop-divider flex-col sm:flex-row gap-3">
                <button
                  type="submit"
                  className="flex-1 bg-[#1C3A2A] text-white py-3.5 text-[11px] tracking-[0.18em] uppercase font-semibold hover:bg-[#152d20]"
                >
                  Continue to pay
                </button>
                <button
                  type="button"
                  onClick={openCart}
                  className="flex-1 text-center py-3.5 border border-[#CCC9C2] text-[11px] tracking-[0.15em] uppercase text-[#666] font-medium hover:border-[#0A0A0A]"
                >
                  Edit bag
                </button>
              </div>
            </form>
          )}

          {step === "pay" && (
            <div>
              <DeliveryRecap shipping={shipping} onEdit={() => goTo("delivery")} />
              <PaymentPanel
                shipping={shipping}
                paymentMethod={paymentMethod}
                onPaymentMethodChange={(m) => {
                  setPaymentMethod(m);
                  writePaymentMethod(m);
                }}
                showPayButton="desktop"
              />
              <button
                type="button"
                onClick={() => goTo("delivery")}
                className="hidden lg:block mt-6 w-full max-w-md py-3.5 border border-[#CCC9C2] text-[11px] tracking-[0.15em] uppercase text-[#666] font-medium hover:border-[#0A0A0A]"
              >
                Edit delivery
              </button>
            </div>
          )}
        </div>

        <div className="hidden lg:block lg:sticky lg:top-24 lg:self-start">
          <OrderSummary showEditLink={step === "pay"} paymentMethod={paymentMethod} />
        </div>
      </div>

      <CheckoutMobileBar
        step={step}
        formId={step === "delivery" ? SHIPPING_FORM_ID : undefined}
        payDisabled={
          !shippingValid || (paymentMethod === "prepaid" && !razorpayReady)
        }
        paymentMethod={paymentMethod}
      />
    </div>
  );
}
