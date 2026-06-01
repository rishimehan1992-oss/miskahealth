# Blog post template (MISKA Journal)

Add to `data/blog.ts` inside `blogPosts` array. Match existing voice.

## Checklist before publish

- [ ] Primary keyword in `title` (natural, not stuffed)
- [ ] `excerpt` 120–160 chars, includes keyword variant
- [ ] `slug` matches keyword theme
- [ ] `relatedProductSlug` set when relevant
- [ ] 3–5 sections, 800–1200 words total
- [ ] 2+ internal links (products, ingredients, other posts)
- [ ] No cure/guarantee language
- [ ] Update `seo/content-calendar.json` → status `published`

## Template

```typescript
{
  slug: "primary-keyword-topic",
  title: "Clear benefit headline with primary keyword",
  excerpt: "One sentence hook + keyword. 120–160 characters for SERP snippet.",
  date: "YYYY-MM-DD",
  readTime: "5 min",
  category: "Hair science" | "Scalp care" | "Clinical actives",
  image: "/products/<slug>/lifestyle/lifestyle-1.jpg",
  relatedProductSlug: "rosemary-hair-oil",
  sections: [
    {
      paragraphs: [
        "Opening: problem the reader has. Why it matters. No fluff.",
      ],
    },
    {
      heading: "Section with secondary keyword",
      paragraphs: [
        "Educational content. Cite mechanisms (circulation, DHT, keratin) not miracles.",
        "Mention MISKA product naturally once — as part of routine, not hard sell.",
      ],
    },
    {
      heading: "How to use / what to look for",
      paragraphs: [
        "Actionable steps. Link conceptually to product page.",
      ],
    },
  ],
},
```

## Title patterns that work for MISKA

- "Why [ingredient] belongs in a [concern] routine"
- "[Product type] vs regular [product type]: what actually changes"
- "When [serum/oil] beats [alternative] — [active] explained"
- "How to use rosemary oil for hair fall (without wasting product)"

## Categories

- Hair science — oils, circulation, biotin
- Scalp care — shampoo, deposits, SLS-free
- Clinical actives — peptides, Redensyl, serums
