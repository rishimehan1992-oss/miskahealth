import Link from "next/link";
import ShopHeader from "@/components/checkout/ShopHeader";
import { pageShell } from "@/lib/layout";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Order confirmed",
  robots: { index: false, follow: false },
};

export default function CheckoutSuccessPage() {
  return (
    <main className="bg-[#F9F8F5] min-h-screen overflow-x-clip">
      <ShopHeader backHref="/" title="Order confirmed" />
      <div className={`${pageShell} py-20 sm:py-28 text-center max-w-lg mx-auto`}>
        <p className="text-[10px] tracking-[0.2em] uppercase text-[#1C3A2A] font-semibold mb-4">Thank you</p>
        <h1 className="font-serif text-[32px] sm:text-[40px] font-light text-[#0A0A0A] mb-6">
          Order received
        </h1>
        <p className="text-[15px] text-[#666] leading-[1.9] font-light mb-10">
          This page will show your order ID and tracking once Razorpay and order storage are connected.
        </p>
        <Link
          href="/#products"
          className="inline-flex bg-[#1C3A2A] text-white px-10 py-4 text-[11px] tracking-[0.18em] uppercase font-semibold hover:bg-[#152d20]"
        >
          Continue shopping
        </Link>
      </div>
    </main>
  );
}
