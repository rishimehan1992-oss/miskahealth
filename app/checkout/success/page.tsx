import ShopHeader from "@/components/checkout/ShopHeader";
import CheckoutSuccessContent from "@/components/checkout/CheckoutSuccessContent";
import { fetchOrderById } from "@/lib/orders/persist";
import { pageShell } from "@/lib/layout";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Order placed",
  robots: { index: false, follow: false },
};

type Props = { searchParams: Promise<{ order?: string }> };

export default async function CheckoutSuccessPage({ searchParams }: Props) {
  const { order: orderId } = await searchParams;
  const serverOrder = orderId ? await fetchOrderById(orderId) : null;
  const isCod =
    serverOrder?.paymentMethod === "cod" || serverOrder?.status === "cod_pending";

  return (
    <main className="bg-[#F9F8F5] min-h-screen overflow-x-clip">
      <ShopHeader backHref="/orders" backLabel="My orders" title="Order confirmed" />
      <div className={`${pageShell} py-16 sm:py-24 max-w-lg`}>
        <p className="text-[10px] tracking-[0.2em] uppercase text-[#1C3A2A] font-semibold mb-4">
          Thank you
        </p>
        <h1 className="font-serif text-[32px] sm:text-[40px] font-light text-[#0A0A0A] mb-8 leading-[1.15]">
          {isCod ? (
            <>
              Order <em className="italic text-[#1C3A2A]">placed</em>
            </>
          ) : (
            <>
              Order <em className="italic text-[#1C3A2A]">confirmed</em>
            </>
          )}
        </h1>
        <CheckoutSuccessContent orderId={orderId} serverOrder={serverOrder ?? null} />
      </div>
    </main>
  );
};
