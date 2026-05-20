import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import AddToCartButton from "./cart/AddToCartButton";
import ImageCarousel from "./ImageCarousel";
import type { Product } from "@/data/products";

function allProductImages(p: Product) {
  return [...p.images.gallery, ...p.images.lifestyle];
}

export default function ProductCard({ p }: { p: Product }) {
  const images = allProductImages(p);

  return (
    <article className={`flex flex-col h-full ${!p.available ? "opacity-70" : ""}`}>
      <div className="relative shrink-0 px-1 sm:px-2">
        {p.images.main ? (
          <ImageCarousel images={images} alt={p.name} priority />
        ) : (
          <div className="aspect-square flex items-center justify-center text-[12px] text-[#AAA] uppercase tracking-wider">
            Coming soon
          </div>
        )}
        {p.available && (
          <span className="absolute top-2 left-2 sm:top-3 sm:left-3 text-[9px] tracking-[0.15em] uppercase bg-[#1C3A2A] text-white px-3 py-1 font-semibold">
            {p.tag}
          </span>
        )}
      </div>

      <div className="pt-12 sm:pt-14 flex flex-col flex-1">
        <p className="text-[9px] tracking-[0.22em] text-[#1C3A2A] uppercase font-semibold mb-3">{p.tagline}</p>
        <h3 className="font-serif text-[22px] sm:text-[24px] font-medium text-[#0A0A0A] leading-tight mb-5">{p.name}</h3>
        <p className="text-[13px] text-[#777] leading-[1.9] mb-10 flex-1 font-light">{p.description}</p>

        <ul className="space-y-4 mb-6 pt-10 border-t border-[#EDE9E1]">
          {p.formula.map((f) => (
            <li key={f.name} className="flex items-start gap-3 text-[12px] leading-relaxed">
              <span className="w-1 h-1 rounded-full bg-[#1C3A2A] mt-[8px] shrink-0" />
              <span>
                <strong className="font-semibold text-[#0A0A0A]">{f.name}</strong>
                <span className="text-[#AAA] font-light"> — {f.action}</span>
              </span>
            </li>
          ))}
        </ul>

        <Link
          href={`/products/${p.slug}/ingredients`}
          className="text-[10px] tracking-[0.14em] uppercase font-semibold text-[#1C3A2A] mb-8 inline-block hover:underline underline-offset-4"
        >
          Ingredient infographic →
        </Link>

        <div className="flex items-baseline gap-2 mb-8">
          {p.available ? (
            <>
              <span className="text-[22px] font-semibold text-[#0A0A0A]">₹{p.price}</span>
              <span className="text-[13px] text-[#CCC] line-through">₹{p.mrp}</span>
              {p.mrp && p.price && (
                <span className="text-[9px] tracking-[0.08em] text-[#1C3A2A] font-semibold uppercase">
                  {Math.round(((p.mrp - p.price) / p.mrp) * 100)}% off
                </span>
              )}
            </>
          ) : (
            <span className="text-[14px] text-[#AAA]">Coming soon</span>
          )}
        </div>

        <div className="mt-auto space-y-3">
          <div className="flex gap-3">
            <Link
              href={`/products/${p.slug}`}
              className="flex-1 text-center py-3.5 text-[10px] tracking-[0.15em] uppercase border border-[#CCC9C2] text-[#444] font-medium hover:border-[#0A0A0A] transition-colors"
            >
              Details
            </Link>
            {p.available ? (
              <AddToCartButton
                product={p}
                className="flex-1 py-3.5 text-[10px] tracking-[0.18em] uppercase"
              />
            ) : (
              <button
                type="button"
                className="flex-1 py-3.5 text-[10px] tracking-[0.15em] uppercase border border-[#CCC9C2] text-[#777]"
              >
                Notify me
              </button>
            )}
          </div>
          {p.available && p.amazonUrl && (
            <a
              href={p.amazonUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block text-center text-[10px] tracking-[0.12em] uppercase text-[#888] hover:text-[#1C3A2A] font-medium"
            >
              Also on Amazon <ArrowUpRight size={10} className="inline ml-0.5 -mt-px" />
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
