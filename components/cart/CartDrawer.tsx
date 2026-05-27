"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Minus, Plus, X } from "lucide-react";
import { useCart } from "./CartProvider";
import { formatInr, orderTotal } from "@/lib/cart/pricing";
import { imageUrl } from "@/lib/images";

export default function CartDrawer() {
  const router = useRouter();
  const {
    drawerOpen,
    closeCart,
    pricedLines,
    itemCount,
    subtotal,
    discountAmount,
    ready,
    setQuantity,
    removeItem,
  } = useCart();

  if (!drawerOpen) return null;

  const total = orderTotal(subtotal, "prepaid", discountAmount);

  const goCheckout = () => {
    closeCart();
    router.push("/checkout");
  };

  return (
    <div className="fixed inset-0 z-[70] flex justify-end" role="dialog" aria-modal aria-label="Shopping bag">
      <button
        type="button"
        className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
        onClick={closeCart}
        aria-label="Close bag"
      />

      <aside className="relative flex flex-col w-full max-w-md h-full bg-white shadow-2xl animate-cart-drawer-in">
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#E5E2DB] shrink-0">
          <h2 className="text-[13px] tracking-[0.12em] uppercase font-semibold text-[#0A0A0A]">
            Your bag {ready && itemCount > 0 ? `(${itemCount})` : ""}
          </h2>
          <button
            type="button"
            onClick={closeCart}
            className="p-2 -mr-2 text-[#666] hover:text-[#0A0A0A]"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        <div className="px-5 py-2.5 bg-[#1C3A2A]/8 border-b border-[#E5E2DB] text-[11px] text-[#1C3A2A] font-medium text-center">
          Free shipping if you pay now · ₹49 on COD
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          {!ready ? (
            <p className="text-[13px] text-[#999] py-12 text-center">Loading…</p>
          ) : itemCount === 0 ? (
            <div className="py-16 text-center">
              <p className="text-[15px] text-[#666] mb-6 font-light">Your bag is empty.</p>
              <button
                type="button"
                onClick={() => {
                  closeCart();
                  router.push("/#products");
                }}
                className="bg-[#1C3A2A] text-white px-8 py-3.5 text-[11px] tracking-[0.15em] uppercase font-semibold"
              >
                Shop now
              </button>
            </div>
          ) : (
            <ul className="space-y-5">
              {pricedLines.map((line) => (
                <li key={line.slug} className="flex gap-4 pb-5 border-b border-[#EDE9E1] last:border-0">
                  {line.image && (
                    <Link
                      href={`/products/${line.slug}`}
                      onClick={closeCart}
                      className="relative w-20 h-20 shrink-0 bg-[#F9F8F5]"
                    >
                      <Image
                        src={imageUrl(line.image)}
                        alt={line.name}
                        fill
                        className="object-contain p-2"
                        sizes="80px"
                      />
                    </Link>
                  )}
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/products/${line.slug}`}
                      onClick={closeCart}
                      className="text-[14px] font-medium text-[#0A0A0A] hover:text-[#1C3A2A] line-clamp-2"
                    >
                      {line.name}
                    </Link>
                    <p className="text-[11px] text-[#999] mt-0.5">{line.volume}</p>
                    <p className="text-[14px] font-semibold mt-2">{formatInr(line.lineTotal)}</p>
                    <div className="mt-3 flex items-center justify-between">
                      <div className="inline-flex items-center gap-3 text-[12px] border border-[#E5E2DB] px-2 py-1">
                        <button
                          type="button"
                          aria-label="Decrease"
                          onClick={() => setQuantity(line.slug, line.quantity - 1)}
                          className="text-[#888] hover:text-[#0A0A0A] p-0.5"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="w-5 text-center font-medium">{line.quantity}</span>
                        <button
                          type="button"
                          aria-label="Increase"
                          onClick={() => setQuantity(line.slug, line.quantity + 1)}
                          className="text-[#888] hover:text-[#0A0A0A] p-0.5"
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeItem(line.slug)}
                        className="text-[10px] uppercase tracking-wide text-[#AAA] hover:text-[#0A0A0A]"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {ready && itemCount > 0 && (
          <div className="shrink-0 border-t border-[#E5E2DB] px-5 py-5 bg-[#F9F8F5] safe-area-pb space-y-3">
            <div className="flex justify-between text-[13px] text-[#666]">
              <span>Subtotal</span>
              <span className="font-medium text-[#0A0A0A]">{formatInr(subtotal)}</span>
            </div>
            {discountAmount > 0 && (
              <div className="flex justify-between text-[13px] text-[#1C3A2A]">
                <span>Combo discount</span>
                <span>−{formatInr(discountAmount)}</span>
              </div>
            )}
            <div className="flex justify-between text-[12px] text-[#999]">
              <span>Shipping (pay now)</span>
              <span>Free</span>
            </div>
            <div className="flex justify-between text-[15px] font-semibold text-[#0A0A0A] pt-2 border-t border-[#E5E2DB]">
              <span>Total</span>
              <span>{formatInr(total)}</span>
            </div>
            <button
              type="button"
              onClick={goCheckout}
              className="w-full bg-[#1C3A2A] text-white py-4 text-[11px] tracking-[0.18em] uppercase font-semibold hover:bg-[#152d20] touch-manipulation"
            >
              Checkout
            </button>
            <button
              type="button"
              onClick={closeCart}
              className="w-full py-3 text-[11px] tracking-[0.12em] uppercase text-[#666] font-medium hover:text-[#0A0A0A] touch-manipulation"
            >
              Continue shopping
            </button>
          </div>
        )}
      </aside>
    </div>
  );
}
