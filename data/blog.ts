export type BlogSection = {
  heading?: string;
  paragraphs: string[];
};

export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  category: string;
  image: string;
  relatedProductSlug?: string;
  sections: BlogSection[];
};

export const blogPosts: BlogPost[] = [
  {
    slug: "rosemary-scalp-science-hair-fall",
    title: "Why rosemary belongs in a serious hair-fall routine",
    excerpt:
      "Rosemary is not a fragrance add-on. When dosed correctly, it supports scalp circulation — the delivery system your follicles depend on.",
    date: "2026-05-12",
    readTime: "5 min",
    category: "Hair science",
    image: "/products/rosemary-hair-oil/lifestyle/lifestyle-1.jpg",
    relatedProductSlug: "rosemary-hair-oil",
    sections: [
      {
        paragraphs: [
          "Most hair oils moisturise the strand. A clinical oil has to work at the root — where diameter, anchoring, and growth phase are decided.",
          "Rosemary extract is one of the few botanical actives with a documented link to scalp microcirculation. Better blood flow means better delivery of oxygen and nutrients to the follicle bed — especially important when shedding is linked to weak, miniaturising follicles.",
        ],
      },
      {
        heading: "Pairing rosemary with biotin and caffeine",
        paragraphs: [
          "Circulation alone does not rebuild structure. Biotin supports the keratin matrix that gives each strand tensile strength. Caffeine helps counter DHT-linked stress at the follicle — a common driver of pattern thinning in both men and women.",
          "MISKA Rosemary Hair Oil combines these actives in a leave-on format so they work overnight, when the scalp is not being stripped by harsh cleansers.",
        ],
      },
      {
        heading: "How to use it",
        paragraphs: [
          "Apply to the scalp — not only mid-lengths — massage for two to three minutes, and leave in. Consistency over eight to twelve weeks matters more than occasional heavy application.",
        ],
      },
    ],
  },
  {
    slug: "treatment-shampoo-hair-fall",
    title: "Treatment shampoo vs regular shampoo: what actually changes",
    excerpt:
      "A sulphate-free label is not enough. Treatment shampoo deposits actives during the wash window — when the scalp is clean and receptive.",
    date: "2026-05-08",
    readTime: "4 min",
    category: "Scalp care",
    image: "/products/rosemary-shampoo/lifestyle/lifestyle-2.jpg",
    relatedProductSlug: "rosemary-shampoo",
    sections: [
      {
        paragraphs: [
          "Regular shampoo removes oil and build-up. Treatment shampoo does that without stripping — and leaves behind actives that continue working after you rinse.",
          "That difference matters for hair fall. If your cleanser leaves the scalp tight, dry, or squeaky, you are signalling stress to follicles already under pressure.",
        ],
      },
      {
        heading: "What to look for on the label",
        paragraphs: [
          "Rosemary and caffeine for follicle stimulation and penetration. Moringa for antioxidant defence against pollution and UV. Peptide complexes such as Capilia Longa for density signalling.",
          "MISKA Rosemary Shampoo is SLS- and paraben-free by design — not as marketing, but so daily washing does not undo the rest of your routine.",
        ],
      },
      {
        heading: "Building a routine",
        paragraphs: [
          "Use treatment shampoo as your primary wash. Follow with a targeted oil or serum on non-wash nights. Avoid stacking five products; choose two that address root cause and stay consistent.",
        ],
      },
    ],
  },
  {
    slug: "hairfall-serum-peptides-guide",
    title: "When a hairfall serum beats oil — peptide actives explained",
    excerpt:
      "Serums deliver concentrated, low-viscosity actives to the scalp. For severe shedding, peptide complexes target stem cells and anchoring — not just surface shine.",
    date: "2026-05-01",
    readTime: "6 min",
    category: "Clinical actives",
    image: "/products/hair-scalp-serum/lifestyle/lifestyle-1.jpg",
    relatedProductSlug: "hair-scalp-serum",
    sections: [
      {
        paragraphs: [
          "Oils nourish and seal. Serums penetrate. If hair fall is advanced — visible thinning, widening part line, or shedding above 80–100 strands daily — you often need follicle-level signalling, not only emollients.",
        ],
      },
      {
        heading: "Redensyl, Procapil, and Anagain",
        paragraphs: [
          "Redensyl (Givaudan) targets ORS stem cells to help shift follicles toward active growth. Procapil (Sederma) supports dermal papilla anchoring — reducing the shedding that comes from weak hold at the root.",
          "Anagain helps extend the growth phase so strands have more time to mature before entering the shed cycle. These are not generic \"hair vitamins\"; they are supplier-backed cosmetic actives with defined mechanisms.",
        ],
      },
      {
        heading: "How MISKA Hairfall Control Serum fits",
        paragraphs: [
          "The serum layers five clinical actives including Capilia Longa and Follicusan in a non-sticky base suitable for morning or night application on a clean scalp.",
          "Patch test before full use. Apply along partings and thinning zones, massage lightly, and do not rinse out. Pair with a gentle treatment shampoo — not harsh daily clarifiers.",
        ],
      },
    ],
  },
];

export function getBlogPost(slug: string): BlogPost | undefined {
  return blogPosts.find((p) => p.slug === slug);
}

export function getAllBlogSlugs(): string[] {
  return blogPosts.map((p) => p.slug);
}
