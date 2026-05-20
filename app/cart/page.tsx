"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";
import ShopHeader from "@/components/checkout/ShopHeader";
import OrderSummary from "@/components/checkout/OrderSummary";
import { useCart } from "@/components/cart/CartProvider";
import { formatInr } from "@/lib/cart/pricing";
import { imageUrl } from "@/lib/images";
import { pageShell } from "@/lib/layout";

export default function CartPage() {
  const { pricedLines, ready, setQuantity, removeItem, itemCount } = useCart();

  return (
    <main className="bg-[#F9F8F5] min-h-screen overflow-x-clip">
      <ShopHeader backHref="/#products" backLabel="Continue shopping" title="Your bag" />

      <div className={`${pageShell} py-10 sm:py-16 pb-24`}>
        {!ready ? (
          <p className="text-center text-[#999] py-20">Loading…</p>
        ) : itemCount === 0 ? (
          <div className="text-center py-20 sm:py-28">
            <h1 className="font-serif text-[32px] font-light text-[#0A0A0A] mb-4">Your bag is empty</h1>
            <p className="text-[15px] text-[#666] font-light mb-10">Add MISKA formulations to checkout on our site.</p>
            <Link
              href="/#products"
              className="inline-flex bg-[#1C3A2A] text-white px-10 py-4 text-[11px] tracking-[0.18em] uppercase font-semibold hover:bg-[#152d20]"
            >
              Shop the range
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] xl:grid-cols-[1fr_380px] gap-12 lg:gap-16">
            <div>
              <h1 className="font-serif text-[28px] sm:text-[36px] font-light text-[#0A0A0A] mb-8 sm:mb-10">
                Your bag
                <span className="text-[#AAA] font-normal text-[18px] ml-3">({itemCount})</span>
              </h1>
              <ul className="space-y-6">
                {pricedLines.map((line) => (
                  <li
                    key={line.slug}
                    className="flex gap-5 sm:gap-6 bg-white border border-[#E5E2DB] p-5 sm:p-6"
                  >
                    {line.image && (
                      <Link
                        href={`/products/${line.slug}`}
                        className="relative w-24 h-24 sm:w-28 sm:h-28 shrink-0 bg-[#F9F8F5] border border-[#EDE9E1]"
                      >
                        <Image
                          src={imageUrl(line.image)}
                          alt={line.name}
                          fill
                          className="object-contain p-2"
                          sizes="112px"
                        />
                      </Link>
                    )}
                    <div className="flex-1 min-w-0 flex flex-col">
                      <Link
                        href={`/products/${line.slug}`}
                        className="font-serif text-[18px] sm:text-[20px] text-[#0A0A0A] hover:text-[#1C3A2A]"
                      >
                        {line.name}
                      </Link>
                      <p className="text-[12px] text-[#999] mt-1">{line.volume}</p>
                      <p className="text-[15px] font-semibold mt-3">{formatInr(line.unitPrice)}</p>
                      <div className="mt-auto pt-5 flex items-center justify-between gap-4">
                        <div className="inline-flex items-center border border-[#E5E2DB]">
                          <button
                            type="button"
                            aria-label="Decrease quantity"
                            onClick={() => setQuantity(line.slug, line.quantity - 1)}
                            className="p-2.5 hover:bg-[#F9F8F5]"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="w-10 text-center text-[13px] font-medium">{line.quantity}</span>
                          <button
                            type="button"
                            aria-label="Increase quantity"
                            onClick={() => setQuantity(line.slug, line.quantity + 1)}
                            className="p-2.5 hover:bg-[#F9F8F5]"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeItem(line.slug)}
                          className="text-[#999] hover:text-[#0A0A0A] p-2"
                          aria-label="Remove item"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="lg:sticky lg:top-24 lg:self-start space-y-6">
              <OrderSummary />
              <Link
                href="/checkout?step=shipping"
                className="block w-full text-center bg-[#1C3A2A] text-white py-4 text-[11px] tracking-[0.18em] uppercase font-semibold hover:bg-[#152d20]"
              >
                Proceed to checkout
              </Link>
              <p className="text-[11px] text-[#AAA] text-center leading-relaxed">
                Guest checkout · Google sign-in before payment
              </p>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
