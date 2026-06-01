# MISKA SEO Data

Files tracked by the **MISKA SEO Agent** (`.cursor/skills/miska-seo-agent/`).

## Commands

```bash
npm run seo:audit    # Technical audit from source + live checks
npm run seo:ranks      # Keyword rank snapshot (needs SERPAPI_KEY)
```

## Setup for rank tracking

1. Create free account at [serpapi.com](https://serpapi.com)
2. Add `SERPAPI_KEY` to GitHub repo secrets (for daily CI) and local `.env.local`
3. Tracks P0/P1 keywords from `keywords.json` only (saves API quota)

## Setup for Search Console

1. [Google Search Console](https://search.google.com/search-console) → add property `https://www.miskahealth.in`
2. Submit sitemap: `https://www.miskahealth.in/sitemap.xml`
3. Share access with team — agent uses manual GSC exports for traffic reports

## Invoke the agent in Cursor

```
@ miska-seo-agent Run full SEO audit and propose this week's content + backlink tasks
```

Or daily loop:
```
/loop 1d @miska-seo-agent daily check: audit, ranks, report to seo/reports/
```

## Reports

Auto-generated in `seo/reports/` by GitHub Actions (daily) and manual runs.
