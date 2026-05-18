"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import BrandMark from "./BrandMark";
import { pageShell } from "@/lib/layout";

const links = [
  { label: "Products", href: "/#products" },
  { label: "Ingredients", href: "/ingredients" },
  { label: "Science", href: "/#science" },
  { label: "About", href: "/#about" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-white/95 backdrop-blur-md border-b border-[#E5E2DB] shadow-sm" : "bg-[#F9F8F5]/90 backdrop-blur-sm"
      }`}
    >
      <div className={`${pageShell} min-h-[4.25rem] sm:min-h-20 py-3 flex items-center justify-between gap-4 min-w-0`}>
        <BrandMark variant="nav" href="/" className="shrink-0 pr-2 max-w-[55%] sm:max-w-none" />

        <nav className="hidden md:flex items-center gap-10">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="text-[13px] text-[#555] hover:text-[#0A0A0A]">
              {l.label}
            </Link>
          ))}
        </nav>

        <Link
          href="/#products"
          className="hidden md:inline-flex text-[11px] tracking-[0.12em] uppercase font-semibold bg-[#1C3A2A] text-white px-6 py-2.5 hover:bg-[#152d20] shrink-0"
        >
          Shop now
        </Link>

        <button type="button" className="md:hidden p-1 -mr-1 shrink-0" onClick={() => setOpen(!open)} aria-label="Menu">
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {open && (
        <nav className={`md:hidden border-t border-[#E5E2DB] bg-white ${pageShell} py-6 flex flex-col gap-5`}>
          {links.map((l) => (
            <Link key={l.href} href={l.href} onClick={() => setOpen(false)} className="text-[15px] py-1">
              {l.label}
            </Link>
          ))}
          <Link
            href="/#products"
            onClick={() => setOpen(false)}
            className="text-center bg-[#1C3A2A] text-white py-3.5 mt-2 text-[11px] uppercase tracking-wider font-semibold"
          >
            Shop now
          </Link>
        </nav>
      )}
    </header>
  );
}
