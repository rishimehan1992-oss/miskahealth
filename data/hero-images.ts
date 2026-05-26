/** Mobile-first hero banners — large products, minimal text */
export type HeroSlide = {
  src: string;
  alt: string;
  productName: string;
  /** Product page; omit to link to shop section */
  slug?: string;
  href?: string;
};

export const heroImages: HeroSlide[] = [
  {
    src: "/marketing/hero/hero-mobile-range.jpg",
    alt: "MISKA oil, shampoo and serum — complete hair fall routine",
    productName: "Shop the range",
    href: "/#products",
  },
  {
    src: "/marketing/hero/hero-mobile-oil.jpg",
    alt: "Rosemary Hair Oil for hair fall",
    productName: "Rosemary Hair Oil",
    slug: "rosemary-hair-oil",
  },
  {
    src: "/marketing/hero/hero-mobile-serum-shampoo.jpg",
    alt: "Rosemary Shampoo and Hairfall Serum",
    productName: "Shampoo & Serum",
    slug: "rosemary-shampoo",
  },
];
