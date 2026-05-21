"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import CheckoutProgress from "./CheckoutProgress";
import ShippingForm from "./ShippingForm";
import GoogleSignInPanel from "./GoogleSignInPanel";
import PaymentPanel from "./PaymentPanel";
import OrderSummary from "./OrderSummary";
import { useCart } from "@/components/cart/CartProvider";
import { EMPTY_SHIPPING, type CheckoutStep, type ShippingAddress } from "@/lib/checkout/types";
import { readShipping, writeShipping } from "@/lib/checkout/storage";
import { hasErrors, validateShipping, type FieldErrors } from "@/lib/checkout/validate";
import { pageShell } from "@/lib/layout";

const AUTH_PREVIEW_KEY = "miska-checkout-auth-preview";

function parseStep(raw: string | null): CheckoutStep {
  if (raw === "account" || raw === "payment") return raw;
  return "shipping";
}

export default function CheckoutFlow() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const step = parseStep(searchParams.get("step"));
  const { pricedLines, itemCount, ready } = useCart();

  const [shipping, setShipping] = useState<ShippingAddress>(EMPTY_SHIPPING);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [signedIn, setSignedIn] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const saved = readShipping();
    if (saved) setShipping(saved);
    setSignedIn(sessionStorage.getItem(AUTH_PREVIEW_KEY) === "1");
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!ready || !hydrated) return;
    if (itemCount === 0 && step !== "shipping") {
      router.replace("/cart");
    }
  }, [ready, hydrated, itemCount, step, router]);

  const goTo = useCallback(
    (next: CheckoutStep) => {
      router.push(`/checkout?step=${next}`);
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    [router]
  );

  const onShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validation = validateShipping(shipping);
    setErrors(validation);
    if (hasErrors(validation)) return;
    writeShipping(shipping);
    goTo("payment");
  };

  const devSkipAuth = () => {
    sessionStorage.setItem(AUTH_PREVIEW_KEY, "1");
    setSignedIn(true);
    goTo("payment");
  };

  const headline = useMemo(() => {
    switch (step) {
      case "shipping":
        return "Delivery details";
      case "account":
        return "Your account";
      case "payment":
        return "Payment";
    }
  }, [step]);

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
    <div className={`${pageShell} py-10 sm:py-16 pb-24`}>
      <CheckoutProgress current={step} />

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] xl:grid-cols-[1fr_380px] gap-12 lg:gap-16 xl:gap-20">
        <div className="min-w-0">
          <p className="text-[10px] tracking-[0.2em] uppercase text-[#1C3A2A] font-semibold mb-3">Checkout</p>
          <h1 className="font-serif text-[28px] sm:text-[36px] font-light text-[#0A0A0A] mb-8 sm:mb-10">{headline}</h1>

          {step === "shipping" && (
            <form onSubmit={onShippingSubmit}>
              <p className="text-[15px] text-[#666] font-light leading-[1.9] mb-10 max-w-lg">
                We deliver across India. Checkout as a guest — sign in with Google before payment.
              </p>
              <ShippingForm value={shipping} errors={errors} onChange={setShipping} />
              <div className="mt-12 pt-10 shop-divider flex flex-col sm:flex-row gap-4">
                <button
                  type="submit"
                  className="flex-1 bg-[#1C3A2A] text-white py-4 text-[11px] tracking-[0.18em] uppercase font-semibold hover:bg-[#152d20]"
                >
                  Continue to payment
                </button>
                <Link
                  href="/cart"
                  className="flex-1 text-center py-4 border border-[#CCC9C2] text-[11px] tracking-[0.15em] uppercase text-[#666] font-medium hover:border-[#0A0A0A]"
                >
                  Back to bag
                </Link>
              </div>
            </form>
          )}

          {step === "account" && (
            <div className="space-y-6">
              <GoogleSignInPanel onContinue={devSkipAuth} />
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => goTo("shipping")}
                  className="flex-1 py-4 border border-[#CCC9C2] text-[11px] tracking-[0.15em] uppercase text-[#666] font-medium hover:border-[#0A0A0A]"
                >
                  Edit delivery
                </button>
                {signedIn && (
                  <button
                    type="button"
                    onClick={() => goTo("payment")}
                    className="flex-1 bg-[#1C3A2A] text-white py-4 text-[11px] tracking-[0.18em] uppercase font-semibold hover:bg-[#152d20]"
                  >
                    Continue to payment
                  </button>
                )}
              </div>
            </div>
          )}

          {step === "payment" && (
            <div className="space-y-6">
              <PaymentPanel shipping={shipping} />
              <button
                type="button"
                onClick={() => goTo("account")}
                className="w-full py-4 border border-[#CCC9C2] text-[11px] tracking-[0.15em] uppercase text-[#666] font-medium hover:border-[#0A0A0A]"
              >
                Back
              </button>
            </div>
          )}
        </div>

        <div className="lg:sticky lg:top-28 lg:self-start">
          <OrderSummary showEditLink={step !== "shipping"} />
        </div>
      </div>
    </div>
  );
}
