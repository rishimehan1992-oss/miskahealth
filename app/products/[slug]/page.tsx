import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { products, getProductBySlug } from "@/data/products";
import ImageCarousel from "@/components/ImageCarousel";
import ProductCard from "@/components/ProductCard";
import ProductLifestyle from "@/components/ProductLifestyle";
import { labelCaps, pageShell } from "@/lib/layout";
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
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-[#E5E2DB]">
        <div className={`${pageShell} h-14 grid grid-cols-[auto_1fr_auto] items-center gap-2 sm:gap-4 min-w-0`}>
          <Link href="/" className="flex items-center gap-2 text-[10px] sm:text-[11px] tracking-[0.12em] sm:tracking-[0.15em] text-[#666] uppercase hover:text-[#0A0A0A] shrink-0">
            <ArrowLeft size={13} />
            Back
          </Link>
          <span className={`text-center text-[10px] sm:text-[11px] font-semibold ${labelCaps} truncate px-1`}>MISKA</span>
          {p.available && p.amazonUrl ? (
            <a
              href={p.amazonUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 text-[9px] sm:text-[10px] tracking-[0.14em] sm:tracking-[0.18em] uppercase font-semibold bg-[#1C3A2A] text-white px-3 sm:px-4 py-2 hover:bg-[#152d20] whitespace-nowrap"
            >
              Buy ₹{p.price}
            </a>
          ) : (
            <span className="text-[11px] text-[#AAA] shrink-0 justify-self-end">Soon</span>
          )}
        </div>
      </header>

      <div className={`${pageShell} py-10 sm:py-14 lg:py-20`}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 sm:gap-14 lg:gap-16 xl:gap-20">
          <div className="lg:sticky lg:top-20 lg:self-start">
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

          <div className="pt-8 sm:pt-10 lg:pt-0 lg:pl-2">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-[9px] tracking-[0.2em] text-[#AAA] uppercase">{p.label}</span>
              <span className="w-1 h-1 rounded-full bg-[#CCC]" />
              <span className={`text-[9px] tracking-[0.15em] uppercase px-2.5 py-1 font-semibold ${p.available ? "bg-[#1C3A2A] text-white" : "bg-[#E5E2DB] text-[#777]"}`}>
                {p.tag}
              </span>
            </div>

            <h1 className="font-serif text-[30px] sm:text-[36px] md:text-[44px] font-light leading-[1.1] text-[#0A0A0A] break-words">{p.name}</h1>
            <p className={`mt-2 text-[11px] ${labelCaps} text-[#1C3A2A]`}>{p.tagline}</p>

            {p.available ? (
              <div className="mt-6 flex items-baseline gap-3 pb-8 border-b border-[#E5E2DB]">
                <span className="text-[32px] font-semibold">₹{p.price}</span>
                <span className="text-[16px] text-[#CCC] line-through">₹{p.mrp}</span>
                {p.mrp && p.price && (
                  <span className="text-[11px] bg-[#F0EDE7] text-[#1C3A2A] font-semibold px-2.5 py-1">
                    Save {Math.round(((p.mrp - p.price) / p.mrp) * 100)}%
                  </span>
                )}
                <span className="text-[12px] text-[#AAA] ml-1">{p.volume}</span>
              </div>
            ) : (
              <p className="mt-6 pb-8 border-b border-[#E5E2DB] text-[#AAA]">Launching soon · {p.volume}</p>
            )}

            <p className="mt-8 text-[15px] text-[#555] leading-[1.9] font-light">{p.description}</p>

            <div className="mt-8 flex gap-4">
              {p.available && p.amazonUrl ? (
                <a
                  href={p.amazonUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 inline-flex items-center justify-center gap-3 bg-[#1C3A2A] text-white py-4 text-[11px] tracking-[0.2em] uppercase font-semibold hover:bg-[#152d20]"
                >
                  Buy on Amazon
                  <ArrowUpRight size={13} />
                </a>
              ) : (
                <button type="button" className="flex-1 border border-[#1C3A2A] text-[#1C3A2A] py-4 text-[11px] tracking-[0.2em] uppercase font-semibold">
                  Notify me
                </button>
              )}
            </div>

            <div className="mt-14 pt-10 border-t border-[#EDE9E1]">
              <h2 className="text-[11px] tracking-[0.25em] text-[#0A0A0A] uppercase font-semibold mb-8">The formula</h2>
              <div className="space-y-6">
                {p.formula.map((f) => (
                  <div key={f.name} className="flex justify-between gap-4 pb-5 border-b border-[#F0EDE7] last:border-0">
                    <span className="text-[14px] font-semibold text-[#0A0A0A]">{f.name}</span>
                    <span className="text-[13px] text-[#888] text-right font-light">{f.action}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 flex flex-wrap gap-2">
              {["Paraben free", "SLS free", "Dermatologist tested"].map((t) => (
                <span key={t} className="text-[9px] tracking-[0.12em] uppercase text-[#888] border border-[#E5E2DB] px-3 py-1.5 bg-white">
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <section className="border-t border-[#E5E2DB] bg-white py-14 sm:py-20">
        <div className={pageShell}>
          <h2 className="text-[11px] tracking-[0.25em] uppercase font-semibold mb-10 text-[#0A0A0A]">
            Also in the range
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 sm:gap-10">
            {others.map((op) => (
              <ProductCard key={op.id} p={op} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
