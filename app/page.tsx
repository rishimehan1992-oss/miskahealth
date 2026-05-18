import Navbar from "@/components/Navbar";
import ProductCard from "@/components/ProductCard";
import { products } from "@/data/products";
import { labelCaps, pageShell } from "@/lib/layout";
import { ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <main className="bg-[#F9F8F5] min-h-screen overflow-x-clip">
      <Navbar />

      {/* Brand hero — no product images here */}
      <section className={`min-h-[85vh] flex flex-col justify-center ${pageShell} pt-24 pb-16`}>
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mb-10 min-w-0">
          <div className="w-10 h-px bg-[#1C3A2A] shrink-0 hidden sm:block" />
          <span className={`text-[10px] ${labelCaps} text-[#1C3A2A] font-semibold`}>
            Clinical Hair &amp; Skin Science
          </span>
        </div>

        <h1
          className="font-serif text-[34px] sm:text-[48px] md:text-[64px] lg:text-[76px] font-light leading-[1.08] text-[#0A0A0A] max-w-4xl break-words"
        >
          Hair science
          <br />
          that actually <em className="italic font-medium text-[#1C3A2A]">works.</em>
        </h1>

        <p className="mt-8 text-[16px] md:text-[17px] text-[#666] leading-[1.8] max-w-lg font-light">
          Formulated for serious hair concerns — hair fall, thinning and scalp damage.
          Clinical-grade actives. Zero filler. Developed with a Bangalore clinic.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row gap-4">
          <a
            href="#products"
            className="inline-flex items-center justify-center gap-3 bg-[#1C3A2A] text-white px-9 py-4 text-[11px] tracking-[0.18em] uppercase font-semibold hover:bg-[#152d20] transition-colors"
          >
            Shop the range
            <ArrowRight size={13} />
          </a>
          <a
            href="#science"
            className="inline-flex items-center justify-center gap-3 border border-[#CCC9C2] text-[#444] px-9 py-4 text-[11px] tracking-[0.18em] uppercase font-medium hover:border-[#0A0A0A] transition-colors"
          >
            The science
          </a>
        </div>

        <div className="mt-16 pt-10 border-t border-[#E5E2DB] flex flex-wrap gap-x-10 gap-y-3">
          {["Dermatologist tested", "Paraben & SLS free", "Clinically formulated", "Made in India"].map(
            (t) => (
              <span key={t} className={`text-[10px] ${labelCaps} text-[#999]`}>
                {t}
              </span>
            )
          )}
        </div>
      </section>

      {/* Products */}
      <section id="products" className="border-t border-[#E5E2DB] bg-white">
        <div className={`${pageShell} py-16 sm:py-20 lg:py-24`}>
          <div className="grid lg:grid-cols-2 gap-6 items-end mb-14">
            <div>
              <div className="flex items-center gap-4 mb-5">
                <div className="w-10 h-px bg-[#1C3A2A]" />
                <span className={`text-[10px] ${labelCaps} text-[#1C3A2A] font-semibold`}>
                  The range
                </span>
              </div>
              <h2 className="font-serif text-[32px] sm:text-[38px] md:text-[48px] font-light leading-[1.1] text-[#0A0A0A] break-words">
                Formulated for
                <br />
                <em className="not-italic font-medium">serious concerns.</em>
              </h2>
            </div>
            <p className="text-[14px] text-[#666] leading-[1.85] font-light lg:max-w-sm lg:ml-auto">
              Each product targets a specific clinical problem. Every ingredient has a documented role.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 sm:gap-10 lg:gap-8">
            {products.map((p) => (
              <ProductCard key={p.id} p={p} />
            ))}
          </div>
        </div>
      </section>

      {/* Science */}
      <section id="science" className={`${pageShell} py-24`}>
        <div className="grid lg:grid-cols-[280px_1fr] gap-16">
          <div>
            <div className="flex items-center gap-4 mb-5">
              <div className="w-10 h-px bg-[#1C3A2A]" />
              <span className={`text-[10px] ${labelCaps} text-[#1C3A2A] font-semibold`}>
                The science
              </span>
            </div>
            <h2 className="font-serif text-[32px] md:text-[40px] font-light leading-[1.1] text-[#0A0A0A]">
              Every ingredient
              <br />
              <em className="italic">earns its place.</em>
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-x-12 gap-y-8">
            {[
              { name: "Rosemary", note: "Increases scalp microcirculation" },
              { name: "Biotin", note: "Strengthens the keratin matrix" },
              { name: "Caffeine", note: "Counteracts DHT-driven hair loss" },
              { name: "Moringa", note: "Antioxidant scalp protection" },
            ].map((a) => (
              <div key={a.name} className="border-b border-[#EDEBE5] pb-6">
                <p className="font-serif text-[18px] text-[#0A0A0A] mb-2">{a.name}</p>
                <p className="text-[13px] text-[#888] font-light leading-relaxed">{a.note}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Clinic */}
      <section id="about" className="bg-[#0A0A0A] text-white py-28">
        <div className={pageShell}>
        <div className="max-w-3xl mx-auto text-center px-2">
          <p className={`text-[10px] ${labelCaps} text-[#555] mb-8`}>Our founding principle</p>
          <blockquote className="font-serif text-[28px] md:text-[40px] font-light leading-[1.2] mb-8">
            Built for people who are done with products that{" "}
            <span className="italic text-[#3D6B52]">promise</span> and don&apos;t{" "}
            <span className="italic text-[#3D6B52]">deliver.</span>
          </blockquote>
          <p className="text-[14px] text-[#666] leading-[1.9] font-light max-w-md mx-auto">
            Miska was developed inside Miska Hair Transplant &amp; Skin Clinic, Bangalore — tested on real
            patients with measurable outcomes.
          </p>
          <a
            href="https://miskaclinics.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 mt-10 border border-[#333] text-[#888] px-8 py-4 text-[11px] tracking-[0.2em] uppercase hover:border-white hover:text-white transition-colors"
          >
            Visit Miska Clinic
            <ArrowRight size={12} />
          </a>
        </div>
        </div>
      </section>

      <footer className="border-t border-[#E5E2DB] py-12">
        <div className={`${pageShell} flex flex-col md:flex-row justify-between gap-4 text-[12px] text-[#999]`}>
          <div>
            <p className={`font-semibold ${labelCaps} text-[#0A0A0A] mb-1`}>Miska</p>
            <p>© 2026 · Bangalore</p>
          </div>
          <p>Clinical-grade hair &amp; skin formulations</p>
        </div>
      </footer>
    </main>
  );
}
