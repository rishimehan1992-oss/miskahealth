import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import ProductImage from "@/components/ProductImage";
import ProductSubheader from "@/components/ProductSubheader";
import IngredientInfographic from "@/components/IngredientInfographic";
import { getIngredientPageWithProduct } from "@/data/ingredients";
import { products } from "@/data/products";
import { labelCaps, pageShell, sectionYSm } from "@/lib/layout";
import type { Metadata } from "next";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const data = getIngredientPageWithProduct(slug);
  if (!data) return { title: "Not Found" };
  return {
    title: `Ingredients — ${data.product.name} | Miska`,
    description: `Full ingredient breakdown for ${data.product.name}. Clinical actives explained.`,
  };
}

export default async function IngredientsPage({ params }: Props) {
  const { slug } = await params;
  const data = getIngredientPageWithProduct(slug);
  if (!data) notFound();

  const { page, product: p } = data;

  return (
    <main className="bg-[#F9F8F5] min-h-screen overflow-x-clip pb-28 sm:pb-0">
      <ProductSubheader product={p} backHref={`/products/${p.slug}`} backLabel="Product" />

      <div className={`${pageShell} py-12 sm:py-16 lg:py-20`}>
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,280px)_1fr] gap-12 lg:gap-16 xl:gap-20">
          <aside className="lg:sticky lg:top-24 lg:self-start space-y-6">
            <div className="rounded-2xl bg-white p-6 sm:p-8 shadow-[0_8px_40px_rgba(10,10,10,0.06)]">
              <p className={`text-[10px] ${labelCaps} text-[#AAA] mb-2`}>{p.label}</p>
              <p className="font-serif text-[20px] text-[#0A0A0A] leading-tight mb-4">{p.name}</p>
              <div className="relative aspect-square max-w-[220px] mx-auto lg:mx-0">
                <ProductImage
                  src={p.images.main}
                  alt={p.name}
                  priority
                  sizes="220px"
                  className="object-contain p-4"
                />
              </div>
              {p.available && p.price && (
                <p className="mt-5 text-center lg:text-left">
                  <span className="text-[24px] font-semibold">₹{p.price}</span>
                  {p.mrp && (
                    <span className="text-[14px] text-[#CCC] line-through ml-2">₹{p.mrp}</span>
                  )}
                  <span className="block text-[12px] text-[#AAA] mt-1">{p.volume}</span>
                </p>
              )}
            </div>

            <Link
              href={`/products/${p.slug}`}
              className="block text-center text-[10px] tracking-[0.15em] uppercase text-[#666] rounded-2xl bg-white/80 py-4 shadow-[0_4px_24px_rgba(10,10,10,0.04)] hover:shadow-[0_8px_32px_rgba(10,10,10,0.08)] hover:text-[#0A0A0A] transition-colors"
            >
              View product details
            </Link>
          </aside>

          <div>
            <p className={`text-[10px] ${labelCaps} text-[#1C3A2A] font-semibold mb-4`}>Ingredient breakdown</p>
            <h1 className="font-serif text-[32px] sm:text-[40px] md:text-[44px] font-light leading-[1.1] text-[#0A0A0A] mb-5">
              {page.headline}
            </h1>
            <p className="text-[15px] text-[#666] leading-[1.9] font-light max-w-xl mb-10">{page.subhead}</p>

            <div className="flex flex-wrap gap-2.5 mb-12">
              {page.freeFrom.map((tag) => (
                <span
                  key={tag}
                  className="text-[9px] tracking-[0.1em] uppercase text-[#666] bg-white/90 px-3.5 py-2 rounded-full shadow-[0_2px_12px_rgba(10,10,10,0.04)]"
                >
                  {tag}
                </span>
              ))}
            </div>

            <IngredientInfographic
              cards={page.cards}
              heroVisual={page.heroVisual}
              labelImage={page.labelImage}
              productName={p.name}
            />
          </div>
        </div>
      </div>

      <section className={`border-t border-[#E5E2DB] bg-white ${sectionYSm} hidden sm:block`}>
        <div className={`${pageShell} flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6`}>
          <div>
            <p className="font-serif text-[22px] text-[#0A0A0A] mb-1">{p.name}</p>
            <p className="text-[13px] text-[#888] font-light">{p.volume} · {p.concern}</p>
          </div>
          {p.available && p.amazonUrl && (
            <a
              href={p.amazonUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-3 bg-[#1C3A2A] text-white px-10 py-4 text-[11px] tracking-[0.2em] uppercase font-semibold hover:bg-[#152d20] shrink-0"
            >
              Buy now on Amazon
              <ArrowUpRight size={13} />
            </a>
          )}
        </div>
      </section>

      {/* Mobile sticky buy bar */}
      {p.available && p.amazonUrl && (
        <div className="fixed bottom-0 inset-x-0 z-40 sm:hidden bg-white/95 backdrop-blur-md border-t border-[#E5E2DB] p-4">
          <div className={pageShell}>
            <a
              href={p.amazonUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full items-center justify-center gap-2 bg-[#1C3A2A] text-white py-4 text-[11px] tracking-[0.18em] uppercase font-semibold"
            >
              Buy now · ₹{p.price}
              <ArrowUpRight size={13} />
            </a>
          </div>
        </div>
      )}
    </main>
  );
}
