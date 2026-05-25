/** One slide per product: bottle + actives infographic */
export type HeroSlide = {
  src: string;
  alt: string;
  slug: string;
  productName: string;
};

export const heroImages: HeroSlide[] = [
  {
    src: "/marketing/hero/hero-rosemary-hair-oil.jpg",
    alt: "Rosemary Hair Oil with follicle actives infographic",
    slug: "rosemary-hair-oil",
    productName: "Rosemary Hair Oil",
  },
  {
    src: "/marketing/hero/hero-rosemary-shampoo.jpg",
    alt: "Rosemary Shampoo with treatment wash actives infographic",
    slug: "rosemary-shampoo",
    productName: "Rosemary Shampoo",
  },
  {
    src: "/marketing/hero/hero-hair-scalp-serum.jpg",
    alt: "Hairfall Control Serum with peptide efficacy infographic",
    slug: "hair-scalp-serum",
    productName: "Hairfall Control Serum",
  },
];
