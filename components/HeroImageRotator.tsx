"use client";

import { useCallback, useRef, useState } from "react";
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

const SWIPE_THRESHOLD = 40;

export default function HeroImageRotator({ images }: Props) {
  const [index, setIndex] = useState(0);
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const dragging = useRef(false);

  const go = useCallback(
    (next: number) => setIndex((next + images.length) % images.length),
    [images.length]
  );

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    dragging.current = true;
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (!dragging.current) return;
    dragging.current = false;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    const dy = e.changedTouches[0].clientY - touchStartY.current;
    if (Math.abs(dx) < SWIPE_THRESHOLD || Math.abs(dx) < Math.abs(dy)) return;
    if (dx < 0) go(index + 1);
    else go(index - 1);
  };

  if (!images.length) return null;

  const current = images[index];

  return (
    <div className="w-full min-w-0" aria-roledescription="carousel" aria-label="Featured products">
      <div
        className="relative overflow-hidden rounded-xl bg-white shadow-md ring-1 ring-[#E5E2DB] aspect-[4/5] max-h-[min(88vh,620px)] w-full touch-pan-y"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <div
          className="flex h-full transition-transform duration-500 ease-out will-change-transform"
          style={{ transform: `translate3d(-${index * 100}%, 0, 0)` }}
        >
          {images.map((img, i) => (
            <Link
              key={imageUrl(img.src)}
              href={slideHref(img)}
              className="relative block h-full w-full shrink-0 grow-0 basis-full min-w-full focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1C3A2A] focus-visible:ring-inset"
              aria-label={`${img.productName} — shop now`}
            >
              <ProductImage
                src={img.src}
                alt={img.alt}
                priority={i === 0}
                sizes="(max-width: 1024px) 100vw, 55vw"
                className="object-cover object-center w-full h-full"
              />
            </Link>
          ))}
        </div>

        {images.length > 1 && (
          <>
            <button
              type="button"
              aria-label="Previous slide"
              onClick={() => go(index - 1)}
              className="absolute left-2 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full bg-white/95 shadow-md text-[#1C3A2A] border border-[#E5E2DB] touch-manipulation"
            >
              <ChevronLeft size={22} strokeWidth={1.5} />
            </button>
            <button
              type="button"
              aria-label="Next slide"
              onClick={() => go(index + 1)}
              className="absolute right-2 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full bg-white/95 shadow-md text-[#1C3A2A] border border-[#E5E2DB] touch-manipulation"
            >
              <ChevronRight size={22} strokeWidth={1.5} />
            </button>
            <div className="absolute bottom-3 left-0 right-0 z-20 flex justify-center gap-2 pointer-events-none">
              {images.map((img, i) => (
                <span
                  key={img.src}
                  className={`h-1.5 rounded-full transition-all ${
                    i === index ? "w-7 bg-white shadow-sm" : "w-1.5 bg-white/50"
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      <div className="mt-3 flex items-center justify-between gap-3">
        {images.length > 1 && (
          <div className="flex gap-2 flex-1 justify-center" role="tablist">
            {images.map((img, i) => (
              <button
                key={img.src}
                type="button"
                role="tab"
                aria-selected={i === index}
                aria-label={img.productName}
                onClick={() => setIndex(i)}
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
      <p className="mt-2 text-center text-[12px] text-[#666] font-medium">
        {index + 1} / {images.length} · {current.productName}
      </p>
    </div>
  );
}
