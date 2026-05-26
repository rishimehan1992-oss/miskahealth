"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ProductImage from "@/components/ProductImage";
import { imageUrl } from "@/lib/images";
import type { HeroSlide } from "@/data/hero-images";

type Props = {
  images: HeroSlide[];
};

function slideHref(slide: HeroSlide) {
  if (slide.href) return slide.href;
  if (slide.slug) return `/products/${slide.slug}`;
  return "/#products";
}

export default function HeroImageRotator({ images }: Props) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);

  const scrollToIndex = useCallback((next: number) => {
    const el = scrollerRef.current;
    if (!el || !images.length) return;
    const i = (next + images.length) % images.length;
    const slide = el.children[i] as HTMLElement | undefined;
    if (slide) {
      slide.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
      setIndex(i);
    }
  }, [images.length]);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el || images.length < 2) return;

    const onScroll = () => {
      const slides = Array.from(el.children) as HTMLElement[];
      if (!slides.length) return;
      const center = el.scrollLeft + el.clientWidth / 2;
      let best = 0;
      let bestDist = Infinity;
      slides.forEach((slide, i) => {
        const slideCenter = slide.offsetLeft + slide.offsetWidth / 2;
        const dist = Math.abs(center - slideCenter);
        if (dist < bestDist) {
          bestDist = dist;
          best = i;
        }
      });
      setIndex(best);
    };

    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [images.length]);

  if (!images.length) return null;

  const current = images[index];

  return (
    <div className="w-full min-w-0" aria-roledescription="carousel" aria-label="Featured products">
      <p className="mb-2 text-center text-[10px] tracking-[0.14em] uppercase text-[#888] lg:hidden">
        Swipe left or right
      </p>

      <div className="relative group">
        {images.length > 1 && (
          <>
            <button
              type="button"
              aria-label="Previous slide"
              onClick={() => scrollToIndex(index - 1)}
              className="absolute left-1 sm:left-2 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-white/90 shadow-md text-[#1C3A2A] border border-[#E5E2DB] opacity-90 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity touch-manipulation"
            >
              <ChevronLeft size={22} strokeWidth={1.5} />
            </button>
            <button
              type="button"
              aria-label="Next slide"
              onClick={() => scrollToIndex(index + 1)}
              className="absolute right-1 sm:right-2 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-white/90 shadow-md text-[#1C3A2A] border border-[#E5E2DB] opacity-90 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity touch-manipulation"
            >
              <ChevronRight size={22} strokeWidth={1.5} />
            </button>
          </>
        )}

        <div
          ref={scrollerRef}
          className="hero-scroll flex gap-3 overflow-x-scroll overscroll-x-contain snap-x snap-mandatory scroll-smooth pb-1 pr-8 -mx-3 px-3"
          style={{ WebkitOverflowScrolling: "touch", touchAction: "pan-x" }}
        >
          {images.map((img, i) => (
            <Link
              key={imageUrl(img.src)}
              href={slideHref(img)}
              className="hero-slide snap-center shrink-0 w-[calc(100%-3.5rem)] max-w-[460px] sm:w-[calc(100%-4.5rem)] sm:max-w-[560px] lg:w-[calc(100%-6rem)] lg:max-w-none aspect-[4/5] max-h-[min(88vh,620px)] overflow-hidden rounded-xl bg-white shadow-md ring-1 ring-[#E5E2DB] block focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1C3A2A]"
              aria-label={`${img.productName} — shop now`}
            >
              <ProductImage
                src={img.src}
                alt={img.alt}
                priority={i === 0}
                sizes="(max-width: 640px) 88vw, 480px"
                className="object-cover object-center w-full h-full"
              />
            </Link>
          ))}
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between gap-3 px-0.5">
        {images.length > 1 && (
          <div className="flex justify-center gap-2 flex-1" role="tablist" aria-label="Slides">
            {images.map((img, i) => (
              <button
                key={img.src}
                type="button"
                role="tab"
                aria-selected={i === index}
                aria-label={img.productName}
                onClick={() => scrollToIndex(i)}
                className={`h-2 rounded-full transition-all touch-manipulation ${
                  i === index ? "w-8 bg-[#1C3A2A]" : "w-2 bg-[#D4D0C8]"
                }`}
              />
            ))}
          </div>
        )}
        <Link
          href={slideHref(current)}
          className="shrink-0 bg-[#1C3A2A] text-white px-5 py-2.5 text-[10px] tracking-[0.14em] uppercase font-semibold hover:bg-[#152d20] touch-manipulation"
        >
          Shop now
        </Link>
      </div>
      <p className="mt-2 text-center text-[12px] text-[#666] font-medium">{current.productName}</p>
    </div>
  );
}
