# MISKA Facebook Ads — Creatives & Playbook

## Static images (Feed / Advantage+ / Carousel)

**Folder:** `marketing/facebook-ads/static/`

Each creative is exported in **1080×1080** (square) and **1080×1350** (4:5 feed).

| File | Style | Best for |
|------|--------|----------|
| `ad-01-science-actives` | Minimalist — actives chips + formula | Cold traffic, science angle |
| `ad-02-combo-offer` | Pilgrim — 3 products + COMBO99 | Bundle / offer ad set |
| `ad-03-oil-hero-price` | Hero product + Rs.399 + SAVE 50% | Bestseller oil, retargeting |
| `ad-04-before-after` | Before vs After cards | Problem-aware audience |
| `ad-05-lifestyle-trust` | Lifestyle + clinic trust + COD | Brand trust, women 25–44 |

### Ingredient & hair-fall mechanism ads (new)

| File | Focus | Best for |
|------|--------|----------|
| `ad-06-oil-four-actives` | Oil infographic + 4 actives vs hair fall | Oil prospecting |
| `ad-07-caffeine-dht` | Caffeine · DHT / follicle defence | Educated buyers, men & women |
| `ad-08-serum-peptides` | Redensyl · Procapil · Anagain | Severe hair fall / serum upsell |
| `ad-09-arrest-hairfall-flow` | 3-step how MISKA arrests fall | Top-of-funnel education |
| `ad-10-shampoo-deposits` | Shampoo actives every wash | Shampoo + routine cross-sell |

Regenerate:

```bash
python3 scripts/generate-fb-ad-images.py
```

---

## Video files (9:16 · Reels / Stories / Feed)

| File | Angle | Length |
|------|--------|--------|
| `miska-combo99-offer-9x16.mp4` | Hook → science actives → products + **Rs.** prices → before/after → trust | ~19s |
| `miska-hairfall-routine-9x16.mp4` | Problem → shampoo science → **Rs.** price + SAVE % → before/after → routine | ~20s |

**Currency:** All on-screen prices use `Rs.399` (not `₹`) — Arial cannot render the rupee glyph in video frames.

**Style:** Science-first hooks (Minimalist-style transparency), trust badges, MRP strikethrough + SAVE %, Ken Burns motion.

**Assets:** Real pack shots only — no marketing hero graphics or glass mock bottles.

**Music:** Background track in `audio/ambient-beauty.mp3` (downloaded on first run). Swap that file for your own royalty-free MP3 and re-run.

Regenerate after asset changes:

```bash
python3 scripts/generate-fb-ad-videos.py
```

---

## Recommended Facebook / Instagram setup

### Campaign objective (start here)

**Sales** (or **Leads** if pixel is new) → Ad set optimization: **Purchase** or **Landing page views** for the first 3–5 days, then switch to Purchase once you have ~50 events/week.

### Best ad formats for MISKA

1. **Advantage+ Shopping Campaign (ASC)** — one catalog/creative mix, Meta finds buyers. Use when you have 2+ creatives and stable checkout.
2. **Reels / Stories (9:16)** — use the MP4s above; highest reach per rupee for D2C beauty in India.
3. **Carousel** — slide 1: range hero, slide 2: oil, slide 3: shampoo, slide 4: “COMBO99 · Rs.99 off bundles”.
4. **UGC-style** (film on phone) — 15–30s: “I switched from random rosemary oil to this because of biotin + caffeine on the label.” Performs well next to polished ads.

### Targeting (India · hair fall / thinning)

