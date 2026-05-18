"use client";

import ProductImage from "./ProductImage";

type Props = {
  images: string[];
  alt: string;
};

export default function ProductLifestyle({ images, alt }: Props) {
  if (!images.length) return null;

  return (
    <section className="mt-14 sm:mt-16 pt-12 border-t border-[#EDE9E1]">
      <h2 className="text-[10px] tracking-[0.22em] text-[#0A0A0A] uppercase font-semibold mb-8">
        In use
      </h2>
      <div className="flex gap-5 sm:gap-6 overflow-x-auto pb-4 snap-x snap-mandatory">
        {images.map((src, i) => (
          <div key={src} className="snap-start shrink-0 w-[min(68vw,280px)] sm:w-[300px]">
            <div className="relative aspect-[4/5] bg-white overflow-hidden rounded-sm">
              <ProductImage
                src={src}
                alt={`${alt} lifestyle ${i + 1}`}
                sizes="300px"
                className="object-cover object-center"
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
