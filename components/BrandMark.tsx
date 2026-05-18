import Link from "next/link";

type Props = {
  /** Navbar / footer — full two-line lockup */
  variant?: "nav" | "compact" | "footer";
  href?: string;
  className?: string;
};

export default function BrandMark({ variant = "nav", href = "/", className = "" }: Props) {
  const inner =
    variant === "compact" ? (
      <span className="block text-center leading-[1.25] min-w-0 max-w-[min(100%,11rem)] sm:max-w-none mx-auto">
        <span className="block font-serif text-[12px] sm:text-[13px] font-medium text-[#0A0A0A] tracking-tight">
          Miska
        </span>
        <span className="block text-[7px] sm:text-[8px] tracking-[0.1em] uppercase text-[#888] font-sans mt-0.5">
          Hair &amp; Skin Science
        </span>
      </span>
    ) : variant === "footer" ? (
      <span className="block leading-tight">
        <span className={`font-semibold label-caps text-[#0A0A0A] block`}>Miska</span>
        <span className="text-[9px] tracking-[0.12em] uppercase text-[#888] font-sans mt-1">
          Hair &amp; Skin Science
        </span>
      </span>
    ) : (
      <span className="flex flex-col leading-tight min-w-0">
        <span className="font-serif text-[15px] sm:text-[17px] font-medium text-[#0A0A0A] tracking-tight">
          Miska
        </span>
        <span className="text-[8px] sm:text-[9px] tracking-[0.12em] uppercase text-[#888] font-sans mt-1">
          Hair &amp; Skin Science
        </span>
      </span>
    );

  if (!href) {
    return <span className={className}>{inner}</span>;
  }

  return (
    <Link href={href} className={`hover:opacity-80 transition-opacity ${className}`}>
      {inner}
    </Link>
  );
}
