#!/usr/bin/env node
/**
 * MISKA keyword rank tracker via SerpAPI (Google India).
 * Requires SERPAPI_KEY in environment.
 * Usage: node scripts/seo-rank-check.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const DOMAIN = "miskahealth.in";
const API_KEY = process.env.SERPAPI_KEY;

const keywordsPath = path.join(ROOT, "seo/keywords.json");
const historyPath = path.join(ROOT, "seo/rank-history.json");

const keywords = JSON.parse(fs.readFileSync(keywordsPath, "utf8"));
const history = JSON.parse(fs.readFileSync(historyPath, "utf8"));

/** Track P0 + P1 only to conserve API quota */
const toTrack = keywords.keywords.filter((k) =>
  ["P0", "P1"].includes(k.priority) && k.status !== "planned-content"
);

async function fetchRank(keyword) {
  const params = new URLSearchParams({
    engine: "google",
    q: keyword,
    google_domain: "google.co.in",
    gl: "in",
    hl: "en",
    num: "100",
    api_key: API_KEY,
  });
  const res = await fetch(`https://serpapi.com/search.json?${params}`);
  if (!res.ok) throw new Error(`SerpAPI ${res.status}: ${await res.text()}`);
  const data = await res.json();
  const organic = data.organic_results ?? [];
  for (let i = 0; i < organic.length; i++) {
    const link = organic[i].link ?? "";
    if (link.includes(DOMAIN)) {
      return { position: i + 1, url: link };
    }
  }
  return { position: null, url: null };
}

async function main() {
  const date = new Date().toISOString().slice(0, 10);

  if (!API_KEY) {
    const reportDir = path.join(ROOT, "seo/reports");
    fs.mkdirSync(reportDir, { recursive: true });
    const msg = `# Rank check skipped — ${date}

Set \`SERPAPI_KEY\` in environment to enable automated rank tracking.

**Manual check:** Google each keyword in incognito (google.co.in) and log positions in \`seo/rank-history.json\`.

Keywords to track (${toTrack.length}):
${toTrack.map((k) => `- ${k.keyword} → ${k.targetUrl}`).join("\n")}
`;
    fs.writeFileSync(path.join(reportDir, `${date}-ranks.md`), msg);
    console.log("SERPAPI_KEY not set — wrote manual checklist to seo/reports/");
    return;
  }

  const snapshot = {};
  const rows = [];

  for (const kw of toTrack) {
    process.stdout.write(`Checking: ${kw.keyword}... `);
    try {
      const { position, url } = await fetchRank(kw.keyword);
      snapshot[kw.id] = {
        keyword: kw.keyword,
        position,
        url,
        targetUrl: kw.targetUrl,
      };
      rows.push({ ...kw, position, rankingUrl: url });
      console.log(position ? `#${position}` : "not in top 100");
      await new Promise((r) => setTimeout(r, 1500));
    } catch (err) {
      console.log(`error: ${err.message}`);
      snapshot[kw.id] = { keyword: kw.keyword, error: err.message };
    }
  }

  history.snapshots[date] = snapshot;
  history.lastRun = date;
  fs.writeFileSync(historyPath, JSON.stringify(history, null, 2) + "\n");

  const prevDates = Object.keys(history.snapshots).filter((d) => d !== date).sort();
  const prevDate = prevDates[prevDates.length - 1];
  const prev = prevDate ? history.snapshots[prevDate] : {};

  const reportDir = path.join(ROOT, "seo/reports");
  fs.mkdirSync(reportDir, { recursive: true });

  let md = `# MISKA Rank Report — ${date}

| Keyword | Position | Change | Ranking URL |
|---------|----------|--------|-------------|
`;

  for (const row of rows) {
    const prevPos = prev[row.id]?.position ?? null;
    const curr = row.position;
    let change = "—";
    if (prevPos && curr) change = String(prevPos - curr);
    else if (prevPos && !curr) change = "lost";
    else if (!prevPos && curr) change = "new";
    md += `| ${row.keyword} | ${curr ?? ">100"} | ${change} | ${row.rankingUrl ?? "—"} |\n`;
  }

  md += `\n_Compared to ${prevDate ?? "no prior snapshot"}_\n`;
  fs.writeFileSync(path.join(reportDir, `${date}-ranks.md`), md);
  console.log(`Ranks saved: seo/rank-history.json + seo/reports/${date}-ranks.md`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
