import Link from "next/link";
import Navbar from "@/components/Navbar";
import BrandMark from "@/components/BrandMark";
import HomeHashScroll from "@/components/HomeHashScroll";
import HomeCheckoutBar from "@/components/cart/HomeCheckoutBar";
import ProductCard from "@/components/ProductCard";
import ProductImage from "@/components/ProductImage";
import { getIngredientPage } from "@/data/ingredients";
import { products } from "@/data/products";
import { labelCaps, pageShell, sectionY } from "@/lib/layout";
import { ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <main className="bg-[#F9F8F5] min-h-screen overflow-x-clip">
      <HomeHashScroll />
      <HomeCheckoutBar />
      <Navbar />

      <section
        className={`relative z-0 ${pageShell} pt-28 sm:pt-32 pb-10 sm:pb-14`}
      >
        <p className={`text-[11px] sm:text-[12px] ${labelCaps} text-[#1C3A2A] font-semibold mb-8 sm:mb-10`}>
          Clinical Hair &amp; Skin Science
        </p>

        <h1 className="font-serif text-[36px] sm:text-[52px] md:text-[60px] lg:text-[68px] font-light leading-[1.1] text-[#0A0A0A] max-w-3xl">
          Hair science
          <br />
          that actually <em className="italic font-medium text-[#1C3A2A]">works.</em>
        </h1>

        <p className="mt-6 sm:mt-8 text-[15px] md:text-[16px] text-[#666] leading-[1.8] max-w-md font-light">
          Clinical-grade actives for hair fall, thinning &amp; scalp damage. Tap <strong className="text-[#0A0A0A] font-medium">Add to cart</strong> below — checkout in minutes.
        </p>

        <div className="mt-8 flex flex-wrap gap-x-8 gap-y-2 text-[10px] text-[#999] uppercase tracking-wide">
          {["Dermatologist tested", "Paraben & SLS free", "Made in India"].map((t) => (
            <span key={t}>{t}</span>
          ))}
        </div>
      </section>

      <section id="products" className="scroll-mt-24 border-t border-[#E5E2DB] bg-white">
        <div className={`${pageShell} py-12 sm:py-16 lg:py-20`}>
          <div className="mb-10 sm:mb-12">
            <span className={`text-[10px] ${labelCaps} text-[#1C3A2A] font-semibold`}>Shop the range</span>
            <h2 className="font-serif text-[28px] sm:text-[36px] font-light leading-[1.12] text-[#0A0A0A] mt-3">
              Add to cart · pay on checkout
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 items-stretch">
            {products.map((p) => (
              <ProductCard key={p.id} p={p} />
            ))}
          </div>
        </div>
      </section>

      <section id="about" className="scroll-mt-24 bg-[#0A0A0A] text-white py-20 sm:py-28 lg:py-32">
        <div className={pageShell}>
          <div className="max-w-2xl mx-auto text-center">
            <p className={`text-[10px] ${labelCaps} text-[#555] mb-10`}>Our founding principle</p>
            <blockquote className="font-serif text-[26px] sm:text-[32px] md:text-[38px] font-light leading-[1.25] mb-10">
              Built for people who are done with products that{" "}
              <span className="italic text-[#3D6B52]">promise</span> and don&apos;t{" "}
              <span className="italic text-[#3D6B52]">deliver.</span>
            </blockquote>
            <p className="text-[14px] text-[#666] leading-[2] font-light max-w-md mx-auto">
              Miska was developed inside Miska Hair Transplant &amp; Skin Clinic, Bangalore — tested on real
              patients with measurable outcomes.
            </p>
            <a
              href="https://miskaclinics.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-12 border border-[#333] text-[#888] px-10 py-4 text-[11px] tracking-[0.2em] uppercase hover:border-white hover:text-white transition-colors"
            >
              Visit Miska Clinic
              <ArrowRight size={12} />
            </a>
          </div>
        </div>
      </section>

      <section id="science" className={`scroll-mt-24 ${pageShell} py-16 sm:py-20 lg:py-24`}>
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-14 sm:mb-16">
          <div>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-10 h-px bg-[#1C3A2A]" />
              <span className={`text-[10px] ${labelCaps} text-[#1C3A2A] font-semibold`}>
                The science
              </span>
            </div>
            <h2 className="font-serif text-[32px] md:text-[40px] font-light leading-[1.12] text-[#0A0A0A] max-w-lg">
              Ingredients matched
              <br />
              <em className="italic">to each formula.</em>
            </h2>
          </div>
          <Link
            href="/ingredients"
            className="inline-flex items-center gap-2 text-[10px] tracking-[0.15em] uppercase font-semibold text-[#1C3A2A] shrink-0"
          >
            All formulations
            <ArrowRight size={12} />
          </Link>
        </div>
        <ul className="divide-y divide-[#E5E2DB] border-t border-[#E5E2DB]">
          {products
            .filter((p) => getIngredientPage(p.slug))
            .map((p) => {
              const page = getIngredientPage(p.slug)!;
              return (
                <li key={p.slug}>
                  <Link
                    href={`/products/${p.slug}/ingredients`}
                    className="group grid grid-cols-1 sm:grid-cols-[120px_1fr] lg:grid-cols-[140px_1fr_auto] gap-6 sm:gap-10 py-10 sm:py-12 items-center"
                  >
                    <div className="relative aspect-square max-w-[120px] border border-[#E5E2DB] bg-[#FDFCFA]">
                      <ProductImage
                        src={p.images.main}
                        alt={p.name}
                        sizes="120px"
                        className="object-contain p-4"
                      />
                    </div>
                    <div>
                      <p className={`text-[9px] ${labelCaps} text-[#1C3A2A] mb-2`}>{p.label}</p>
                      <h3 className="font-serif text-[20px] sm:text-[22px] text-[#0A0A0A] mb-3 group-hover:text-[#1C3A2A] transition-colors">
                        {p.name}
                      </h3>
                      <ul className="space-y-2">
                        {page.cards.slice(0, 4).map((c) => (
                          <li key={c.name} className="text-[12px] text-[#888] font-light">
                            <span className="font-semibold text-[#0A0A0A]">{c.name}</span>
                            <span className="text-[#CCC]"> · </span>
                            {c.benefit}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <span className="hidden lg:inline-flex items-center gap-2 text-[10px] tracking-[0.14em] uppercase font-semibold text-[#1C3A2A]">
                      Ingredient breakdown
                      <ArrowRight size={11} />
                    </span>
                  </Link>
                </li>
              );
            })}
        </ul>
      </section>

      <footer className="border-t border-[#E5E2DB] py-16 sm:py-20">
        <div className={`${pageShell} flex flex-col md:flex-row justify-between gap-6 text-[12px] text-[#999]`}>
          <div>
            <BrandMark variant="footer" href="/" className="mb-3" />
            <p className="text-[#666] font-medium mb-1">MISKA Hair &amp; Skin Science</p>
            <p className="text-[#AAA]">miskahealth.in · © 2026 · Bangalore</p>
          </div>
          <div className="md:text-right space-y-2">
            <p>Clinical-grade hair &amp; skin formulations</p>
            <p className="flex flex-wrap gap-x-4 gap-y-1">
              <Link href="/privacy" className="hover:text-[#1C3A2A]">
                Privacy
              </Link>
              <Link href="/terms" className="hover:text-[#1C3A2A]">
                Terms
              </Link>
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
