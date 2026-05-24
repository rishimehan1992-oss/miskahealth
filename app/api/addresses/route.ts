import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { rowToSavedAddress, shippingToRow } from "@/lib/addresses/types";
import type { ShippingAddress } from "@/lib/checkout/types";
import { validateShipping, hasErrors } from "@/lib/checkout/validate";

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ addresses: [] });
  }

  const { data, error } = await supabase
    .from("saved_addresses")
    .select("*")
    .eq("user_id", user.id)
    .order("is_default", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) {
    console.error("addresses GET:", error);
    return NextResponse.json({ addresses: [] });
  }

  return NextResponse.json({
    addresses: (data ?? []).map(rowToSavedAddress),
  });
}

type PostBody = ShippingAddress & { label?: string; setDefault?: boolean };

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Sign in to save addresses" }, { status: 401 });
  }

  let body: PostBody;
  try {
    body = (await request.json()) as PostBody;
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const errors = validateShipping(body);
  if (hasErrors(errors)) {
    return NextResponse.json({ error: "Invalid address" }, { status: 400 });
  }

  const setDefault = body.setDefault !== false;

  if (setDefault) {
    await supabase.from("saved_addresses").update({ is_default: false }).eq("user_id", user.id);
  }

  const { data, error } = await supabase
    .from("saved_addresses")
    .insert(
      shippingToRow(user.id, body, body.label?.trim() || "Home", setDefault)
    )
    .select("*")
    .single();

  if (error) {
    console.error("addresses POST:", error);
    return NextResponse.json({ error: "Could not save address" }, { status: 500 });
  }

  return NextResponse.json({ address: rowToSavedAddress(data) });
}
