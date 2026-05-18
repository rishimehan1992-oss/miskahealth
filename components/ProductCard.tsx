import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import ImageCarousel from "./ImageCarousel";
import type { Product } from "@/data/products";

function allProductImages(p: Product) {
  return [...p.images.gallery, ...p.images.lifestyle];
}

export default function ProductCard({ p }: { p: Product }) {
  const images = allProductImages(p);

  return (
    <article className={`flex flex-col ${!p.available ? "opacity-70" : ""}`}>
      <div className="relative shrink-0">
        {p.images.main ? (
          <ImageCarousel images={images} alt={p.name} priority />
        ) : (
          <div className="aspect-square flex items-center justify-center text-[12px] text-[#AAA] uppercase tracking-wider">
            Coming soon
          </div>
        )}
        {p.available && (
          <span className="absolute top-0 left-0 text-[9px] tracking-[0.15em] uppercase bg-[#1C3A2A] text-white px-2.5 py-1 font-semibold">
            {p.tag}
          </span>
        )}
      </div>

      <div className="pt-10 sm:pt-12 mt-1 flex flex-col flex-1">
        <p className="text-[9px] tracking-[0.22em] text-[#1C3A2A] uppercase font-semibold mb-2">{p.tagline}</p>
        <h3 className="font-serif text-[22px] font-medium text-[#0A0A0A] leading-tight mb-4">{p.name}</h3>
        <p className="text-[13px] text-[#777] leading-[1.85] mb-8 flex-1 font-light">{p.description}</p>

        <ul className="space-y-3 mb-8 pt-8 border-t border-[#EDE9E1]">
          {p.formula.map((f) => (
            <li key={f.name} className="flex items-start gap-2.5 text-[12px]">
              <span className="w-1 h-1 rounded-full bg-[#1C3A2A] mt-[7px] shrink-0" />
              <span>
                <strong className="font-semibold text-[#0A0A0A]">{f.name}</strong>
                <span className="text-[#AAA] font-light"> — {f.action}</span>
              </span>
            </li>
          ))}
        </ul>

        <div className="flex items-baseline gap-2 mb-6">
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

        <div className="flex gap-3">
          <Link
            href={`/products/${p.slug}`}
            className="flex-1 text-center py-3 text-[10px] tracking-[0.15em] uppercase border border-[#CCC9C2] text-[#444] font-medium hover:border-[#0A0A0A] transition-colors"
          >
            Details
          </Link>
          {p.available && p.amazonUrl ? (
            <a
              href={p.amazonUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 inline-flex items-center justify-center gap-2 bg-[#1C3A2A] text-white py-3 text-[10px] tracking-[0.18em] uppercase font-semibold hover:bg-[#152d20] transition-colors"
            >
              Buy now
              <ArrowUpRight size={11} />
            </a>
          ) : (
            <button type="button" className="flex-1 py-3 text-[10px] tracking-[0.15em] uppercase border border-[#CCC9C2] text-[#777]">
              Notify me
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
