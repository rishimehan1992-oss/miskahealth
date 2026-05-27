import Link from "next/link";
import ShopHeader from "@/components/checkout/ShopHeader";
import CompactAuth from "@/components/checkout/CompactAuth";
import { createClient } from "@/lib/supabase/server";
import { pageShell } from "@/lib/layout";
import { formatInr } from "@/lib/cart/pricing";

type OrderRow = {
  id: string;
  status: string;
  amount_paise: number;
  subtotal: number;
  shipping_fee: number;
  created_at: string;
  razorpay_order_id: string;
  shipping: {
    fullName?: string;
    phone?: string;
    email?: string;
    addressLine1?: string;
    addressLine2?: string;
    city?: string;
    state?: string;
    pincode?: string;
  } | null;
};

type ItemRow = {
  order_id: string;
  product_slug: string;
  product_name: string;
  quantity: number;
  unit_price: number;
  line_total: number;
};

function statusLabel(o: Pick<OrderRow, "status" | "razorpay_order_id">) {
  const isCod = o.razorpay_order_id.startsWith("cod_");
  if (o.status === "cod_pending") return "COD pending";
  if (isCod && o.status === "created") return "COD pending";
  if (o.status === "paid") return "Paid";
  if (o.status === "failed") return "Failed";
  return "Created";
}

export default async function OrdersPage() {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  const user = userData.user;

  return (
    <main className="bg-[#F9F8F5] min-h-screen overflow-x-clip">
      <ShopHeader backHref="/#products" backLabel="Continue shopping" title="Orders" />

      <div className={`${pageShell} py-10 sm:py-16 pb-24`}>
        {!user ? (
          <div className="max-w-xl">
            <h1 className="font-serif text-[28px] sm:text-[36px] font-light text-[#0A0A0A] mb-4">
              My orders
            </h1>
            <p className="text-[15px] text-[#666] font-light leading-[1.9] mb-8">
              Sign in to see your past orders.
            </p>
            <CompactAuth redirectPath="/orders" />
          </div>
        ) : (
          <OrdersForUser userId={user.id} />
        )}
      </div>
    </main>
  );
}

async function OrdersForUser({ userId }: { userId: string }) {
  const supabase = await createClient();

  const { data: orders, error } = await supabase
    .from("orders")
    .select("id,status,amount_paise,subtotal,shipping_fee,created_at,razorpay_order_id,shipping")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .returns<OrderRow[]>();

  if (error) {
    return (
      <div className="max-w-xl">
        <h1 className="font-serif text-[28px] sm:text-[36px] font-light text-[#0A0A0A] mb-4">
          My orders
        </h1>
        <p className="text-[14px] text-[#B42318] font-light">
          Could not load orders. Please try again.
        </p>
      </div>
    );
  }

  const ids = (orders ?? []).map((o) => o.id);
  const itemsByOrder = new Map<string, ItemRow[]>();

  if (ids.length) {
    const { data: items } = await supabase
      .from("order_items")
      .select("order_id,product_slug,product_name,quantity,unit_price,line_total")
      .in("order_id", ids)
      .returns<ItemRow[]>();
    for (const it of items ?? []) {
      const list = itemsByOrder.get(it.order_id) ?? [];
      list.push(it);
      itemsByOrder.set(it.order_id, list);
    }
  }

  return (
    <div className="max-w-2xl">
      <div className="flex items-end justify-between gap-4 mb-10">
        <div>
          <h1 className="font-serif text-[28px] sm:text-[36px] font-light text-[#0A0A0A]">
            My orders
          </h1>
          <p className="text-[14px] text-[#666] font-light mt-2">
            Showing orders placed on this account.
          </p>
        </div>
        <Link
          href="/#products"
          className="text-[10px] tracking-[0.15em] uppercase font-semibold text-[#1C3A2A] hover:underline shrink-0"
        >
          Shop
        </Link>
      </div>

      {!orders?.length ? (
        <div className="rounded-lg border border-[#E5E2DB] bg-white p-6">
          <p className="text-[15px] text-[#666] font-light">No orders yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((o) => {
            const items = itemsByOrder.get(o.id) ?? [];
            const total = Math.round(o.amount_paise / 100);
            return (
              <article key={o.id} className="rounded-lg border border-[#E5E2DB] bg-white p-5 sm:p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-[11px] tracking-[0.14em] uppercase text-[#888] font-semibold">
                      Order
                    </p>
                    <p className="text-[16px] font-semibold text-[#0A0A0A] mt-1 break-all">{o.id}</p>
                    <p className="text-[13px] text-[#666] mt-1">
                      {new Date(o.created_at).toLocaleString("en-IN", {
                        year: "numeric",
                        month: "short",
                        day: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-[12px] font-semibold text-[#1C3A2A]">{statusLabel(o)}</p>
                    <p className="text-[16px] font-semibold text-[#0A0A0A] mt-1">{formatInr(total)}</p>
                  </div>
                </div>

                {items.length > 0 && (
                  <ul className="mt-5 pt-5 border-t border-[#EEEAE2] space-y-2">
                    {items.map((it) => (
                      <li key={`${it.order_id}:${it.product_slug}`} className="flex justify-between gap-4 text-[14px]">
                        <span className="text-[#0A0A0A]">
                          {it.product_name} <span className="text-[#999]">× {it.quantity}</span>
                        </span>
                        <span className="text-[#666]">{formatInr(it.line_total)}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {o.shipping && (
                  <div className="mt-5 pt-5 border-t border-[#EEEAE2] text-[13px] text-[#666] leading-relaxed">
                    <p className="text-[11px] tracking-[0.14em] uppercase text-[#888] font-semibold mb-2">
                      Delivery
                    </p>
                    <p className="text-[#0A0A0A] font-medium">{o.shipping.fullName ?? ""}</p>
                    <p>
                      {o.shipping.addressLine1 ?? ""}
                      {o.shipping.addressLine2 ? `, ${o.shipping.addressLine2}` : ""}
                      <br />
                      {o.shipping.city ?? ""}, {o.shipping.state ?? ""} {o.shipping.pincode ?? ""}
                    </p>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}

