import Link from "next/link";

type Props = {
  /** Navbar / footer — full two-line lockup */
  variant?: "nav" | "compact" | "footer";
  href?: string;
  className?: string;
};

/** MISKA with a small V centered above the S (brand lockup). */
function MiskaWordmark({
  textClassName = "",
  vClassName = "",
}: {
  textClassName?: string;
  vClassName?: string;
}) {
  return (
    <span
      className={`inline-flex items-baseline label-caps text-[#0A0A0A] font-semibold ${textClassName}`}
      aria-label="MISKA"
    >
      <span aria-hidden="true">MI</span>
      <span className="relative inline-block align-baseline">
        <span
          className={`pointer-events-none absolute left-1/2 -translate-x-1/2 font-sans font-semibold leading-none tracking-normal text-[#0A0A0A] ${vClassName}`}
          aria-hidden="true"
        >
          V
        </span>
        <span aria-hidden="true">S</span>
      </span>
      <span aria-hidden="true">KA</span>
    </span>
  );
}

function BrandSubtitle({ className }: { className: string }) {
  return (
    <span
      className={`block text-[#888] font-sans uppercase tracking-[0.1em] sm:tracking-[0.12em] font-normal ${className}`}
    >
      Hair &amp; Skin Science
    </span>
  );
}

export default function BrandMark({ variant = "nav", href = "/", className = "" }: Props) {
  const inner =
    variant === "compact" ? (
      <span className="block text-center leading-[1.25] min-w-0 max-w-[min(100%,11rem)] sm:max-w-none mx-auto">
        <MiskaWordmark
          textClassName="text-[11px] sm:text-[12px] tracking-[0.14em] sm:tracking-[0.16em]"
          vClassName="text-[5px] sm:text-[6px] -top-[0.5em]"
        />
        <BrandSubtitle className="text-[7px] sm:text-[8px] mt-0.5" />
      </span>
    ) : variant === "footer" ? (
      <span className="block leading-tight">
        <MiskaWordmark
          textClassName="text-[11px] tracking-[0.16em] block"
          vClassName="text-[5px] -top-[0.48em]"
        />
        <BrandSubtitle className="text-[9px] mt-1" />
      </span>
    ) : (
      <span className="flex flex-col leading-tight min-w-0">
        <MiskaWordmark
          textClassName="text-[12px] sm:text-[13px] tracking-[0.14em] sm:tracking-[0.18em]"
          vClassName="text-[5px] sm:text-[6px] -top-[0.5em]"
        />
        <BrandSubtitle className="text-[8px] sm:text-[9px] mt-1" />
      </span>
    );

  if (!href) {
    return <span className={className}>{inner}</span>;
  }

  return (
    <Link
      href={href}
      className={`hover:opacity-80 transition-opacity ${className}`}
      aria-label="MISKA Hair and Skin Science — Home"
    >
      {inner}
    </Link>
  );
}
