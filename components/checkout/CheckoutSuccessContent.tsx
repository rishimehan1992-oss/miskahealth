"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { formatInr } from "@/lib/cart/pricing";
import type { OrderRecord } from "@/lib/orders/types";

const STORAGE_KEY = "miska-last-order";

export default function CheckoutSuccessContent({
  orderId,
  serverOrder,
}: {
  orderId?: string;
  serverOrder: OrderRecord | null;
}) {
  const [order, setOrder] = useState<OrderRecord | null>(serverOrder);

  useEffect(() => {
    if (serverOrder) return;
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as OrderRecord;
      if (!orderId || parsed.id === orderId) {
        setOrder(parsed);
        sessionStorage.removeItem(STORAGE_KEY);
      }
    } catch {
      /* ignore */
    }
  }, [orderId, serverOrder]);

  const totalInr = order ? order.subtotal + order.shippingFee : null;
  const isCod = order?.paymentMethod === "cod" || order?.status === "cod_pending";

  return (
    <>
      {order ? (
        <div className="space-y-6 text-[15px] text-[#666] font-light leading-[1.9]">
          <p>
            Your order <strong className="text-[#0A0A0A] font-medium">{order.id}</strong> is confirmed.
            {totalInr != null && (
              <>
                {" "}
                {isCod ? (
                  <>
                    Pay <strong className="text-[#0A0A0A] font-medium">{formatInr(totalInr)}</strong> in cash when
                    your order arrives (includes ₹{order.shippingFee} COD shipping).
                  </>
                ) : (
                  <>Total paid: {formatInr(totalInr)}.</>
                )}
              </>
            )}
          </p>
          <p>
            We will contact you at{" "}
            <strong className="text-[#0A0A0A] font-medium">{order.shipping.email}</strong> with updates.
          </p>
          <ul className="shop-divider pt-6 space-y-2 text-[13px]">
            {order.items.map((item) => (
              <li key={item.slug}>
                {item.name} × {item.quantity} — {formatInr(item.lineTotal)}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p className="text-[15px] text-[#666] font-light leading-[1.9] mb-10">
          Your payment was successful
          {orderId ? (
            <>
              {" "}
              (reference <strong className="text-[#0A0A0A] font-medium">{orderId}</strong>)
            </>
          ) : null}
          . Check your email for confirmation.
        </p>
      )}

      <Link
        href="/#products"
        className="inline-flex mt-12 bg-[#1C3A2A] text-white px-10 py-4 text-[11px] tracking-[0.18em] uppercase font-semibold hover:bg-[#152d20]"
      >
        Continue shopping
      </Link>
    </>
  );
}
