"use client";

import { useState } from "react";
import type { PaymentMethod } from "@/lib/cart/pricing";
import OrderSummary from "./OrderSummary";

type Props = {
  showEditLink?: boolean;
  paymentMethod?: PaymentMethod;
};

/** Collapsible bag total on mobile — keeps the main column short */
export default function MobileOrderSummary({ showEditLink, paymentMethod = "prepaid" }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <div className="lg:hidden mb-6">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between py-3 px-3 border border-[#E5E2DB] text-[12px]"
      >
        <span className="font-semibold text-[#0A0A0A]">Order summary</span>
        <span className="text-[#999]">{open ? "Hide" : "Show"}</span>
      </button>
      {open && (
        <div className="mt-3 px-1">
          <OrderSummary showEditLink={showEditLink} paymentMethod={paymentMethod} />
        </div>
      )}
    </div>
  );
}
