"use client";

import { useEffect, useRef } from "react";
import ProductImage from "./ProductImage";
import type { IngredientCard } from "@/data/ingredients";

type Props = {
  cards: IngredientCard[];
  productImage: string;
  labelImage?: string;
  productName: string;
};

function useReveal<T extends HTMLElement>() {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("is-visible");
          obs.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );

    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return ref;
}

function IngredientStep({ card, index }: { card: IngredientCard; index: number }) {
  const ref = useReveal<HTMLElement>();

  return (
    <article
      ref={ref}
      className="ingredient-reveal group relative pl-12 sm:pl-14 pb-10 border-b border-[#EDE9E1] last:border-0 last:pb-0"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <span
        className="absolute left-0 top-0 font-serif text-[28px] sm:text-[32px] text-[#E5E2DB] leading-none transition-colors duration-300 group-hover:text-[#1C3A2A]/30"
        aria-hidden
      >
        {String(card.step).padStart(2, "0")}
      </span>

      <div className="pt-1">
        <p className="label-caps text-[9px] text-[#1C3A2A] font-semibold mb-2">{card.role}</p>
        <h3 className="font-serif text-[22px] sm:text-[26px] text-[#0A0A0A] leading-tight mb-2">{card.name}</h3>
        <p className="text-[14px] font-medium text-[#1C3A2A] mb-3 leading-snug">{card.benefit}</p>
        <p className="text-[13px] sm:text-[14px] text-[#666] leading-[1.9] font-light max-w-prose">{card.detail}</p>
      </div>
    </article>
  );
}

export default function IngredientInfographic({ cards, productImage, labelImage, productName }: Props) {
  const lineRef = useReveal<HTMLDivElement>();
  const heroRef = useReveal<HTMLDivElement>();

  return (
    <div className="space-y-12 sm:space-y-14">
      <div
        ref={heroRef}
        className="ingredient-reveal ingredient-hero-enter border border-[#E5E2DB] bg-[#FDFCFA]"
      >
        <div className="relative aspect-[4/3] sm:aspect-[3/2] max-h-[420px]">
          <ProductImage
            src={productImage}
            alt={productName}
            sizes="(max-width: 768px) 100vw, 900px"
            className="object-contain p-8 sm:p-12"
            priority
          />
        </div>
        <p className="px-5 sm:px-8 py-3 border-t border-[#E5E2DB] label-caps text-[9px] text-[#888] font-semibold">
          {productName} · studio product reference
        </p>
      </div>

      <div className="relative">
        <div
          ref={lineRef}
          className="ingredient-timeline-line absolute left-[0.4rem] sm:left-2 top-2 bottom-2 w-px bg-[#E5E2DB]"
          aria-hidden
        />

        <div className="space-y-0">
          {cards.map((card, i) => (
            <IngredientStep key={card.step} card={card} index={i} />
          ))}
        </div>
      </div>

      {labelImage && (
        <details className="ingredient-details shop-divider pt-8">
          <summary className="list-none flex items-center justify-between gap-4 py-2">
            <span className="label-caps text-[9px] text-[#888] font-semibold">Pack label reference</span>
            <span className="text-[#AAA] text-lg leading-none transition-transform group-open:rotate-45">+</span>
          </summary>
          <div className="pt-6 pb-2">
            <div className="relative aspect-[4/3] max-h-[320px] border border-[#E5E2DB] bg-[#FDFCFA]">
              <ProductImage
                src={labelImage}
                alt={`${productName} pack label`}
                sizes="720px"
                className="object-contain p-6"
              />
            </div>
          </div>
        </details>
      )}
    </div>
  );
}
