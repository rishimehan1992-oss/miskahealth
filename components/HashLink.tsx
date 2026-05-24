"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ComponentProps } from "react";

type Props = ComponentProps<typeof Link> & {
  hash: string;
};

/** Same-page hash links scroll reliably (Next.js App Router often ignores them on first click). */
export default function HashLink({ hash, href, onClick, children, ...rest }: Props) {
  const pathname = usePathname();
  const id = hash.replace(/^#/, "");
  const targetHref = href ?? `/${hash}`;

  return (
    <Link
      href={targetHref}
      {...rest}
      onClick={(e) => {
        onClick?.(e);
        if (e.defaultPrevented) return;

        const path = typeof href === "string" ? href.split("#")[0] || "/" : pathname;
        const onTargetPage = path === "/" ? pathname === "/" : pathname === path;

        if (onTargetPage) {
          e.preventDefault();
          const el = document.getElementById(id);
          if (el) {
            el.scrollIntoView({ behavior: "smooth", block: "start" });
            window.history.replaceState(null, "", `${pathname}#${id}`);
          }
        }
      }}
    >
      {children}
    </Link>
  );
}
