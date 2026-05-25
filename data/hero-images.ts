export type HeroImage = {
  src: string;
  alt: string;
  /** Full-bleed infographic (no product padding) */
  marketing?: boolean;
};

/** Marketing efficacy slides first, then product pack shots */
export const heroImages: HeroImage[] = [
  {
    src: "/marketing/hero/hair-fall-actives.jpg",
    alt: "Rosemary · Caffeine · Biotin — follicle-level actives",
    marketing: true,
  },
  {
    src: "/marketing/hero/clinical-peptides.jpg",
    alt: "Redensyl · Procapil · Anagain — clinical peptides",
    marketing: true,
  },
  {
    src: "/marketing/hero/three-step-routine.jpg",
    alt: "Oil → Shampoo → Serum — complete hair fall routine",
    marketing: true,
  },
  { src: "/products/rosemary-hair-oil/image-1.jpg", alt: "Rosemary Hair Oil" },
  { src: "/products/rosemary-shampoo/image-1.jpg", alt: "Rosemary Shampoo" },
  { src: "/products/hair-scalp-serum/image-1.jpg", alt: "Hairfall Control Serum" },
];
