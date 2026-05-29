import { NextResponse, type NextRequest } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

function isAdminAuthed(request: NextRequest) {
  const session = request.cookies.get("miska-admin-session")?.value;
  const adminPass = process.env.ADMIN_PASSWORD;
  return adminPass && session === adminPass;
}

export async function GET(request: NextRequest) {
  if (!isAdminAuthed(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const admin = createAdminClient();
  if (!admin) {
    return NextResponse.json({ error: "Database not configured" }, { status: 503 });
  }

  const url = new URL(request.url);
  const limit = Math.min(Number(url.searchParams.get("limit") ?? "50"), 100);
  const offset = Number(url.searchParams.get("offset") ?? "0");
  const status = url.searchParams.get("status");

  let query = admin
    .from("orders")
    .select("id,status,amount_paise,subtotal,shipping_fee,shipping,created_at,razorpay_order_id,user_id", {
      count: "exact",
    })
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (status) query = query.eq("status", status);

  const { data: orders, error, count } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // fetch items for these orders
  const ids = (orders ?? []).map((o) => o.id);
  const { data: items } = ids.length
    ? await admin
        .from("order_items")
        .select("order_id,product_name,quantity,unit_price,line_total")
        .in("order_id", ids)
    : { data: [] };

  return NextResponse.json({ orders: orders ?? [], items: items ?? [], total: count ?? 0 });
}

export async function PATCH(request: NextRequest) {
  if (!isAdminAuthed(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const admin = createAdminClient();
  if (!admin) return NextResponse.json({ error: "Database not configured" }, { status: 503 });

  const body = (await request.json()) as { id: string; status: string };
  const allowed = ["created", "paid", "failed", "cod_pending", "shipped", "delivered"];
  if (!body.id || !allowed.includes(body.status)) {
    return NextResponse.json({ error: "Invalid" }, { status: 400 });
  }

  const { error } = await admin
    .from("orders")
    .update({ status: body.status })
    .eq("id", body.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
