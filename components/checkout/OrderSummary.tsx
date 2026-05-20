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

export default function OrderSummary({ showEditLink = false, compact = false }: Props) {
  const { pricedLines, subtotal } = useCart();
  const shipping = shippingFee(subtotal);
  const total = orderTotal(subtotal);

  if (pricedLines.length === 0) {
    return (
      <div className="bg-white border border-[#E5E2DB] p-8 text-center">
        <p className="text-[14px] text-[#888]">Your bag is empty.</p>
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
    <aside className="bg-white border border-[#E5E2DB] p-6 sm:p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-[11px] tracking-[0.2em] uppercase font-semibold text-[#0A0A0A]">Order summary</h2>
        {showEditLink && (
          <Link href="/cart" className="text-[10px] tracking-[0.12em] uppercase text-[#1C3A2A] font-semibold hover:underline">
            Edit bag
          </Link>
        )}
      </div>

      <ul className={`${compact ? "space-y-4" : "space-y-5"} mb-6`}>
        {pricedLines.map((line) => (
          <li key={line.slug} className="flex gap-4">
            {line.image && (
              <div className="relative w-14 h-14 shrink-0 bg-[#F9F8F5] border border-[#EDE9E1]">
                <Image
                  src={imageUrl(line.image)}
                  alt={line.name}
                  fill
                  className="object-contain p-1"
                  sizes="56px"
                />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-medium text-[#0A0A0A] leading-snug">{line.name}</p>
              <p className="text-[11px] text-[#999] mt-0.5">
                {line.volume} · Qty {line.quantity}
              </p>
            </div>
            <p className="text-[13px] font-semibold shrink-0">{formatInr(line.lineTotal)}</p>
          </li>
        ))}
      </ul>

      <dl className="space-y-3 pt-6 border-t border-[#EDE9E1] text-[13px]">
        <div className="flex justify-between text-[#666]">
          <dt>Subtotal</dt>
          <dd>{formatInr(subtotal)}</dd>
        </div>
        <div className="flex justify-between text-[#666]">
          <dt>Shipping</dt>
          <dd>{shipping === 0 ? "Free" : formatInr(shipping)}</dd>
        </div>
        {!compact && (
          <p className="text-[11px] text-[#AAA] leading-relaxed">Free shipping on orders ₹999 and above.</p>
        )}
        <div className="flex justify-between pt-3 border-t border-[#EDE9E1] text-[15px] font-semibold text-[#0A0A0A]">
          <dt>Total</dt>
          <dd>{formatInr(total)}</dd>
        </div>
      </dl>
    </aside>
  );
}
