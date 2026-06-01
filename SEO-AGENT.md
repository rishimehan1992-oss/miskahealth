# MISKA SEO Agent

Dedicated organic growth agent — **separate from the main dev agent**.

## What it does

| Capability | How |
|------------|-----|
| Site audit | `npm run seo:audit` — metadata, sitemap, content gaps |
| Keyword plan | `seo/keywords.json` — India hair-care targets |
| Rank tracking | `npm run seo:ranks` — daily via GitHub Actions + SerpAPI |
| Blog writing | Adds posts to `data/blog.ts` from content calendar |
| Backlinks | Outreach log in `seo/backlinks.json` + playbook |
| 24/7 runs | GitHub Actions cron + optional Cursor `/loop` |

## Run in Cursor

Attach the skill explicitly (it does not auto-load):

```
@miska-seo-agent Run full audit and ship the next blog post from content-calendar
```

Daily automation in Cursor:

```
/loop 1d @miska-seo-agent daily: seo:audit, seo:ranks, write report, one backlink outreach
```

## One-time setup

1. **Google Search Console** — verify `miskahealth.in`, submit sitemap
2. **SerpAPI** (optional, for rank tracking) — add `SERPAPI_KEY` to GitHub Secrets + `.env.local`
3. **Enable GitHub Actions** on the repo (workflow: `.github/workflows/seo-agent.yml`)

## Files

- Skill: `.cursor/skills/miska-seo-agent/SKILL.md`
- Data: `seo/` directory
- Reports: `seo/reports/`

## Current baseline findings

See `.cursor/skills/miska-seo-agent/site-baseline.md` for the full audit. Top priorities:

1. Submit sitemap to Search Console
2. Add JSON-LD structured data
3. Publish 3 planned blog posts (content calendar)
4. Start backlink outreach (5/week)
