"use client";

import Image from "next/image";
import Link from "next/link";
import { formatInr, orderTotal, shippingFee } from "@/lib/cart/pricing";
import { useCart } from "@/components/cart/CartProvider";
import { imageUrl } from "@/lib/images";

type Props = {
  showEditLink?: boolean;
  compact?: boolean;
};

export default function OrderSummary({ showEditLink = false }: Props) {
  const { pricedLines, subtotal } = useCart();
  const shipping = shippingFee(subtotal);
  const total = orderTotal(subtotal);

  if (pricedLines.length === 0) {
    return (
      <div className="shop-summary text-center lg:text-left">
        <p className="text-[14px] text-[#888] font-light">Your bag is empty.</p>
        <Link
          href="/#products"
          className="inline-block mt-6 text-[10px] tracking-[0.15em] uppercase font-semibold text-[#1C3A2A] hover:underline"
        >
          Shop products
        </Link>
      </div>
    );
  }

  return (
    <aside className="shop-summary">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-[11px] tracking-[0.2em] uppercase font-semibold text-[#0A0A0A]">Order summary</h2>
        {showEditLink && (
          <Link href="/cart" className="text-[10px] tracking-[0.12em] uppercase text-[#1C3A2A] font-semibold hover:underline">
            Edit bag
          </Link>
        )}
      </div>

      <ul className="space-y-6 mb-8">
        {pricedLines.map((line) => (
          <li key={line.slug} className="flex gap-4 pb-6 border-b border-[#EDE9E1] last:border-0 last:pb-0">
            {line.image && (
              <div className="relative w-16 h-16 shrink-0 bg-[#FDFCFA]">
                <Image
                  src={imageUrl(line.image)}
                  alt={line.name}
                  fill
                  className="object-contain p-1"
                  sizes="64px"
                />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-[14px] font-medium text-[#0A0A0A] leading-snug">{line.name}</p>
              <p className="text-[12px] text-[#999] mt-1 font-light">
                {line.volume} · Qty {line.quantity}
              </p>
            </div>
            <p className="text-[14px] font-semibold shrink-0">{formatInr(line.lineTotal)}</p>
          </li>
        ))}
      </ul>

      <dl className="space-y-3 text-[14px] font-light">
        <div className="flex justify-between text-[#666]">
          <dt>Subtotal</dt>
          <dd>{formatInr(subtotal)}</dd>
        </div>
        <div className="flex justify-between text-[#666]">
          <dt>Shipping</dt>
          <dd>{shipping === 0 ? "Free" : formatInr(shipping)}</dd>
        </div>
        <p className="text-[11px] text-[#AAA] leading-relaxed pt-1">Free shipping on orders ₹999+</p>
        <div className="flex justify-between pt-4 mt-2 shop-divider text-[16px] font-semibold text-[#0A0A0A]">
          <dt>Total</dt>
          <dd>{formatInr(total)}</dd>
        </div>
      </dl>
    </aside>
  );
}