| Layer | Setting |
|--------|---------|
| **Geo** | India → start **Karnataka, Maharashtra, Delhi NCR, Telangana, Tamil Nadu** (metros + tier-2). Expand after CPA is stable. |
| **Age** | **25–54** (core); test **22–24** women separately for serum/shampoo. |
| **Gender** | Start **Women 80%** budget; parallel ad set **Men 25–44** for oil (short creative, “DHT / stress hair fall”). |
| **Interests** | Hair care, Organic beauty, Biotin, Hair loss treatment, Nykaa, Minimalist, Mamaearth, dermatology (broad). |
| **Behaviors** | Online shoppers, engaged shoppers. |
| **Advantage+ audience** | ON after 1 week of data; let Meta broaden from purchasers. |

**Lookalikes (when you have data):** 1% purchasers, 1% add-to-cart, 1% video viewers 75%.

**Exclude:** Past purchasers (7 days) from cold campaigns; show them remarketing with COMBO99.

### Placements

- **Advantage+ placements ON** for prospecting.
- For testing, duplicate ad set with **Instagram Reels + Facebook Reels + Stories only** (often lower CPM for video).

### Budget (starting point)

- **₹500–800/day** per ad set while learning (minimum ~₹300/day often learns too slowly).
- 2 ad sets: **Combo offer (COMBO99)** + **Hair fall routine (oil hero)**.
- Kill ads with **CTR &lt; 0.8%** after 2k impressions; scale winners at **+20% budget every 3 days**.

### Copy angles (primary text)

**Combo ad**

> Complete hair fall routine — Oil + Shampoo from ₹649. Clinic-formulated in Bangalore. Use **COMBO99** at checkout for **₹99 off** when you buy Shampoo + Oil or Shampoo + Serum. COD available on miskahealth.in

**Routine ad**

> Hair fall isn’t solved by cosmetic oil alone. MISKA Rosemary Oil: biotin, caffeine, castor + rosemary at the follicle. Pair with treatment shampoo & serum for severe thinning. Shop the range — made in India.

### Headlines (≤40 chars)

- `₹99 off bundles · Code COMBO99`
- `Clinical hair fall routine`
- `Rosemary oil · ₹399 · 200ml`

### UTMs (track in GA / Meta)

```
?utm_source=facebook&utm_medium=paid&utm_campaign=combo99&utm_content=reels-v1
?utm_source=facebook&utm_medium=paid&utm_campaign=hairfall&utm_content=reels-v1
```

Landing URL: `https://www.miskahealth.in` (homepage or `/checkout` only for remarketing).

### Remarketing funnel

| Audience | Creative | Offer |
|----------|----------|--------|
| Viewed product 3d | Oil lifestyle + reviews | — |
| Added to cart 7d | Carousel + COMBO99 | Code in ad |
| Initiated checkout 14d | Static “Still thinking?” | COMBO99 |
| Purchasers 180d | Serum upsell | No discount first |

### Compliance (India cosmetics ads)

- Avoid guaranteed “regrows hair in X days” unless substantiated.
- Use “helps reduce hair fall”, “supports growth”, “clinic-formulated”.
- Show **MRP vs offer price** if you run price-focused ads.

### What to test first (2 weeks)

1. **COMBO99 video** vs **hair fall routine video** (same budget).
2. **Women 25–44** vs **Men 25–44** (oil-focused cut).
3. **COD mentioned** vs **not mentioned** in primary text (India often lifts CTR for COD).
4. Landing: **homepage** vs **direct to bestseller oil** PDP.

### Metrics to watch

| Metric | Good starting benchmark (D2C India) |
|--------|--------------------------------------|
| CTR (link) | &gt; 1.2% |
| CPC (link) | &lt; ₹12–18 |
| CPA (purchase) | &lt; 25–35% of AOV (combo AOV ~₹650–750) |
| ROAS | &gt; 2.5× after learning |

---

## Optional upgrades (higher performance)

1. **Voiceover in Hindi/English** on the MP4s (CapCut → auto captions).
2. **Before/after** or **customer WhatsApp screenshot** (with consent) as social proof slide.
3. **Influencer whitelisting** — boost their Reel from your ad account.
4. **WhatsApp click-to-message** ad for COD questions (secondary campaign).
