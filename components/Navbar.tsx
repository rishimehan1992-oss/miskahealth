"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import BrandMark from "./BrandMark";
import CartIconLink from "./cart/CartIconLink";
import HashLink from "./HashLink";
import { pageShell } from "@/lib/layout";

const links = [
  { label: "Products", href: "/#products", hash: "products" },
  { label: "Ingredients", href: "/ingredients" },
  { label: "Journal", href: "/blog" },
  { label: "About", href: "/#about", hash: "about" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const closeMenu = () => setOpen(false);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-white/95 backdrop-blur-md border-b border-[#E5E2DB] shadow-sm" : "bg-[#F9F8F5]/90 backdrop-blur-sm"
      }`}
    >
      <div className={`${pageShell} min-h-[4.25rem] sm:min-h-20 py-3 flex items-center justify-between gap-4 min-w-0`}>
        <BrandMark variant="nav" href="/" className="shrink-0 min-w-0" />

        <nav className="hidden md:flex items-center gap-10">
          {links.map((l) =>
            l.hash ? (
              <HashLink
                key={l.href}
                href="/"
                hash={l.hash}
                className="text-[13px] text-[#555] hover:text-[#0A0A0A]"
              >
                {l.label}
              </HashLink>
            ) : (
              <Link key={l.href} href={l.href} className="text-[13px] text-[#555] hover:text-[#0A0A0A]">
                {l.label}
              </Link>
            )
          )}
        </nav>

        <div className="hidden md:flex items-center gap-2 shrink-0">
          <CartIconLink />
          <HashLink
            href="/"
            hash="products"
            className="inline-flex text-[11px] tracking-[0.12em] uppercase font-semibold bg-[#1C3A2A] text-white px-6 py-2.5 hover:bg-[#152d20]"
          >
            Shop now
          </HashLink>
        </div>

        <div className="flex md:hidden items-center gap-1 shrink-0">
          <CartIconLink />
          <button type="button" className="p-2 -mr-1 touch-manipulation" onClick={() => setOpen(!open)} aria-label="Menu">
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {open && (
        <nav className={`md:hidden border-t border-[#E5E2DB] bg-white ${pageShell} py-5 flex flex-col gap-1`}>
          <HashLink
            href="/"
            hash="products"
            onClick={closeMenu}
            className="text-center bg-[#1C3A2A] text-white py-4 text-[11px] uppercase tracking-wider font-semibold mb-3 touch-manipulation"
          >
            Shop now
          </HashLink>
          <Link
            href="/cart"
            onClick={closeMenu}
            className="text-center border border-[#1C3A2A] text-[#1C3A2A] py-3.5 text-[11px] uppercase tracking-wider font-semibold mb-2 touch-manipulation"
          >
            View bag
          </Link>
          {links.map((l) =>
            l.hash ? (
              <HashLink
                key={l.href}
                href="/"
                hash={l.hash}
                onClick={closeMenu}
                className="text-[15px] py-3 touch-manipulation"
              >
                {l.label}
              </HashLink>
            ) : (
              <Link key={l.href} href={l.href} onClick={closeMenu} className="text-[15px] py-3 touch-manipulation">
                {l.label}
              </Link>
            )
          )}
        </nav>
      )}
    </header>
  );
}
