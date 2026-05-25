import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import ProductImage from "@/components/ProductImage";
import { blogPosts } from "@/data/blog";
import { labelCaps, pageShell, sectionY } from "@/lib/layout";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Journal",
  description: "Hair science notes from MISKA — rosemary, treatment shampoo, and clinical serums.",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function BlogIndexPage() {
  return (
    <main className="bg-[#F9F8F5] min-h-screen overflow-x-clip">
      <Navbar />

      <section className={`${pageShell} page-top-pad pb-16 sm:pb-20`}>
        <p className={`text-[10px] ${labelCaps} text-[#1C3A2A] font-semibold mb-5`}>Journal</p>
        <h1 className="font-serif text-[36px] sm:text-[48px] font-light leading-[1.1] text-[#0A0A0A] max-w-2xl mb-6">
          Hair science,
          <br />
          <em className="italic font-medium text-[#1C3A2A]">in plain language.</em>
        </h1>
        <p className="text-[15px] text-[#666] leading-[1.9] font-light max-w-lg">
          Practical notes on rosemary scalp care, treatment shampoo, and peptide serums — tied to MISKA
          formulations.
        </p>
      </section>

      <section className="shop-divider">
        <div className={`${pageShell} ${sectionY} pt-0`}>
          <ul className="divide-y divide-[#E5E2DB]">
            {blogPosts.map((post, i) => (
              <li key={post.slug}>
                <Link
                  href={`/blog/${post.slug}`}
                  className={`group grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 py-12 sm:py-16 items-center ${
                    i === 0 ? "pt-0" : ""
                  }`}
                >
                  <div className="relative aspect-[16/10] overflow-hidden border border-[#E5E2DB] bg-[#FDFCFA] order-2 lg:order-1">
                    <ProductImage
                      src={post.image}
                      alt=""
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      className="object-cover object-center transition-transform duration-700 group-hover:scale-[1.02]"
                    />
                  </div>
                  <div className="order-1 lg:order-2">
                    <p className={`text-[9px] ${labelCaps} text-[#1C3A2A] mb-3`}>{post.category}</p>
                    <h2 className="font-serif text-[26px] sm:text-[32px] font-light text-[#0A0A0A] leading-[1.15] mb-4 group-hover:text-[#1C3A2A] transition-colors">
                      {post.title}
                    </h2>
                    <p className="text-[14px] text-[#666] leading-[1.9] font-light mb-6 max-w-md">{post.excerpt}</p>
                    <p className="text-[11px] text-[#AAA] mb-6">
                      {formatDate(post.date)} · {post.readTime} read
                    </p>
                    <span className="inline-flex items-center gap-2 text-[10px] tracking-[0.15em] uppercase font-semibold text-[#1C3A2A]">
                      Read article
                      <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
}
