import { notFound } from "next/navigation";
import Link from "next/link";
import { products, getProductBySlug } from "@/data/products";
import ImageCarousel from "@/components/ImageCarousel";
import ProductCard from "@/components/ProductCard";
import ProductLifestyle from "@/components/ProductLifestyle";
import ProductSubheader from "@/components/ProductSubheader";
import AddToCartButton from "@/components/cart/AddToCartButton";
import ProductBuyBar from "@/components/cart/ProductBuyBar";
import ViewContentPixel from "@/components/meta/ViewContentPixel";
import { labelCaps, pageShell, sectionYSm } from "@/lib/layout";
import type { Metadata } from "next";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const p = getProductBySlug(slug);
  if (!p) return { title: "Not Found" };
  return { title: p.seo.title, description: p.seo.description };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const p = getProductBySlug(slug);
  if (!p) notFound();

  const others = products.filter((x) => x.slug !== slug);

  return (
    <main className="bg-[#F9F8F5] min-h-screen overflow-x-clip">
      <ProductSubheader product={p} backHref="/" backLabel="Back" />
      <ViewContentPixel id={p.slug} name={p.name} price={p.price ?? 0} />

      <div className={`${pageShell} py-12 sm:py-20 lg:py-28`}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 sm:gap-16 lg:gap-20 xl:gap-24">
          <div className="lg:sticky lg:top-24 lg:self-start px-0 sm:px-2">
            {p.images.main ? (
              <>
                <ImageCarousel images={p.images.gallery} alt={p.name} priority />
                <ProductLifestyle images={p.images.lifestyle} alt={p.name} />
              </>
            ) : (
              <div className="aspect-square flex items-center justify-center text-[#AAA] text-sm uppercase tracking-wider">
                Coming soon
              </div>
            )}
          </div>

          <div className="pt-4 sm:pt-8 lg:pt-2 lg:pl-4 xl:pl-8">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-[9px] tracking-[0.2em] text-[#AAA] uppercase">{p.label}</span>
              <span className="w-1 h-1 rounded-full bg-[#CCC]" />
              <span
                className={`text-[9px] tracking-[0.15em] uppercase px-3 py-1 font-semibold ${
                  p.available ? "bg-[#1C3A2A] text-white" : "bg-[#E5E2DB] text-[#777]"
                }`}
              >
                {p.tag}
              </span>
            </div>

            <h1 className="font-serif text-[30px] sm:text-[38px] md:text-[44px] font-light leading-[1.12] text-[#0A0A0A] break-words">
              {p.name}
            </h1>
            <p className={`mt-4 text-[11px] ${labelCaps} text-[#1C3A2A]`}>{p.tagline}</p>

            {p.available ? (
              <div className="mt-8 sm:mt-10 flex flex-wrap items-baseline gap-x-4 gap-y-2 pb-10 border-b border-[#E5E2DB]">
                <span className="text-[32px] font-semibold">₹{p.price}</span>
                <span className="text-[16px] text-[#CCC] line-through">₹{p.mrp}</span>
                {p.mrp && p.price && (
                  <span className="text-[11px] bg-[#F0EDE7] text-[#1C3A2A] font-semibold px-3 py-1">
                    Save {Math.round(((p.mrp - p.price) / p.mrp) * 100)}%
                  </span>
                )}
                <span className="w-full sm:w-auto text-[12px] text-[#AAA]">{p.volume}</span>
              </div>
            ) : (
              <p className="mt-8 pb-10 border-b border-[#E5E2DB] text-[#AAA]">Launching soon · {p.volume}</p>
            )}

            <p className="mt-10 text-[15px] text-[#555] leading-[2] font-light max-w-lg">{p.description}</p>

            <div className="mt-10 sm:mt-12 flex flex-col sm:flex-row flex-wrap gap-4 items-start">
              {p.available ? (
                <>
                  <AddToCartButton
                    product={p}
                    className="w-full sm:w-auto px-10 py-4 text-[11px] tracking-[0.2em] uppercase"
                  />
                  <Link
                    href="/cart"
                    className="w-full sm:w-auto inline-flex items-center justify-center border border-[#CCC9C2] text-[#444] px-10 py-4 text-[11px] tracking-[0.15em] uppercase font-medium hover:border-[#0A0A0A]"
                  >
                    View bag
                  </Link>
                </>
              ) : (
                <button
                  type="button"
                  className="w-full sm:w-auto border border-[#1C3A2A] text-[#1C3A2A] px-10 py-4 text-[11px] tracking-[0.2em] uppercase font-semibold"
                >
                  Notify me
                </button>
              )}
            </div>

            <div className="mt-16 sm:mt-20 pt-12 border-t border-[#EDE9E1]">
              <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
                <h2 className="text-[11px] tracking-[0.22em] text-[#0A0A0A] uppercase font-semibold">
                  The formula
                </h2>
                <Link
                  href={`/products/${p.slug}/ingredients`}
                  className="text-[10px] tracking-[0.15em] uppercase font-semibold text-[#1C3A2A] hover:underline underline-offset-4 shrink-0"
                >
                  Full ingredient infographic →
                </Link>
              </div>
              <div className="space-y-8">
                {p.formula.map((f) => (
                  <div
                    key={f.name}
                    className="flex justify-between gap-6 pb-8 border-b border-[#F0EDE7] last:border-0 last:pb-0"
                  >
                    <span className="text-[14px] font-semibold text-[#0A0A0A]">{f.name}</span>
                    <span className="text-[13px] text-[#888] text-right font-light max-w-[55%] leading-relaxed">
                      {f.action}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-12 flex flex-wrap gap-3">
              {["Paraben free", "SLS free", "Dermatologist tested"].map((t) => (
                <span
                  key={t}
                  className="text-[9px] tracking-[0.12em] uppercase text-[#888] border border-[#E5E2DB] px-4 py-2 bg-white"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <ProductBuyBar product={p} variant="inline" />
      <ProductBuyBar product={p} variant="sticky" />

      <section className={`border-t border-[#E5E2DB] bg-white ${sectionYSm}`}>
        <div className={pageShell}>
          <h2 className="text-[11px] tracking-[0.22em] uppercase font-semibold mb-12 sm:mb-16 text-[#0A0A0A]">
            Also in the range
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 items-stretch">
            {others.map((op) => (
              <ProductCard key={op.id} p={op} compact />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
