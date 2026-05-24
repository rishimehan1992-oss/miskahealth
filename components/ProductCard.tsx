import Link from "next/link";
import AddToCartButton from "./cart/AddToCartButton";
import ImageCarousel from "./ImageCarousel";
import type { Product } from "@/data/products";

function allProductImages(p: Product) {
  return [...p.images.gallery, ...p.images.lifestyle];
}

function ingredientLine(p: Product) {
  return p.formula.map((f) => f.name).join(" · ");
}

type Props = {
  p: Product;
  /** Home / grid: one-line actives + use only. Full: copy for detail-page “also in range”. */
  compact?: boolean;
};

export default function ProductCard({ p, compact = false }: Props) {
  const images = allProductImages(p);

  return (
    <article
      className={`flex flex-col h-full border border-[#EDE9E1] bg-[#FDFCFA] ${!p.available ? "opacity-70" : ""}`}
    >
      <div className="relative shrink-0 border-b border-[#EDE9E1] bg-white">
        {p.images.main ? (
          <ImageCarousel images={images} alt={p.name} priority />
        ) : (
          <div className="aspect-square flex items-center justify-center text-[12px] text-[#AAA] uppercase tracking-wider">
            Coming soon
          </div>
        )}
        {p.available && (
          <span className="absolute top-3 left-3 text-[9px] tracking-[0.15em] uppercase bg-[#1C3A2A] text-white px-3 py-1 font-semibold z-20">
            {p.tag}
          </span>
        )}
      </div>

      <div className="flex flex-col flex-1 p-5 sm:p-6">
        <p className="text-[9px] tracking-[0.2em] text-[#1C3A2A] uppercase font-semibold mb-1.5">{p.tagline}</p>
        <h3 className="font-serif text-[20px] sm:text-[22px] font-medium text-[#0A0A0A] leading-tight mb-3">
          {p.name}
        </h3>

        {compact ? (
          <div className="space-y-2 mb-4 flex-1 text-[12px] text-[#666] font-light leading-snug">
            <p className="line-clamp-1">
              <span className="text-[#999] uppercase text-[10px] tracking-wide mr-1">Actives</span>
              {ingredientLine(p)}
            </p>
            <p className="line-clamp-1">
              <span className="text-[#999] uppercase text-[10px] tracking-wide mr-1">For</span>
              {p.concern}
            </p>
          </div>
        ) : (
          <>
            <p className="text-[13px] text-[#777] leading-[1.75] font-light mb-5 line-clamp-3">{p.description}</p>
            <ul className="space-y-2 mb-5 pt-4 border-t border-[#EDE9E1] flex-1">
              {p.formula.map((f) => (
                <li key={f.name} className="text-[12px] leading-snug text-[#666]">
                  <strong className="font-semibold text-[#0A0A0A]">{f.name}</strong>
                  <span className="text-[#AAA]"> — {f.action}</span>
                </li>
              ))}
            </ul>
          </>
        )}

        <div className="flex items-baseline gap-2 mb-4 mt-auto">
          {p.available ? (
            <>
              <span className="text-[20px] font-semibold text-[#0A0A0A]">₹{p.price}</span>
              <span className="text-[12px] text-[#CCC] line-through">₹{p.mrp}</span>
            </>
          ) : (
            <span className="text-[14px] text-[#AAA]">Coming soon</span>
          )}
        </div>

        <div className="flex gap-2">
          <Link
            href={`/products/${p.slug}`}
            className="flex-1 text-center py-3 text-[10px] tracking-[0.15em] uppercase border border-[#CCC9C2] text-[#444] font-medium hover:border-[#0A0A0A] transition-colors"
          >
            Details
          </Link>
          {p.available ? (
            <AddToCartButton
              product={p}
              className="flex-1 py-3 text-[10px] tracking-[0.14em] uppercase font-semibold"
              label={`Add · ₹${p.price}`}
            />
          ) : (
            <button
              type="button"
              className="flex-1 py-3 text-[10px] tracking-[0.15em] uppercase border border-[#CCC9C2] text-[#777]"
            >
              Notify me
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
