# MISKA Site SEO Baseline — 2026-05-29

Audit of miskahealth.in codebase. Re-run `npm run seo:audit` for fresh checks.

## Strengths

| Area | Status |
|------|--------|
| Domain & metadataBase | `https://www.miskahealth.in` in layout |
| Sitemap | Dynamic: home, products, ingredients, blog |
| robots.txt | Blocks checkout, cart, orders, api, auth |
| GA4 | G-JP9Q237XV0 |
| Product SEO | Per-product `seo.title` / `seo.description` in `data/products.ts` |
| Homepage | Rich metadata, keywords, OG, canonical |
| Product pages | Canonical, OG images, keywords |
| Blog | 3 posts, static generation, related products |
| Image optimization | WebP/AVIF, lazy loading, sizes attrs |
| Mobile | Responsive, 16px checkout inputs |

## Gaps (prioritized)

### P0 — Indexation & discovery

- [ ] Submit sitemap in Google Search Console + Bing Webmaster
- [ ] Verify domain property (DNS or HTML)
- [ ] Add `/admin` to robots disallow (currently only checkout/cart/orders/api/auth)

### P1 — On-page

- [ ] Blog posts lack `alternates.canonical` and full Open Graph images (products have them)
- [ ] Blog index (`/blog`) thin metadata — add keywords, OG image
- [ ] No JSON-LD: Organization, Product, Article, BreadcrumbList
- [ ] Sitemap lists `/cart` — robots disallows it; remove from sitemap (noise)

### P2 — Content

- [ ] Only **3 blog posts** — target 2/month minimum
- [ ] Missing informational pages for high-volume queries:
  - "rosemary oil for hair fall how to use"
  - "Redensyl vs minoxidil" (careful, no medical claims)
  - "hair fall routine for women India"
  - "SLS free shampoo hair fall"
- [ ] Ingredient hub (`/ingredients`) — expand cross-links from blog

### P3 — Off-page

- [ ] No backlink log yet — start outreach (see backlink-playbook.md)
- [ ] Amazon product links exist but don't pass SEO to site — use "Shop on MISKA" CTAs in content

### P4 — Technical polish

- [ ] Add `hreflang` only if Hindi pages added later
- [ ] FAQ schema on product pages (from existing copy)
- [ ] Internal links: homepage → blog, blog → products (partially done)

## Target keyword map (initial)

See `seo/keywords.json` for live tracking. Primary money pages:

| Keyword cluster | Target URL |
|-----------------|------------|
| rosemary hair oil India | `/products/rosemary-hair-oil` |
| hair fall shampoo / treatment shampoo | `/products/rosemary-shampoo` |
| hair fall serum Redensyl | `/products/hair-scalp-serum` |
| hair fall routine / hair science | `/blog` + new posts |

## Competitor watch (manual)

Track monthly: Minimalist, Pilgrim, Traya, Man Matters — note their ranking URLs for shared keywords.
