/**
 * MISKA — Product Data
 */

export type ProductFormula = {
  name: string;
  action: string;
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
      title: "Rosemary Hair Oil",
      description: "Rosemary hair oil with biotin, caffeine & castor. ₹399 · 200ml.",
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
    price: 399,
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
      lifestyle: [
        "/products/rosemary-shampoo/lifestyle/lifestyle-1.jpg",
        "/products/rosemary-shampoo/lifestyle/lifestyle-2.jpg",
        "/products/rosemary-shampoo/lifestyle/lifestyle-3.jpg",
        "/products/rosemary-shampoo/lifestyle/lifestyle-4.jpg",
      ],
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
      title: "Rosemary Shampoo",
      description: "Treatment shampoo with biotin & caffeine. ₹399 · 200ml.",
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
    price: 499,
    mrp: 799,
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
      { name: "Redensyl", action: "Stem cell support" },
      { name: "Procapil", action: "Follicle anchor" },
      { name: "Anagain", action: "Growth phase" },
      { name: "Capilia Longa", action: "Density support" },
    ],
    amazonUrl: "https://www.amazon.in/dp/B0FXTS927W",
    seo: {
      title: "Hairfall Control Serum",
      description: "Clinical hairfall serum with Redensyl, Procapil & Anagain. 60ml.",
    },
  },
];

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getAvailableProducts(): Product[] {
  return products.filter((p) => p.available);
}
