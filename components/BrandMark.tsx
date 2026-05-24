import Link from "next/link";

type Props = {
  variant?: "nav" | "compact" | "footer";
  href?: string;
  className?: string;
};

/** MISKA with small V above the S — single line, no awkward wraps */
function MiskaWordmark({
  size = "nav",
}: {
  size?: "nav" | "compact" | "footer";
}) {
  const main =
    size === "footer"
      ? "text-[12px] tracking-[0.16em]"
      : size === "compact"
        ? "text-[11px] sm:text-[12px] tracking-[0.15em] sm:tracking-[0.16em]"
        : "text-[13px] sm:text-[14px] tracking-[0.16em] sm:tracking-[0.18em]";

  const vSize =
    size === "footer" ? "text-[6px] -top-[0.55em]" : "text-[6px] sm:text-[7px] -top-[0.55em]";

  return (
    <span
      className={`inline-flex items-baseline whitespace-nowrap font-sans font-semibold uppercase text-[#0A0A0A] ${main}`}
      aria-label="MISKA Hair and Skin Science"
    >
      <span>MI</span>
      <span className="relative inline-block">
        <span
          className={`pointer-events-none absolute left-1/2 -translate-x-1/2 font-semibold leading-none text-[#0A0A0A] ${vSize}`}
          aria-hidden
        >
          V
        </span>
        <span>S</span>
      </span>
      <span>KA</span>
    </span>
  );
}

function BrandSubtitle({ size = "nav" }: { size?: "nav" | "compact" | "footer" }) {
  const cls =
    size === "footer"
      ? "text-[9px] mt-1 tracking-[0.1em]"
      : size === "compact"
        ? "text-[7px] sm:text-[8px] mt-0.5 tracking-[0.08em] sm:tracking-[0.1em]"
        : "text-[9px] sm:text-[10px] mt-1 tracking-[0.1em]";

  return (
    <span className={`block text-[#888] font-sans uppercase font-normal whitespace-nowrap ${cls}`}>
      Hair &amp; Skin Science
    </span>
  );
}

export default function BrandMark({ variant = "nav", href = "/", className = "" }: Props) {
  const inner =
    variant === "compact" ? (
      <span className="block text-center leading-tight">
        <MiskaWordmark size="compact" />
        <BrandSubtitle size="compact" />
      </span>
    ) : variant === "footer" ? (
      <span className="block leading-tight">
        <MiskaWordmark size="footer" />
        <BrandSubtitle size="footer" />
      </span>
    ) : (
      <span className="block leading-tight">
        <MiskaWordmark size="nav" />
        <BrandSubtitle size="nav" />
      </span>
    );

  if (!href) {
    return <span className={className}>{inner}</span>;
  }

  return (
    <Link
      href={href}
      className={`hover:opacity-80 transition-opacity ${className}`}
      aria-label="MISKA Hair & Skin Science — Home"
    >
      {inner}
    </Link>
  );
}
