import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { labelCaps, pageShell } from "@/lib/layout";
import type { Product } from "@/data/products";

type Props = {
  product: Product;
  backHref: string;
  backLabel?: string;
};

export default function ProductSubheader({ product, backHref, backLabel = "Back" }: Props) {
  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-[#E5E2DB]">
      <div className={`${pageShell} h-16 sm:h-[4.25rem] grid grid-cols-[auto_1fr_auto] items-center gap-3 sm:gap-6 min-w-0`}>
        <Link
          href={backHref}
          className="flex items-center gap-2 text-[10px] sm:text-[11px] tracking-[0.12em] sm:tracking-[0.15em] text-[#666] uppercase hover:text-[#0A0A0A] shrink-0"
        >
          <ArrowLeft size={13} />
          {backLabel}
        </Link>
        <span className={`text-center text-[10px] sm:text-[11px] font-semibold ${labelCaps} truncate px-2`}>
          MISKA
        </span>
        {product.available && product.amazonUrl ? (
          <a
            href={product.amazonUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 text-[9px] sm:text-[10px] tracking-[0.14em] sm:tracking-[0.18em] uppercase font-semibold bg-[#1C3A2A] text-white px-3 sm:px-5 py-2.5 hover:bg-[#152d20] whitespace-nowrap inline-flex items-center gap-1"
          >
            Buy
            <ArrowUpRight size={11} className="hidden sm:block" />
          </a>
        ) : (
          <span className="text-[11px] text-[#AAA] shrink-0 justify-self-end">Soon</span>
        )}
      </div>
    </header>
  );
}
