"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { formatInr } from "@/lib/cart/pricing";
import type { OrderRecord } from "@/lib/orders/types";
import { trackPurchase } from "@/lib/analytics/ecommerce";

const STORAGE_KEY = "miska-last-order";
const PURCHASE_SENT_KEY = "miska-pixel-purchase-sent-v1";

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

  useEffect(() => {
    if (!order) return;
    try {
      const sentRaw = sessionStorage.getItem(PURCHASE_SENT_KEY);
      const sent: Record<string, true> = sentRaw ? (JSON.parse(sentRaw) as Record<string, true>) : {};
      if (sent[order.id]) return;

      const items = order.items.map((i) => ({
        id: i.slug,
        quantity: i.quantity,
        item_price: i.unitPrice,
      }));
      trackPurchase({
        order_id: order.id,
        value: order.amountPaise / 100,
        items,
        shipping: order.shippingFee,
        coupon: order.couponCode,
      });

      sent[order.id] = true;
      sessionStorage.setItem(PURCHASE_SENT_KEY, JSON.stringify(sent));
    } catch {
      /* non-blocking */
    }
  }, [order]);

  const totalInr = order ? order.amountPaise / 100 : null;
  const isCod = order?.paymentMethod === "cod" || order?.status === "cod_pending";
  const displayId = order?.id ?? orderId;

  return (
    <div className="space-y-8">
      <div className="flex items-start gap-4">
        <CheckCircle2 className="w-10 h-10 text-[#1C3A2A] shrink-0 mt-0.5" strokeWidth={1.5} />
        <div>
          <p className="text-[17px] sm:text-[18px] text-[#0A0A0A] font-medium leading-snug">
            Thank you — your order is placed.
          </p>
          {displayId && (
            <p className="text-[13px] text-[#888] mt-2 font-light">
              Order ID: <span className="text-[#0A0A0A] font-medium">{displayId}</span>
            </p>
          )}
        </div>
      </div>

      {order ? (
        <div className="border border-[#E5E2DB] bg-white p-5 sm:p-6 space-y-4 text-[14px] text-[#555] font-light leading-[1.85]">
          {isCod ? (
            <p>
              We will deliver to{" "}
              <strong className="text-[#0A0A0A] font-medium">{order.shipping.fullName}</strong>,{" "}
              {order.shipping.city}, {order.shipping.pincode}. Pay{" "}
              <strong className="text-[#0A0A0A] font-medium">{formatInr(totalInr ?? 0)}</strong> in cash on
              delivery (includes ₹{order.shippingFee} shipping).
            </p>
          ) : (
            <p>
              Payment received
              {totalInr != null && (
                <>
                  {" "}
                  — <strong className="text-[#0A0A0A] font-medium">{formatInr(totalInr)}</strong>
                </>
              )}
              . We will ship to{" "}
              <strong className="text-[#0A0A0A] font-medium">{order.shipping.fullName}</strong>,{" "}
              {order.shipping.city}.
            </p>
          )}
          <p>
            Updates at{" "}
            <strong className="text-[#0A0A0A] font-medium">{order.shipping.email}</strong>
            {order.shipping.phone ? (
              <>
                {" "}
                and <strong className="text-[#0A0A0A] font-medium">{order.shipping.phone}</strong>
              </>
            ) : null}
            .
          </p>
          <ul className="shop-divider pt-4 space-y-2 text-[13px]">
            {order.items.map((item) => (
              <li key={item.slug} className="flex justify-between gap-4">
                <span>
                  {item.name} × {item.quantity}
                </span>
                <span className="text-[#0A0A0A] shrink-0">{formatInr(item.lineTotal)}</span>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p className="text-[15px] text-[#666] font-light leading-[1.9]">
          {orderId ? (
            <>
              Your order <strong className="text-[#0A0A0A] font-medium">{orderId}</strong> is confirmed. Check
              your email for details.
            </>
          ) : (
            <>Your payment was successful. Check your email for confirmation.</>
          )}
        </p>
      )}

      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <Link
          href="/orders"
          className="inline-flex justify-center items-center bg-[#1C3A2A] text-white px-8 py-4 text-[11px] tracking-[0.18em] uppercase font-semibold hover:bg-[#152d20]"
        >
          View my orders
        </Link>
        <Link
          href="/#products"
          className="inline-flex justify-center items-center border border-[#E5E2DB] bg-white text-[#0A0A0A] px-8 py-4 text-[11px] tracking-[0.18em] uppercase font-semibold hover:border-[#1C3A2A] hover:text-[#1C3A2A]"
        >
          Continue shopping
        </Link>
      </div>

      <p className="text-[12px] text-[#AAA] font-light">
        Sign in on the orders page with the same email to see status and history.
      </p>
    </div>
  );
}
