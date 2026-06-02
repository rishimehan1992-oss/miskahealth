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
    slug: "sls-free-shampoo-hair-fall",
    title: "Why SLS-free shampoo matters when you're losing hair",
    excerpt:
      "Sulphates clean well but can leave the scalp tight and stressed. For hair fall, a gentle treatment shampoo deposits actives without the daily strip.",
    date: "2026-06-01",
    readTime: "5 min",
    category: "Scalp care",
    image: "/products/rosemary-shampoo/image-1.jpg",
    relatedProductSlug: "rosemary-shampoo",
    sections: [
      {
        paragraphs: [
          "Hair fall is not only about what you add — it is about what your wash removes. Sodium lauryl sulphate (SLS) and similar sulphates are strong surfactants. They lift oil and build-up fast, but many people finish with a tight, squeaky scalp.",
          "When follicles are already under stress from shedding, hard water, or heat styling, that tightness is a signal worth listening to.",
        ],
      },
      {
        heading: "What sulphate-free really means",
        paragraphs: [
          "SLS-free does not mean non-cleansing. It means the cleanser is milder and less likely to strip the scalp barrier you need for comfortable daily washing.",
          "For hair fall routines in India — sweat, pollution, frequent washing — you still need a shampoo that cleans. The goal is clean without panic at the root.",
        ],
      },
      {
        heading: "Treatment shampoo vs regular sulphate-free",
        paragraphs: [
          "A mild shampoo that only rinses clean is step one. A treatment shampoo also deposits actives during the wash window — rosemary and caffeine for follicle support, moringa for antioxidant defence, peptides for density signalling.",
          "MISKA Rosemary Shampoo is SLS- and paraben-free by design, so you can wash every two to three days without undoing overnight oil or serum work.",
        ],
      },
      {
        heading: "How to build your wash day",
        paragraphs: [
          "Focus product on the scalp, not only lengths. Massage for a minute, rinse thoroughly, and avoid piling conditioner on the root if your scalp runs oily.",
          "Pair with rosemary hair oil on non-wash nights. If thinning is visible at the part line, add a peptide serum on clean scalp mornings.",
        ],
      },
      {
        heading: "When to see a specialist",
        paragraphs: [
          "Sudden patches, pain, or scarring need a dermatologist — not a shampoo change alone. For gradual shedding with a stressed scalp feel, switching off harsh sulphates is a low-risk first move.",
        ],
      },
    ],
  },
  {
    slug: "hair-fall-routine-women-india",
    title: "Hair fall routine for women in India — oil, wash, serum",
    excerpt:
      "A simple weekly rhythm for hair fall: rosemary oil on scalp nights, sulphate-free treatment shampoo, and when to add a peptide serum for thinning at the part line.",
    date: "2026-06-01",
    readTime: "6 min",
    category: "Hair science",
    image: "/products/hair-scalp-serum/image-1.jpg",
    relatedProductSlug: "hair-scalp-serum",
    sections: [
      {
        paragraphs: [
          "Hair fall in women is rarely one cause. Stress, postpartum shifts, tight hairstyles, hard water, and harsh cleansers stack on top of genetics. A routine that works in India’s heat and pollution does not need ten products — it needs three roles done consistently: nourish roots, wash without stripping, signal growth where thinning shows.",
        ],
      },
      {
        heading: "Weekly rhythm at a glance",
        paragraphs: [
          "Wash every two to three days with a treatment shampoo. On non-wash nights, apply rosemary hair oil to the scalp and massage two to three minutes. If the part line is widening or shedding is above your normal baseline, add a peptide serum on clean scalp mornings — not on heavy oil nights.",
          "Keep the same rhythm for eight to twelve weeks before judging results. Switching products weekly makes it impossible to know what helped.",
        ],
      },
      {
        heading: "Step 1 — Rosemary oil (scalp nights)",
        paragraphs: [
          "Part hair in sections. Apply oil along the scalp, especially temples and crown. Use one to two teaspoons for shoulder-length hair. Leave at least two hours or overnight.",
          "Rosemary supports circulation; biotin supports keratin structure; caffeine helps follicles under everyday DHT-linked stress. MISKA Rosemary Hair Oil is built as a leave-on scalp treatment, not a length-only shine oil.",
        ],
      },
      {
        heading: "Step 2 — Treatment shampoo (wash days)",
        paragraphs: [
          "Choose sulphate-free shampoo that deposits actives during the wash — rosemary, caffeine, moringa — without a squeaky, tight scalp. That is the difference between treatment shampoo and regular shampoo.",
          "MISKA Rosemary Shampoo is designed for frequent washing in Indian climates without undoing your oil nights.",
        ],
      },
      {
        heading: "Step 3 — Serum when thinning is visible",
        paragraphs: [
          "If shedding is advanced — visible scalp at the part, ponytail circumference shrinking — add a low-viscosity serum with Redensyl, Procapil, or Anagain on clean, dry scalp. Apply in rows along partings; do not rinse out.",
          "MISKA Hairfall Control Serum layers peptide actives for follicle signalling. Pair with gentle washing; avoid stacking five styling products on the same day.",
        ],
      },
      {
        heading: "What to avoid",
        paragraphs: [
          "Daily heat on the roots, tight buns while hair is wet, skipping wash after heavy sweat, and oiling only the ends. Patch test new actives behind the ear.",
          "See a dermatologist if you have sudden bald patches, scarring, or shedding with scalp pain — those need diagnosis beyond home care.",
        ],
      },
    ],
  },
  {
    slug: "rosemary-oil-hair-fall-how-to-use",
    title: "How to use rosemary oil for hair fall — step by step",
    excerpt:
      "Apply to the scalp, not just the lengths. A simple rosemary oil routine for hair fall: when to use, how much, and what to pair with your wash day.",
    date: "2026-06-01",
    readTime: "5 min",
    category: "Hair science",
    image: "/products/rosemary-hair-oil/image-1.jpg",
    relatedProductSlug: "rosemary-hair-oil",
    sections: [
      {
        paragraphs: [
          "Rosemary oil for hair fall only works when it reaches the scalp. Most people pour oil on mid-lengths, tie up, and wonder why shedding continues. Follicles live in the scalp — circulation, anchoring, and growth phase are decided there.",
          "This guide is a practical routine for India’s climate: leave-on night application, gentle treatment shampoo on wash days, and consistency over eight to twelve weeks.",
        ],
      },
      {
        heading: "When to apply rosemary oil",
        paragraphs: [
          "Use on non-wash nights or at least four to six hours before shampooing. Evening works well — the scalp is not exposed to pollution or heat styling right after application.",
          "If you wash hair every two to three days, oil on alternate nights is enough. Daily heavy oiling can clog pores on oily scalps.",
        ],
      },
      {
        heading: "Step-by-step application",
        paragraphs: [
          "Part dry or towel-damp hair into sections. Using the dropper or fingertips, apply oil directly along the partings — crown, temples, and thinning zones first.",
          "Use roughly one to two teaspoons for shoulder-length hair; adjust for density. Massage with fingertips for two to three minutes in small circles. Do not scratch.",
          "Leave in overnight or for a minimum of two hours. In the morning, wash with a sulphate-free treatment shampoo so actives deposit without stripping.",
        ],
      },
      {
        heading: "What to pair with rosemary oil",
        paragraphs: [
          "Rosemary supports scalp microcirculation. Biotin helps keratin structure; caffeine supports follicles under DHT-linked stress. MISKA Rosemary Hair Oil combines these in a leave-on base.",
          "On wash days, use a treatment shampoo that deposits rosemary and caffeine — not a harsh clarifier. For advanced thinning, add a peptide serum on clean scalp mornings. See our notes on treatment shampoo vs regular shampoo and when a serum beats oil alone.",
        ],
      },
      {
        heading: "Common mistakes",
        paragraphs: [
          "Applying only to ends, skipping massage, washing too soon, or switching products every week. Track shedding loosely — bathroom drain and part width — not daily panic.",
          "Patch test behind the ear if you are new to essential-oil-based formulas. Stop if you see persistent redness or itching.",
        ],
      },
    ],
  },
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
