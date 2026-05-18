"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { labelCaps, pageShell } from "@/lib/layout";

const links = [
  { label: "Products", href: "/#products" },
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
      <div className={`${pageShell} h-16 flex items-center justify-between gap-3 min-w-0`}>
        <Link href="/" className="flex flex-col leading-none min-w-0 pr-2">
          <span className={`text-[11px] sm:text-[12px] font-semibold ${labelCaps}`}>MISKA</span>
          <span className="hidden sm:block text-[9px] tracking-[0.12em] text-[#888] uppercase mt-1">Hair &amp; Skin Science</span>
        </Link>

        <nav className="hidden md:flex items-center gap-9">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="text-[13px] text-[#555] hover:text-[#0A0A0A]">
              {l.label}
            </Link>
          ))}
        </nav>

        <Link
          href="/#products"
          className="hidden md:inline-flex text-[11px] tracking-[0.12em] uppercase font-semibold bg-[#1C3A2A] text-white px-5 py-2.5 hover:bg-[#152d20]"
        >
          Shop now
        </Link>

        <button type="button" className="md:hidden" onClick={() => setOpen(!open)} aria-label="Menu">
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {open && (
        <nav className="md:hidden border-t border-[#E5E2DB] bg-white px-6 sm:px-8 py-5 flex flex-col gap-4">
          {links.map((l) => (
            <Link key={l.href} href={l.href} onClick={() => setOpen(false)} className="text-[14px]">
              {l.label}
            </Link>
          ))}
          <Link href="/#products" onClick={() => setOpen(false)} className="text-center bg-[#1C3A2A] text-white py-3 text-[11px] uppercase tracking-wider font-semibold">
            Shop now
          </Link>
        </nav>
      )}
    </header>
  );
}
