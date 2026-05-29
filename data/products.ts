/**
 * MISKA — Product Data
 */

export type ProductFormula = {
  name: string;
  action: string;
  /** Shorter line for homepage cards (optional) */
  cardAction?: string;
};

export type Product = {
  id: number;
  slug: string;
  label: string;
  name: string;
  tagline: string;
  concern: string;
  category: string;
  volume: string;
  price: number | null;
  mrp: number | null;
  tag: string;
  available: boolean;
  images: {
    main: string;
    gallery: string[];
    lifestyle: string[];
  };
  description: string;
  formula: ProductFormula[];
  amazonUrl: string | null;
  seo: {
    title: string;
    description: string;
  };
};

export const products: Product[] = [
  {
    id: 1,
    slug: "rosemary-hair-oil",
    label: "No. 01",
    name: "Rosemary Hair Oil",
    tagline: "Growth · Nourishment · Repair",
    concern: "Hair fall, thinning & weak roots",
    category: "Hair Oil",
    volume: "200 ml",
    price: 399,
    mrp: 799,
    tag: "Bestseller",
    available: true,
    images: {
      main: "/products/rosemary-hair-oil/image-1.jpg",
      gallery: [
        "/products/rosemary-hair-oil/image-1.jpg",
        "/products/rosemary-hair-oil/image-2.jpg",
        "/products/rosemary-hair-oil/image-3.jpg",
        "/products/rosemary-hair-oil/image-4.jpg",
      ],
      lifestyle: [
        "/products/rosemary-hair-oil/lifestyle/lifestyle-1.jpg",
        "/products/rosemary-hair-oil/lifestyle/lifestyle-2.jpg",
        "/products/rosemary-hair-oil/lifestyle/lifestyle-3.jpg",
      ],
    },
    description:
      "A clinically-formulated oil that works at the follicle level. Biotin reinforces the hair shaft. Caffeine blocks DHT. Castor oil seals moisture. Rosemary drives scalp circulation.",
    formula: [
      { name: "Rosemary", action: "Boosts scalp circulation" },
      { name: "Biotin", action: "Strengthens hair shaft" },
      { name: "Caffeine", action: "Helps block DHT" },
      { name: "Castor Oil", action: "Seals moisture" },
    ],
    amazonUrl:
      "https://www.amazon.in/Miska-Rosemary-Hair-Contains-Caffeine/dp/B0DPC8L8B9",
    seo: {
      title: "Rosemary Hair Oil — Biotin, Caffeine & Castor | MISKA",
      description:
        "MISKA Rosemary Hair Oil with biotin, caffeine, castor oil & rosemary. Clinically formulated for hair fall & thinning. 200ml · ₹399. Free shipping on prepaid orders.",
    },
  },

  {
    id: 2,
    slug: "rosemary-shampoo",
    label: "No. 02",
    name: "Rosemary Shampoo",
    tagline: "Cleanse · Activate · Strengthen",
    concern: "Hair fall, oily scalp & breakage",
    category: "Shampoo",
    volume: "200 ml",
    price: 349,
    mrp: 699,
    tag: "Daily use",
    available: true,
    images: {
      main: "/products/rosemary-shampoo/image-1.jpg",
      gallery: [
        "/products/rosemary-shampoo/image-1.jpg",
        "/products/rosemary-shampoo/image-2.jpg",
        "/products/rosemary-shampoo/image-3.jpg",
      ],
      lifestyle: [],
    },
    description:
      "Not a cosmetic shampoo — a treatment shampoo. Each wash deposits biotin, caffeine, moringa and cappila longa onto the scalp. Sulphate and paraben free.",
    formula: [
      { name: "Rosemary", action: "Stimulates follicles" },
      { name: "Caffeine", action: "Scalp penetration" },
      { name: "Moringa", action: "Antioxidant care" },
      { name: "Cappila Longa", action: "Density support" },
    ],
    amazonUrl:
      "https://www.amazon.in/Miska-Rosemary-Hair-Stimulates-Contains/dp/B0DPZJRXYF",
    seo: {
      title: "Rosemary Treatment Shampoo — Biotin & Caffeine | MISKA",
      description:
        "MISKA Rosemary Treatment Shampoo with biotin, caffeine & moringa. SLS & paraben free. Clinically formulated for hair fall & oily scalp. 200ml · ₹349.",
    },
  },

  {
    id: 3,
    slug: "hair-scalp-serum",
    label: "No. 03",
    name: "Hairfall Control Serum",
    tagline: "Targeted · Concentrated · Clinical",
    concern: "Severe hair loss & weak follicles",
    category: "Serum",
    volume: "60 ml",
    price: 899,
    mrp: 1299,
    tag: "New",
    available: true,
    images: {
      main: "/products/hair-scalp-serum/image-1.jpg",
      gallery: [
        "/products/hair-scalp-serum/image-1.jpg",
        "/products/hair-scalp-serum/image-2.jpg",
        "/products/hair-scalp-serum/image-3.jpg",
        "/products/hair-scalp-serum/image-4.jpg",
      ],
      lifestyle: [
        "/products/hair-scalp-serum/lifestyle/lifestyle-1.jpg",
        "/products/hair-scalp-serum/lifestyle/lifestyle-2.jpg",
        "/products/hair-scalp-serum/lifestyle/lifestyle-3.jpg",
      ],
    },
    description:
      "Follivive hairfall control serum with Capilia Longa, Procapil, Redensyl, Anagain and Follicusan. Works at the root to reactivate growth-phase follicles and block DHT at the cellular level.",
    formula: [
      { name: "Redensyl", action: "Reactivates hair stem cells", cardAction: "Stem cell support" },
      { name: "Procapil", action: "Strengthens follicle anchor", cardAction: "Follicle anchor" },
      { name: "Anagain", action: "Extends growth phase", cardAction: "Growth phase" },
      { name: "Capilia Longa", action: "Density & thickness support", cardAction: "Density support" },
    ],
    amazonUrl: "https://www.amazon.in/dp/B0FXTS927W",
    seo: {
      title: "Hairfall Control Serum — Redensyl, Procapil & Anagain | MISKA",
      description:
        "MISKA Hairfall Control Serum with Redensyl, Procapil, Anagain & Capilia Longa. Targets hair fall at the follicle level. 60ml · ₹899. Free shipping on prepaid.",
    },
  },
];

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getAvailableProducts(): Product[] {
  return products.filter((p) => p.available);
}
