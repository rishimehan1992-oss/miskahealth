import Navbar from "@/components/Navbar";
import BrandMark from "@/components/BrandMark";
import ProductCard from "@/components/ProductCard";
import { products } from "@/data/products";
import { labelCaps, pageShell, sectionY } from "@/lib/layout";
import { ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <main className="bg-[#F9F8F5] min-h-screen overflow-x-clip">
      <Navbar />

      <section
        className={`min-h-[88vh] flex flex-col justify-center ${pageShell} pt-28 sm:pt-32 pb-20 sm:pb-28`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-12 sm:mb-14 min-w-0">
          <div className="w-10 h-px bg-[#1C3A2A] shrink-0 hidden sm:block" />
          <span className={`text-[10px] ${labelCaps} text-[#1C3A2A] font-semibold`}>
            Clinical Hair &amp; Skin Science
          </span>
        </div>

        <h1 className="font-serif text-[34px] sm:text-[48px] md:text-[58px] lg:text-[68px] font-light leading-[1.08] text-[#0A0A0A] max-w-3xl break-words">
          Hair science
          <br />
          that actually <em className="italic font-medium text-[#1C3A2A]">works.</em>
        </h1>

        <p className="mt-10 sm:mt-12 text-[16px] md:text-[17px] text-[#666] leading-[1.85] max-w-md font-light">
          Formulated for serious hair concerns — hair fall, thinning and scalp damage.
          Clinical-grade actives. Zero filler. Developed with a Bangalore clinic.
        </p>

        <div className="mt-12 sm:mt-14 flex flex-col sm:flex-row gap-4 sm:gap-5">
          <a
            href="#products"
            className="inline-flex items-center justify-center gap-3 bg-[#1C3A2A] text-white px-10 py-4 text-[11px] tracking-[0.18em] uppercase font-semibold hover:bg-[#152d20] transition-colors"
          >
            Shop the range
            <ArrowRight size={13} />
          </a>
          <a
            href="#science"
            className="inline-flex items-center justify-center gap-3 border border-[#CCC9C2] text-[#444] px-10 py-4 text-[11px] tracking-[0.18em] uppercase font-medium hover:border-[#0A0A0A] transition-colors"
          >
            The science
          </a>
        </div>

        <div className="mt-20 sm:mt-24 pt-12 border-t border-[#E5E2DB] flex flex-wrap gap-x-12 gap-y-4">
          {["Dermatologist tested", "Paraben & SLS free", "Clinically formulated", "Made in India"].map(
            (t) => (
              <span key={t} className={`text-[10px] ${labelCaps} text-[#999]`}>
                {t}
              </span>
            )
          )}
        </div>
      </section>

      <section id="products" className="border-t border-[#E5E2DB] bg-white">
        <div className={`${pageShell} ${sectionY}`}>
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-end mb-16 sm:mb-20 lg:mb-24">
            <div>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-10 h-px bg-[#1C3A2A]" />
                <span className={`text-[10px] ${labelCaps} text-[#1C3A2A] font-semibold`}>
                  The range
                </span>
              </div>
              <h2 className="font-serif text-[32px] sm:text-[38px] md:text-[44px] font-light leading-[1.12] text-[#0A0A0A] break-words">
                Formulated for
                <br />
                <em className="not-italic font-medium">serious concerns.</em>
              </h2>
            </div>
            <p className="text-[14px] text-[#666] leading-[1.9] font-light lg:max-w-sm lg:ml-auto lg:pb-1">
              Each product targets a specific clinical problem. Every ingredient has a documented role.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-y-20 md:gap-x-10 md:gap-y-24 xl:gap-x-8 xl:gap-y-20">
            {products.map((p) => (
              <ProductCard key={p.id} p={p} />
            ))}
          </div>
        </div>
      </section>

      <section id="science" className={`${pageShell} ${sectionY}`}>
        <div className="grid lg:grid-cols-[minmax(0,260px)_1fr] gap-12 lg:gap-24">
          <div>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-10 h-px bg-[#1C3A2A]" />
              <span className={`text-[10px] ${labelCaps} text-[#1C3A2A] font-semibold`}>
                The science
              </span>
            </div>
            <h2 className="font-serif text-[32px] md:text-[40px] font-light leading-[1.12] text-[#0A0A0A]">
              Every ingredient
              <br />
              <em className="italic">earns its place.</em>
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-x-10 sm:gap-x-14 gap-y-10 sm:gap-y-12">
            {[
              { name: "Rosemary", note: "Increases scalp microcirculation" },
              { name: "Biotin", note: "Strengthens the keratin matrix" },
              { name: "Caffeine", note: "Counteracts DHT-driven hair loss" },
              { name: "Moringa", note: "Antioxidant scalp protection" },
            ].map((a) => (
              <div key={a.name} className="border-b border-[#EDEBE5] pb-8">
                <p className="font-serif text-[18px] text-[#0A0A0A] mb-3">{a.name}</p>
                <p className="text-[13px] text-[#888] font-light leading-relaxed">{a.note}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="about" className="bg-[#0A0A0A] text-white py-24 sm:py-32 lg:py-40">
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

      <footer className="border-t border-[#E5E2DB] py-16 sm:py-20">
        <div className={`${pageShell} flex flex-col md:flex-row justify-between gap-6 text-[12px] text-[#999]`}>
          <div>
            <BrandMark variant="footer" href="/" className="mb-3" />
            <p>© 2026 · Bangalore</p>
          </div>
          <p className="md:text-right">Clinical-grade hair &amp; skin formulations</p>
        </div>
      </footer>
    </main>
  );
}
