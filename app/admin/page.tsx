"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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
    city?: string;
    state?: string;
    pincode?: string;
    addressLine1?: string;
  } | null;
};

type ItemRow = {
  order_id: string;
  product_name: string;
  quantity: number;
  unit_price: number;
  line_total: number;
};

const ALL_STATUSES = ["created", "paid", "failed", "cod_pending", "shipped", "delivered"];

const STATUS_COLOURS: Record<string, string> = {
  paid: "bg-[#D1FAE5] text-[#065F46]",
  delivered: "bg-[#D1FAE5] text-[#065F46]",
  shipped: "bg-[#DBEAFE] text-[#1D4ED8]",
  created: "bg-[#FEF3C7] text-[#92400E]",
  cod_pending: "bg-[#FEF3C7] text-[#92400E]",
  failed: "bg-[#FEE2E2] text-[#991B1B]",
};

function StatusBadge({ status }: { status: string }) {
  const cls = STATUS_COLOURS[status] ?? "bg-[#F3F4F6] text-[#374151]";
  return (
    <span className={`inline-block text-[10px] font-semibold tracking-wide uppercase px-2 py-0.5 rounded-full ${cls}`}>
      {status.replace("_", " ")}
    </span>
  );
}

export default function AdminDashboard() {
  const router = useRouter();
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [items, setItems] = useState<ItemRow[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("");
  const [updating, setUpdating] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ limit: "50" });
    if (filterStatus) params.set("status", filterStatus);
    const res = await fetch(`/api/admin/orders?${params.toString()}`);
    if (res.status === 401) { router.push("/admin/login"); return; }
    const data = await res.json();
    setOrders(data.orders ?? []);
    setItems(data.items ?? []);
    setTotal(data.total ?? 0);
    setLoading(false);
  }, [filterStatus, router]);

  useEffect(() => { void load(); }, [load]);

  const updateStatus = async (id: string, status: string) => {
    setUpdating(id);
    await fetch("/api/admin/orders", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    setUpdating(null);
    void load();
  };

  const logout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
  };

  // Stats
  const revenue = orders.filter(o => o.status === "paid" || o.status === "delivered")
    .reduce((sum, o) => sum + o.amount_paise / 100, 0);
  const codPending = orders.filter(o => o.status === "cod_pending").length;
  const todayOrders = orders.filter(o => new Date(o.created_at).toDateString() === new Date().toDateString()).length;

  return (
    <div className="min-h-screen bg-[#F9F8F5]">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-[#E5E2DB] px-5 sm:px-8 py-3 flex items-center justify-between">
        <div>
          <p className="text-[9px] tracking-[0.22em] uppercase text-[#1C3A2A] font-semibold">MISKA</p>
          <h1 className="font-serif text-[18px] font-light text-[#0A0A0A]">Admin Dashboard</h1>
        </div>
        <button
          onClick={logout}
          className="text-[11px] tracking-[0.12em] uppercase text-[#999] hover:text-[#0A0A0A] font-medium"
        >
          Sign out
        </button>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: "Total orders", value: total },
            { label: "Today", value: todayOrders },
            { label: "COD pending", value: codPending },
            { label: "Revenue (paid)", value: formatInr(revenue) },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-lg border border-[#E5E2DB] p-4">
              <p className="text-[10px] tracking-[0.14em] uppercase text-[#888] font-semibold">{s.label}</p>
              <p className="text-[24px] font-semibold text-[#0A0A0A] mt-1">{s.value}</p>
            </div>
          ))}
        </div>

        {/* Filter */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[11px] tracking-[0.1em] uppercase text-[#888] font-semibold mr-1">Filter:</span>
          {["", ...ALL_STATUSES].map((s) => (
            <button
              key={s || "all"}
              onClick={() => setFilterStatus(s)}
              className={`px-3 py-1.5 text-[11px] font-medium rounded-full border transition-colors ${
                filterStatus === s
                  ? "border-[#1C3A2A] bg-[#1C3A2A] text-white"
                  : "border-[#E5E2DB] text-[#666] hover:border-[#999]"
              }`}
            >
              {s ? s.replace("_", " ") : "All"}
            </button>
          ))}
          <button
            onClick={load}
            className="ml-auto text-[11px] tracking-[0.1em] uppercase text-[#1C3A2A] font-semibold hover:underline"
          >
            ↻ Refresh
          </button>
        </div>

        {/* Orders table */}
        {loading ? (
          <p className="text-[14px] text-[#999] py-12 text-center">Loading orders…</p>
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-lg border border-[#E5E2DB] p-10 text-center">
            <p className="text-[15px] text-[#999]">No orders found.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {orders.map((o) => {
              const orderItems = items.filter((i) => i.order_id === o.id);
              const isExpanded = expanded === o.id;
              const isCod = o.razorpay_order_id.startsWith("cod_");
              return (
                <div
                  key={o.id}
                  className="bg-white rounded-lg border border-[#E5E2DB] overflow-hidden"
                >
                  {/* Row */}
                  <div
                    className="flex flex-wrap items-center gap-3 px-4 sm:px-5 py-4 cursor-pointer hover:bg-[#FDFCFA]"
                    onClick={() => setExpanded(isExpanded ? null : o.id)}
                  >
                    <div className="min-w-0 flex-1">
                      <p className="text-[13px] font-semibold text-[#0A0A0A] truncate">{o.id}</p>
                      <p className="text-[12px] text-[#888] mt-0.5">
                        {new Date(o.created_at).toLocaleString("en-IN", {
                          day: "2-digit", month: "short", year: "numeric",
                          hour: "2-digit", minute: "2-digit",
                        })}
                        {" · "}
                        {isCod ? "COD" : "Prepaid"}
                      </p>
                    </div>

                    <div className="shrink-0 text-right">
                      <p className="text-[15px] font-semibold text-[#0A0A0A]">
                        {formatInr(o.amount_paise / 100)}
                      </p>
                    </div>

                    <StatusBadge status={o.status} />

                    <span className="text-[#CCC] text-[12px]">{isExpanded ? "▲" : "▼"}</span>
                  </div>

                  {/* Expanded */}
                  {isExpanded && (
                    <div className="border-t border-[#EDE9E1] px-4 sm:px-5 py-4 space-y-4 bg-[#FDFCFA]">
                      {/* Customer */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-[13px]">
                        <div>
                          <p className="text-[10px] tracking-[0.12em] uppercase text-[#AAA] font-semibold mb-1">Customer</p>
                          <p className="font-medium text-[#0A0A0A]">{o.shipping?.fullName ?? "—"}</p>
                          <p className="text-[#666]">{o.shipping?.phone ?? ""}</p>
                          <p className="text-[#666]">
                            {o.shipping?.addressLine1 ?? ""}
                            {o.shipping?.city ? `, ${o.shipping.city}` : ""}
                            {o.shipping?.state ? `, ${o.shipping.state}` : ""}
                            {o.shipping?.pincode ? ` ${o.shipping.pincode}` : ""}
                          </p>
                        </div>
                        <div>
                          <p className="text-[10px] tracking-[0.12em] uppercase text-[#AAA] font-semibold mb-1">Items</p>
                          {orderItems.map((it, idx) => (
                            <p key={idx} className="text-[#0A0A0A]">
                              {it.product_name} ×{it.quantity}
                              <span className="text-[#888]"> — {formatInr(it.line_total)}</span>
                            </p>
                          ))}
                        </div>
                      </div>

                      {/* Status update */}
                      <div className="flex flex-wrap items-center gap-2 pt-2">
                        <p className="text-[11px] tracking-[0.1em] uppercase text-[#888] font-semibold">
                          Change status:
                        </p>
                        {ALL_STATUSES.map((s) => (
                          <button
                            key={s}
                            disabled={o.status === s || updating === o.id}
                            onClick={() => updateStatus(o.id, s)}
                            className={`px-3 py-1.5 text-[11px] font-medium border rounded-full transition-colors disabled:opacity-40 ${
                              o.status === s
                                ? "border-[#1C3A2A] bg-[#1C3A2A] text-white cursor-default"
                                : "border-[#E5E2DB] text-[#555] hover:border-[#1C3A2A] hover:text-[#1C3A2A]"
                            }`}
                          >
                            {updating === o.id ? "…" : s.replace("_", " ")}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
