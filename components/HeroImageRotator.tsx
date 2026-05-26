"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import ProductImage from "@/components/ProductImage";
import { imageUrl } from "@/lib/images";
import type { HeroSlide } from "@/data/hero-images";

const INTERVAL_MS = 5000;

type Props = {
  images: HeroSlide[];
};

function slideHref(slide: HeroSlide) {
  if (slide.href) return slide.href;
  if (slide.slug) return `/products/${slide.slug}`;
  return "/#products";
}

export default function HeroImageRotator({ images }: Props) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const go = useCallback(
    (next: number) => setIndex((next + images.length) % images.length),
    [images.length]
  );

  useEffect(() => {
    if (paused || images.length < 2) return;
    const t = window.setInterval(() => go(index + 1), INTERVAL_MS);
    return () => window.clearInterval(t);
  }, [index, paused, go, images.length]);

  if (!images.length) return null;

  return (
    <div
      className="w-full min-w-0"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-roledescription="carousel"
      aria-label="Featured products"
    >
      <div className="relative w-full aspect-[4/5] max-h-[min(92vh,640px)] sm:max-h-[600px] lg:max-h-[min(52vw,620px)] overflow-hidden rounded-lg sm:rounded-xl bg-white shadow-md ring-1 ring-[#E5E2DB]">
        {images.map((img, i) => {
          const active = i === index;
          const href = slideHref(img);
          return (
            <Link
              key={imageUrl(img.src)}
              href={href}
              className={`absolute inset-0 block transition-opacity duration-500 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1C3A2A] focus-visible:ring-inset ${
                active ? "opacity-100 z-10 cursor-pointer" : "opacity-0 z-0 pointer-events-none"
              }`}
              aria-hidden={!active}
              aria-label={`${img.productName} — shop now`}
              tabIndex={active ? 0 : -1}
            >
              <ProductImage
                src={img.src}
                alt=""
                priority={i === 0}
                sizes="(max-width: 1024px) 100vw, 55vw"
                className="object-cover object-center w-full h-full pointer-events-none"
              />
            </Link>
          );
        })}
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
                onClick={() => setIndex(i)}
                className={`h-2 rounded-full transition-all touch-manipulation ${
                  i === index ? "w-8 bg-[#1C3A2A]" : "w-2 bg-[#D4D0C8]"
                }`}
              />
            ))}
          </div>
        )}
        <Link
          href={slideHref(images[index])}
          className="shrink-0 bg-[#1C3A2A] text-white px-5 py-2.5 text-[10px] tracking-[0.14em] uppercase font-semibold hover:bg-[#152d20] touch-manipulation"
        >
          Shop now
        </Link>
      </div>
      <p className="mt-2 text-center text-[12px] text-[#666] font-medium lg:hidden">
        {images[index].productName}
      </p>
    </div>
  );
}
