"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ProductImage from "./ProductImage";
import { imageUrl } from "@/lib/images";

type Props = {
  images: string[];
  alt: string;
  priority?: boolean;
};

export default function ImageCarousel({ images, alt, priority = false }: Props) {
  const [current, setCurrent] = useState(0);
  const valid = images.filter(Boolean);
  if (!valid.length) return null;

  return (
    <div className="select-none w-full cursor-default">
      <div className="relative aspect-square overflow-hidden bg-white mx-auto max-w-[min(100%,28rem)]">
        {valid.map((src, i) => (
          <div
            key={imageUrl(src)}
            className={`absolute inset-0 transition-opacity duration-300 ${
              i === current ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
            }`}
          >
            <ProductImage
              src={src}
              alt={`${alt} — ${i + 1}`}
              priority={priority && i === 0}
              sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 420px"
              className="object-contain p-6 sm:p-8 md:p-10"
            />
          </div>
        ))}
        {valid.length > 1 && (
          <>
            <button
              type="button"
              onClick={() => setCurrent((c) => (c - 1 + valid.length) % valid.length)}
              className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 z-20 p-2 text-[#999] hover:text-[#0A0A0A] touch-manipulation"
              aria-label="Previous"
            >
              <ChevronLeft size={20} strokeWidth={1} />
            </button>
            <button
              type="button"
              onClick={() => setCurrent((c) => (c + 1) % valid.length)}
              className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 z-20 p-2 text-[#999] hover:text-[#0A0A0A] touch-manipulation"
              aria-label="Next"
            >
              <ChevronRight size={20} strokeWidth={1} />
            </button>
          </>
        )}
      </div>
      {valid.length > 1 && (
        <div className="flex justify-center gap-2.5 mt-6 pb-1">
          {valid.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setCurrent(i)}
              className={`h-1 rounded-full transition-all ${
                i === current ? "w-5 bg-[#1C3A2A]" : "w-1.5 bg-[#D4D0C8]"
              }`}
              aria-label={`Image ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
