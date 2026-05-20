import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import BrandMark from "@/components/BrandMark";
import CartIconLink from "@/components/cart/CartIconLink";
import { pageShell } from "@/lib/layout";

type Props = {
  backHref?: string;
  backLabel?: string;
  title?: string;
};

export default function ShopHeader({ backHref = "/", backLabel = "Continue shopping", title }: Props) {
  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-[#E5E2DB]">
      <div className={`${pageShell} min-h-[4rem] sm:min-h-[4.25rem] py-3 grid grid-cols-[auto_1fr_auto] items-center gap-4`}>
        <Link
          href={backHref}
          className="flex items-center gap-2 text-[10px] sm:text-[11px] tracking-[0.12em] text-[#666] uppercase hover:text-[#0A0A0A] shrink-0"
        >
          <ArrowLeft size={13} />
          <span className="hidden sm:inline">{backLabel}</span>
          <span className="sm:hidden">Back</span>
        </Link>
        <div className="justify-self-center text-center min-w-0">
          {title ? (
            <p className="text-[10px] tracking-[0.18em] uppercase font-semibold text-[#0A0A0A] truncate">{title}</p>
          ) : (
            <BrandMark variant="compact" href="/" />
          )}
        </div>
        <CartIconLink className="justify-self-end" />
      </div>
    </header>
  );
}
