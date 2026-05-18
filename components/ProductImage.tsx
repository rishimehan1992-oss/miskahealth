"use client";

import Image from "next/image";
import { imageUrl } from "@/lib/images";

type Props = {
  src: string;
  alt: string;
  priority?: boolean;
  sizes?: string;
  className?: string;
};

/** Local product JPGs are pre-optimized; skip Next resize to avoid blur. */
export default function ProductImage({
  src,
  alt,
  priority = false,
  sizes = "(max-width: 768px) 100vw, 500px",
  className = "object-contain p-4 md:p-6",
}: Props) {
  return (
    <Image
      src={imageUrl(src)}
      alt={alt}
      fill
      unoptimized
      className={className}
      sizes={sizes}
      priority={priority}
    />
  );
}
