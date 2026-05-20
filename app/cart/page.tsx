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
          <p className="text-center text-[#999] py-20 font-light">Loading…</p>
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
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_minmax(280px,340px)] gap-0 lg:gap-0">
            <div className="min-w-0 lg:pr-12 xl:pr-16">
              <h1 className="font-serif text-[28px] sm:text-[36px] font-light text-[#0A0A0A] mb-10 sm:mb-12">
                Your bag
                <span className="text-[#CCC] font-normal text-[18px] ml-3">({itemCount})</span>
              </h1>
              <ul>
                {pricedLines.map((line) => (
                  <li
                    key={line.slug}
                    className="flex gap-6 sm:gap-8 py-8 shop-divider first:pt-0 first:border-t-0"
                  >
                    {line.image && (
                      <Link
                        href={`/products/${line.slug}`}
                        className="relative w-28 h-28 sm:w-32 sm:h-32 shrink-0 bg-[#FDFCFA]"
                      >
                        <Image
                          src={imageUrl(line.image)}
                          alt={line.name}
                          fill
                          className="object-contain p-3"
                          sizes="128px"
                        />
                      </Link>
                    )}
                    <div className="flex-1 min-w-0 flex flex-col">
                      <Link
                        href={`/products/${line.slug}`}
                        className="font-serif text-[20px] sm:text-[22px] text-[#0A0A0A] hover:text-[#1C3A2A] transition-colors"
                      >
                        {line.name}
                      </Link>
                      <p className="text-[12px] text-[#999] mt-1 font-light">{line.volume}</p>
                      <p className="text-[16px] font-semibold mt-4">{formatInr(line.unitPrice)}</p>
                      <div className="mt-auto pt-6 flex items-center justify-between gap-4">
                        <div className="inline-flex items-center gap-4 text-[13px]">
                          <button
                            type="button"
                            aria-label="Decrease quantity"
                            onClick={() => setQuantity(line.slug, line.quantity - 1)}
                            className="text-[#888] hover:text-[#0A0A0A] p-1"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="font-medium w-6 text-center">{line.quantity}</span>
                          <button
                            type="button"
                            aria-label="Increase quantity"
                            onClick={() => setQuantity(line.slug, line.quantity + 1)}
                            className="text-[#888] hover:text-[#0A0A0A] p-1"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeItem(line.slug)}
                          className="text-[11px] tracking-[0.1em] uppercase text-[#AAA] hover:text-[#0A0A0A]"
                          aria-label="Remove item"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-12 lg:mt-0 lg:sticky lg:top-28 lg:self-start space-y-8">
              <OrderSummary />
              <Link
                href="/checkout?step=shipping"
                className="block w-full text-center bg-[#1C3A2A] text-white py-4 text-[11px] tracking-[0.18em] uppercase font-semibold hover:bg-[#152d20]"
              >
                Proceed to checkout
              </Link>
              <p className="text-[11px] text-[#AAA] text-center lg:text-left leading-relaxed font-light">
                Guest checkout · Google sign-in before payment
              </p>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
