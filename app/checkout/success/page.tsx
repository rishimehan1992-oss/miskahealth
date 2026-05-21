import Link from "next/link";
import ShopHeader from "@/components/checkout/ShopHeader";
import { getOrderById } from "@/lib/orders/store";
import { formatInr } from "@/lib/cart/pricing";
import { pageShell } from "@/lib/layout";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Order confirmed",
  robots: { index: false, follow: false },
};

type Props = { searchParams: Promise<{ order?: string }> };

export default async function CheckoutSuccessPage({ searchParams }: Props) {
  const { order: orderId } = await searchParams;
  const order = orderId ? await getOrderById(orderId) : undefined;
  const totalInr = order ? (order.subtotal + order.shippingFee) : null;

  return (
    <main className="bg-[#F9F8F5] min-h-screen overflow-x-clip">
      <ShopHeader backHref="/" title="Order confirmed" />
      <div className={`${pageShell} py-20 sm:py-28 max-w-lg`}>
        <p className="text-[10px] tracking-[0.2em] uppercase text-[#1C3A2A] font-semibold mb-4">Thank you</p>
        <h1 className="font-serif text-[32px] sm:text-[40px] font-light text-[#0A0A0A] mb-6">
          Payment received
        </h1>

        {order ? (
          <div className="space-y-6 text-[15px] text-[#666] font-light leading-[1.9]">
            <p>
              Your order <strong className="text-[#0A0A0A] font-medium">{order.id}</strong> is confirmed.
              {totalInr != null && <> Total paid: {formatInr(totalInr)}.</>}
            </p>
            <p>
              We will contact you at <strong className="text-[#0A0A0A] font-medium">{order.shipping.email}</strong>{" "}
              with updates.
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
            Your payment was successful. If you do not see order details here, check your email for confirmation.
          </p>
        )}

        <Link
          href="/#products"
          className="inline-flex mt-12 bg-[#1C3A2A] text-white px-10 py-4 text-[11px] tracking-[0.18em] uppercase font-semibold hover:bg-[#152d20]"
        >
          Continue shopping
        </Link>
      </div>
    </main>
  );
}
