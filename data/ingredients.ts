import type { Product } from "./products";
import { getProductBySlug, products } from "./products";

export type IngredientCard = {
  step: number;
  name: string;
  role: string;
  benefit: string;
  detail: string;
};

export type IngredientPageData = {
  slug: string;
  headline: string;
  subhead: string;
  /** AI / editorial hero visual */
  heroVisual?: string;
  /** Pack label reference from Amazon */
  labelImage?: string;
  cards: IngredientCard[];
  freeFrom: string[];
};

const pages: Record<string, IngredientPageData> = {
  "rosemary-hair-oil": {
    slug: "rosemary-hair-oil",
    headline: "What goes on your scalp",
    subhead: "Four actives. One oil. Each ingredient is chosen for a documented role in hair fall and root strength.",
    heroVisual: "/products/rosemary-hair-oil/ingredients/hero.jpg",
    labelImage: "/products/rosemary-hair-oil/image-3.jpg",
    freeFrom: ["Paraben free", "Mineral oil free", "SLS free", "Clinically formulated"],
    cards: [
      {
        step: 1,
        name: "Rosemary",
        role: "Circulation active",
        benefit: "Stimulates scalp microcirculation",
        detail:
          "Helps deliver oxygen and nutrients to the follicle bed. Supports an environment where weak, thinning hair can recover.",
      },
      {
        step: 2,
        name: "Biotin",
        role: "Structure support",
        benefit: "Reinforces the hair shaft",
        detail:
          "Supports keratin infrastructure — the protein matrix that gives each strand tensile strength and resistance to breakage.",
      },
      {
        step: 3,
        name: "Caffeine",
        role: "Follicle defence",
        benefit: "Helps counter DHT effects",
        detail:
          "Penetrates the scalp to support follicles against DHT-linked miniaturisation — a key driver of pattern hair thinning.",
      },
      {
        step: 4,
        name: "Castor Oil",
        role: "Moisture seal",
        benefit: "Locks in hydration at the root",
        detail:
          "Rich emollient that reduces moisture loss along the strand and at the root zone, supporting softer, more flexible hair.",
      },
    ],
  },
  "rosemary-shampoo": {
    slug: "rosemary-shampoo",
    headline: "Treatment shampoo actives",
    subhead: "Deposits clinical actives with every wash. Sulphate-free cleansing that does not strip the scalp.",
    heroVisual: "/products/rosemary-shampoo/ingredients/hero.jpg",
    labelImage: "/products/rosemary-shampoo/image-3.jpg",
    freeFrom: ["SLS free", "Paraben free", "Silicone free", "Dermatologist tested"],
    cards: [
      {
        step: 1,
        name: "Rosemary",
        role: "Follicle stimulant",
        benefit: "Awakens dormant follicles",
        detail:
          "Encourages scalp vitality during cleansing so treatment actives can reach the root — not just the hair surface.",
      },
      {
        step: 2,
        name: "Caffeine",
        role: "Penetration active",
        benefit: "Deep scalp delivery",
        detail:
          "Small-molecule active designed to penetrate through the scalp barrier during the wash window for follicle-level action.",
      },
      {
        step: 3,
        name: "Moringa",
        role: "Antioxidant shield",
        benefit: "Protects scalp from oxidative stress",
        detail:
          "Helps neutralise free radicals from pollution and UV — factors that can weaken follicles and accelerate shedding.",
      },
      {
        step: 4,
        name: "Capilia Longa",
        role: "Density peptide",
        benefit: "Supports hair density signals",
        detail:
          "Plant-derived peptide complex that supports the signalling pathways linked to fuller-looking, denser hair over time.",
      },
    ],
  },
  "hair-scalp-serum": {
    slug: "hair-scalp-serum",
    headline: "Clinical peptide complex",
    subhead: "Five premium actives from leading ingredient houses — formulated for severe hair fall and weak follicles.",
    heroVisual: "/products/hair-scalp-serum/ingredients/hero.jpg",
    labelImage: "/products/hair-scalp-serum/image-3.jpg",
    freeFrom: ["Paraben free", "Minoxidil free", "Non-sticky", "Patch test advised"],
    cards: [
      {
        step: 1,
        name: "Redensyl",
        role: "Stem cell activator",
        benefit: "Reactivates hair stem cells",
        detail:
          "Givaudan (Switzerland) active that targets ORS stem cells — helping shift follicles from resting phase toward active growth.",
      },
      {
        step: 2,
        name: "Procapil",
        role: "Anchor peptide",
        benefit: "Strengthens follicle anchoring",
        detail:
          "Sederma (France) peptide blend that supports the dermal papilla — reducing anchoring loss that shows up as excessive daily shedding.",
      },
      {
        step: 3,
        name: "Anagain",
        role: "Growth extender",
        benefit: "Prolongs the growth phase",
        detail:
          "Swiss-origin active that helps extend anagen (growth) duration — giving hair more time to grow before it enters the shed cycle.",
      },
      {
        step: 4,
        name: "Capilia Longa",
        role: "Density support",
        benefit: "Thickness & density signalling",
        detail:
          "Supports cellular communication in the follicle bulb linked to improved hair thickness and visible density over consistent use.",
      },
      {
        step: 5,
        name: "Follicusan",
        role: "Follicle conditioner",
        benefit: "Revitalises the follicle milieu",
        detail:
          "Milk-based bioactive that helps condition the follicle environment — supporting healthier-looking regrowth at the root.",
      },
    ],
  },
};

export function getIngredientPage(slug: string): IngredientPageData | undefined {
  return pages[slug];
}

export function getIngredientPageWithProduct(slug: string): { page: IngredientPageData; product: Product } | undefined {
  const product = getProductBySlug(slug);
  const page = pages[slug];
  if (!product || !page) return undefined;
  return { page, product };
}

export function getAllIngredientSlugs(): string[] {
  return products.filter((p) => pages[p.slug]).map((p) => p.slug);
}
