import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import BrandMark from "./BrandMark";
import { pageShell } from "@/lib/layout";
import type { Product } from "@/data/products";

type Props = {
  product: Product;
  backHref: string;
  backLabel?: string;
  buyLabel?: string;
};

export default function ProductSubheader({
  product,
  backHref,
  backLabel = "Back",
  buyLabel,
}: Props) {
  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-[#E5E2DB]">
      <div className={`${pageShell} min-h-[3.75rem] sm:min-h-[4.25rem] py-2.5 grid grid-cols-[auto_1fr_auto] items-center gap-2 sm:gap-6 min-w-0`}>
        <Link
          href={backHref}
          className="flex items-center gap-2 text-[10px] sm:text-[11px] tracking-[0.12em] sm:tracking-[0.15em] text-[#666] uppercase hover:text-[#0A0A0A] shrink-0"
        >
          <ArrowLeft size={13} />
          {backLabel}
        </Link>
        <BrandMark variant="compact" href="/" className="justify-self-center px-1" />
        {product.available && product.amazonUrl ? (
          <a
            href={product.amazonUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 text-[9px] sm:text-[10px] tracking-[0.14em] sm:tracking-[0.18em] uppercase font-semibold bg-[#1C3A2A] text-white px-3 sm:px-5 py-2.5 hover:bg-[#152d20] whitespace-nowrap inline-flex items-center gap-1"
          >
            {buyLabel ?? "Buy now"}
            <ArrowUpRight size={11} className="hidden sm:block" />
          </a>
        ) : (
          <span className="text-[11px] text-[#AAA] shrink-0 justify-self-end">Soon</span>
        )}
      </div>
    </header>
  );
}
