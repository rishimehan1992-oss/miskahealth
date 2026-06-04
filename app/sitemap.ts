import type { MetadataRoute } from "next";
import { products } from "@/data/products";
import { blogPosts } from "@/data/blog";

const BASE = "https://www.miskahealth.in";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date().toISOString();

  const productUrls = products.map((p) => ({
    url: `${BASE}/products/${p.slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.9,
  }));

  const ingredientUrls = products.map((p) => ({
    url: `${BASE}/products/${p.slug}/ingredients`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  const blogUrls = blogPosts.map((post) => ({
    url: `${BASE}/blog/${post.slug}`,
    lastModified: post.date,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [
    { url: BASE, lastModified: now, changeFrequency: "weekly", priority: 1.0 },
    { url: `${BASE}/products`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE}/ingredients`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/blog`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE}/return-policy`, lastModified: now, changeFrequency: "yearly", priority: 0.4 },
    { url: `${BASE}/privacy`, lastModified: now, changeFrequency: "yearly", priority: 0.4 },
    { url: `${BASE}/terms`, lastModified: now, changeFrequency: "yearly", priority: 0.4 },
    ...productUrls,
    ...ingredientUrls,
    ...blogUrls,
  ];
}
