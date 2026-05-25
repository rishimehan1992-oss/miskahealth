"use client";

import { useCallback, useEffect, useState } from "react";
import ProductImage from "@/components/ProductImage";
import { imageUrl } from "@/lib/images";

const INTERVAL_MS = 4500;

type Slide = { src: string; alt: string };

type Props = {
  images: readonly Slide[];
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
      aria-label="Hair science infographics"
    >
      <div className="relative w-full aspect-[10/9] min-h-[min(88vw,520px)] sm:min-h-[440px] lg:min-h-[min(50vw,560px)] overflow-hidden rounded-sm border border-[#E5E2DB] bg-[#F9F8F5] shadow-sm">
        {images.map((img, i) => (
          <div
            key={imageUrl(img.src)}
            className={`absolute inset-0 transition-opacity duration-500 ease-in-out ${
              i === index ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
            aria-hidden={i !== index}
          >
            <ProductImage
              src={img.src}
              alt={img.alt}
              priority={i === 0}
              sizes="(max-width: 1024px) 95vw, 58vw"
              className="object-contain w-full h-full"
            />
          </div>
        ))}
      </div>

      {images.length > 1 && (
        <div className="flex justify-center gap-2 mt-4" role="tablist" aria-label="Infographic slides">
          {images.map((img, i) => (
            <button
              key={img.src}
              type="button"
              role="tab"
              aria-selected={i === index}
              aria-label={img.alt}
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
