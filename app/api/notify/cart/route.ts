import { NextResponse } from "next/server";
import { notifyAddToCart } from "@/lib/telegram";

type Body = {
  productName: string;
  quantity: number;
  price: number;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Body;
    if (!body.productName) return NextResponse.json({ ok: false });
    void notifyAddToCart(body);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false });
  }
}
