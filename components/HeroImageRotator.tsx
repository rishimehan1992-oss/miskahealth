"use client";

import { useCallback, useEffect, useState } from "react";
import ProductImage from "@/components/ProductImage";
import { imageUrl } from "@/lib/images";

const INTERVAL_MS = 4000;

type Props = {
  images: { src: string; alt: string }[];
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

  const current = images[index];

  return (
    <div
      className="w-full"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-roledescription="carousel"
      aria-label="Product photos"
    >
      <div className="relative aspect-[4/5] sm:aspect-square max-w-md mx-auto lg:max-w-none bg-white overflow-hidden">
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
              sizes="(max-width: 1024px) 90vw, 480px"
              className="object-contain p-4 sm:p-6 md:p-8"
            />
          </div>
        ))}
      </div>

      {images.length > 1 && (
        <div className="flex justify-center gap-2 mt-5">
          {images.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Show image ${i + 1}`}
              onClick={() => setIndex(i)}
              className={`h-1 rounded-full transition-all ${
                i === index ? "w-6 bg-[#1C3A2A]" : "w-1.5 bg-[#D4D0C8] hover:bg-[#B8B4AC]"
              }`}
            />
          ))}
        </div>
      )}

      <p className="mt-3 text-center text-[11px] tracking-[0.14em] uppercase text-[#888] font-medium">
        {current.alt}
      </p>
    </div>
  );
}
