"use client";

import { useEffect, useRef } from "react";
import ProductImage from "./ProductImage";
import type { IngredientCard } from "@/data/ingredients";

type Props = {
  cards: IngredientCard[];
  heroVisual?: string;
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
      className="ingredient-reveal group relative pl-14 sm:pl-16"
      style={{ animationDelay: `${index * 120}ms` }}
    >
      <span
        className="absolute left-0 top-0 flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-full bg-[#1C3A2A] font-serif text-[15px] sm:text-[16px] text-white shadow-[0_8px_24px_rgba(28,58,42,0.25)] transition-transform duration-500 group-hover:scale-105"
        aria-hidden
      >
        {String(card.step).padStart(2, "0")}
      </span>

      <div className="rounded-2xl bg-white/80 backdrop-blur-sm p-6 sm:p-8 shadow-[0_4px_40px_rgba(10,10,10,0.06)] transition-all duration-500 group-hover:shadow-[0_12px_48px_rgba(28,58,42,0.1)] group-hover:-translate-y-0.5">
        <p className="label-caps text-[9px] text-[#1C3A2A] font-semibold mb-2 opacity-90">{card.role}</p>
        <h3 className="font-serif text-[24px] sm:text-[28px] text-[#0A0A0A] leading-tight mb-3">{card.name}</h3>
        <p className="text-[14px] sm:text-[15px] font-medium text-[#1C3A2A] mb-3 leading-snug">{card.benefit}</p>
        <p className="text-[13px] sm:text-[14px] text-[#666] leading-[1.9] font-light">{card.detail}</p>
      </div>
    </article>
  );
}

export default function IngredientInfographic({ cards, heroVisual, labelImage, productName }: Props) {
  const lineRef = useReveal<HTMLDivElement>();
  const heroRef = useReveal<HTMLDivElement>();

  return (
    <div className="space-y-14 sm:space-y-16">
      {heroVisual && (
        <div ref={heroRef} className="ingredient-reveal ingredient-hero-enter overflow-hidden rounded-2xl shadow-[0_16px_64px_rgba(10,10,10,0.08)]">
          <div className="relative aspect-[3/2] sm:aspect-[16/9] bg-gradient-to-br from-[#F4F1EB] to-white">
            <ProductImage
              src={heroVisual}
              alt={`${productName} ingredient story`}
              sizes="(max-width: 768px) 100vw, 900px"
              className="object-cover object-center"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A]/30 via-transparent to-transparent pointer-events-none" />
            <p className="absolute bottom-4 left-5 sm:bottom-6 sm:left-8 label-caps text-[9px] text-white/90 font-semibold">
              Active pathway
            </p>
          </div>
        </div>
      )}

      <div className="relative">
        <div
          ref={lineRef}
          className="ingredient-timeline-line absolute left-5 sm:left-[1.375rem] top-3 bottom-3 w-px bg-gradient-to-b from-[#1C3A2A] via-[#1C3A2A]/40 to-transparent"
          aria-hidden
        />

        <div className="space-y-8 sm:space-y-10">
          {cards.map((card, i) => (
            <IngredientStep key={card.step} card={card} index={i} />
          ))}
        </div>
      </div>

      {labelImage && (
        <details className="ingredient-details group rounded-2xl bg-white/60 shadow-[0_4px_32px_rgba(10,10,10,0.04)] overflow-hidden">
          <summary className="list-none px-6 py-4 sm:px-8 sm:py-5 flex items-center justify-between gap-4">
            <span className="label-caps text-[9px] text-[#888] font-semibold">Pack label reference</span>
            <span className="text-[#AAA] text-lg leading-none transition-transform group-open:rotate-45">+</span>
          </summary>
          <div className="px-4 pb-6 sm:px-8 sm:pb-8">
            <div className="relative aspect-[4/3] max-h-[360px] mx-auto rounded-xl overflow-hidden bg-[#FAFAF8]">
              <ProductImage
                src={labelImage}
                alt={`${productName} pack label`}
                sizes="720px"
                className="object-contain p-4"
              />
            </div>
          </div>
        </details>
      )}
    </div>
  );
}
