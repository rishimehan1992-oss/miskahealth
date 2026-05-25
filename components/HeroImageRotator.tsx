"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import ProductImage from "@/components/ProductImage";
import { imageUrl } from "@/lib/images";
import type { HeroSlide } from "@/data/hero-images";

const INTERVAL_MS = 4500;

type Props = {
  images: HeroSlide[];
};

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
      aria-label="Product infographics"
    >
      <div className="relative w-full aspect-[10/9] min-h-[min(88vw,520px)] sm:min-h-[440px] lg:min-h-[min(50vw,560px)] overflow-hidden rounded-sm border border-[#E5E2DB] bg-[#F9F8F5] shadow-sm">
        {images.map((img, i) => {
          const active = i === index;
          return (
            <Link
              key={imageUrl(img.src)}
              href={`/products/${img.slug}`}
              className={`absolute inset-0 block transition-opacity duration-500 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1C3A2A] focus-visible:ring-offset-2 ${
                active ? "opacity-100 z-10 cursor-pointer" : "opacity-0 z-0 pointer-events-none"
              }`}
              aria-hidden={!active}
              aria-label={`View ${img.productName} — shop now`}
              tabIndex={active ? 0 : -1}
            >
              <ProductImage
                src={img.src}
                alt=""
                priority={i === 0}
                sizes="(max-width: 1024px) 95vw, 58vw"
                className="object-contain w-full h-full pointer-events-none"
              />
              <span
                className="absolute inset-0 bg-[#1C3A2A]/0 hover:bg-[#1C3A2A]/[0.04] transition-colors"
                aria-hidden
              />
              <span className="absolute z-20 bottom-4 left-4 right-4 sm:left-auto sm:right-5 sm:bottom-5 sm:min-w-[180px] inline-flex items-center justify-center bg-[#1C3A2A] text-white px-6 py-3.5 text-[11px] tracking-[0.14em] uppercase font-semibold shadow-md pointer-events-none">
                Shop now
              </span>
            </Link>
          );
        })}
      </div>

      {images.length > 1 && (
        <div className="flex justify-center gap-2 mt-4" role="tablist" aria-label="Product slides">
          {images.map((img, i) => (
            <button
              key={img.src}
              type="button"
              role="tab"
              aria-selected={i === index}
              aria-label={img.productName}
              onClick={() => setIndex(i)}
              className={`h-1.5 rounded-full transition-all ${
                i === index ? "w-7 bg-[#1C3A2A]" : "w-1.5 bg-[#D4D0C8] hover:bg-[#B8B4AC]"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
