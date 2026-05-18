import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import ProductImage from "@/components/ProductImage";
import { getAllIngredientSlugs, getIngredientPage } from "@/data/ingredients";
import { getProductBySlug } from "@/data/products";
import { labelCaps, pageShell, sectionY } from "@/lib/layout";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ingredients",
  description: "Clinical ingredient breakdowns for every Miska Hair & Skin Science formulation.",
};

export default function IngredientsIndexPage() {
  const slugs = getAllIngredientSlugs();

  return (
    <main className="bg-[#F9F8F5] min-h-screen overflow-x-clip">
      <Navbar />

      <section className={`${pageShell} pt-28 sm:pt-32 pb-16 sm:pb-20`}>
        <p className={`text-[10px] ${labelCaps} text-[#1C3A2A] font-semibold mb-5`}>The science</p>
        <h1 className="font-serif text-[36px] sm:text-[48px] font-light leading-[1.1] text-[#0A0A0A] max-w-2xl mb-6">
          Every active,
          <br />
          <em className="italic font-medium text-[#1C3A2A]">explained.</em>
        </h1>
        <p className="text-[15px] text-[#666] leading-[1.9] font-light max-w-lg">
          Ingredient infographics for each Miska formulation — what it does, why it&apos;s included, and how it supports your concern.
        </p>
      </section>

      <section className="bg-white/50">
        <div className={`${pageShell} ${sectionY}`}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 sm:gap-12">
            {slugs.map((slug) => {
              const p = getProductBySlug(slug);
              const page = getIngredientPage(slug);
              if (!p) return null;
              const thumb = page?.heroVisual ?? p.images.main;
              return (
                <Link
                  key={slug}
                  href={`/products/${slug}/ingredients`}
                  className="group flex flex-col rounded-2xl overflow-hidden bg-white shadow-[0_8px_40px_rgba(10,10,10,0.06)] transition-all duration-500 hover:shadow-[0_20px_56px_rgba(28,58,42,0.12)] hover:-translate-y-1"
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-[#F4F1EB] to-white">
                    <ProductImage
                      src={thumb}
                      alt={p.name}
                      sizes="400px"
                      className="object-cover object-center transition-transform duration-700 group-hover:scale-[1.03]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A]/25 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </div>
                  <div className="p-6 sm:p-8 flex flex-col flex-1">
                    <p className={`text-[9px] ${labelCaps} text-[#1C3A2A] mb-2`}>{p.label}</p>
                    <h2 className="font-serif text-[22px] text-[#0A0A0A] mb-2 group-hover:text-[#1C3A2A] transition-colors">
                      {p.name}
                    </h2>
                    <p className="text-[12px] text-[#888] font-light mb-4">{p.formula.length} key actives</p>
                    <ul className="space-y-2 mb-6 flex-1">
                      {p.formula.slice(0, 3).map((f) => (
                        <li key={f.name} className="text-[11px] text-[#666]">
                          <span className="font-semibold text-[#0A0A0A]">{f.name}</span>
                          <span className="text-[#AAA]"> — {f.action}</span>
                        </li>
                      ))}
                    </ul>
                    <span className="inline-flex items-center gap-2 text-[10px] tracking-[0.15em] uppercase font-semibold text-[#1C3A2A]">
                      View infographic
                      <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform duration-300" />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}
