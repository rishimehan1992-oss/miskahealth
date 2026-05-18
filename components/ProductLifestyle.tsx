"use client";

import ProductImage from "./ProductImage";

type Props = {
  images: string[];
  alt: string;
};

export default function ProductLifestyle({ images, alt }: Props) {
  if (!images.length) return null;

  return (
    <section className="mt-12 sm:mt-14 pt-10 border-t border-[#EDE9E1]">
      <h2 className="text-[10px] tracking-[0.25em] text-[#0A0A0A] uppercase font-semibold mb-6">
        In use
      </h2>
      <div className="flex gap-4 overflow-x-auto pb-3 snap-x snap-mandatory">
        {images.map((src, i) => (
          <div key={src} className="snap-start shrink-0 w-[min(72vw,300px)] sm:w-[320px]">
            <div className="relative aspect-[4/5] bg-white overflow-hidden">
              <ProductImage
                src={src}
                alt={`${alt} lifestyle ${i + 1}`}
                sizes="320px"
                className="object-cover object-center"
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
