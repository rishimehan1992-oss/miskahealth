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
  description: "Per-product ingredient breakdowns for MISKA Hair & Skin Science formulations.",
};

export default function IngredientsIndexPage() {
  const slugs = getAllIngredientSlugs();

  return (
    <main className="bg-[#F9F8F5] min-h-screen overflow-x-clip">
      <Navbar />

      <section className={`${pageShell} pt-28 sm:pt-32 pb-16 sm:pb-20`}>
        <p className={`text-[10px] ${labelCaps} text-[#1C3A2A] font-semibold mb-5`}>The science</p>
        <h1 className="font-serif text-[36px] sm:text-[48px] font-light leading-[1.1] text-[#0A0A0A] max-w-2xl mb-6">
          Ingredients by
          <br />
          <em className="italic font-medium text-[#1C3A2A]">formulation.</em>
        </h1>
        <p className="text-[15px] text-[#666] leading-[1.9] font-light max-w-lg">
          Each product has its own active pathway — not a shared generic list. Select a formulation to see only
          what is inside that bottle.
        </p>
      </section>

      <section className="shop-divider">
        <div className={`${pageShell} ${sectionY}`}>
          <ul className="divide-y divide-[#E5E2DB]">
            {slugs.map((slug) => {
              const p = getProductBySlug(slug);
              const page = getIngredientPage(slug);
              if (!p || !page) return null;
              return (
                <li key={slug}>
                  <Link
                    href={`/products/${slug}/ingredients`}
                    className="group grid grid-cols-1 md:grid-cols-[200px_1fr_auto] gap-8 md:gap-12 py-12 sm:py-14 items-center hover:bg-[#FDFCFA]/50 transition-colors -mx-4 px-4 sm:-mx-6 sm:px-6"
                  >
                    <div className="relative aspect-square max-w-[200px] border border-[#E5E2DB] bg-[#FDFCFA]">
                      <ProductImage
                        src={p.images.main}
                        alt={p.name}
                        sizes="200px"
                        className="object-contain p-6"
                      />
                    </div>
                    <div className="min-w-0">
                      <p className={`text-[9px] ${labelCaps} text-[#1C3A2A] mb-2`}>{p.label}</p>
                      <h2 className="font-serif text-[24px] sm:text-[28px] text-[#0A0A0A] mb-3 group-hover:text-[#1C3A2A] transition-colors">
                        {p.name}
                      </h2>
                      <p className="text-[13px] text-[#888] font-light mb-5 max-w-md">{page.subhead}</p>
                      <ul className="space-y-3">
                        {page.cards.map((card) => (
                          <li key={card.name} className="text-[12px] text-[#666] font-light">
                            <span className="font-semibold text-[#0A0A0A]">{card.name}</span>
                            <span className="text-[#AAA]"> — {card.benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <span className="hidden md:inline-flex items-center gap-2 text-[10px] tracking-[0.15em] uppercase font-semibold text-[#1C3A2A] shrink-0">
                      View breakdown
                      <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </section>
    </main>
  );
}
