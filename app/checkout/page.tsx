import { Suspense } from "react";
import type { Metadata } from "next";
import ShopHeader from "@/components/checkout/ShopHeader";
import CheckoutFlow from "@/components/checkout/CheckoutFlow";
import { RazorpayScriptProvider } from "@/components/checkout/RazorpayScript";

export const metadata: Metadata = {
  title: "Checkout",
  robots: { index: false, follow: false },
};

export default function CheckoutPage() {
  return (
    <main className="bg-[#F9F8F5] min-h-screen overflow-x-clip">
      <ShopHeader backHref="/cart" backLabel="Back to bag" title="Checkout" />
      <RazorpayScriptProvider>
        <Suspense fallback={<div className="page-shell py-24 text-center text-[#999]">Loading…</div>}>
          <CheckoutFlow />
        </Suspense>
      </RazorpayScriptProvider>
    </main>
  );
}
