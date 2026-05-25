"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import BrandMark from "./BrandMark";
import CartIconLink from "./cart/CartIconLink";
import ShopNowButton from "./ShopNowButton";
import { scrollToSection } from "@/lib/scroll-to-section";
import { usePathname, useRouter } from "next/navigation";
import { pageShell } from "@/lib/layout";

const links = [
  { label: "Ingredients", href: "/ingredients" },
  { label: "Journal", href: "/blog" },
  { label: "About", href: "/#about", isAbout: true },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
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

  const goProducts = () => {
    closeMenu();
    if (pathname === "/") scrollToSection("products");
    else router.push("/#products");
  };

  const goAbout = () => {
    closeMenu();
    if (pathname === "/") scrollToSection("about");
    else router.push("/#about");
  };

  return (
    <header
      className={`fixed top-[var(--announcement-h)] inset-x-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-white/95 backdrop-blur-md border-b border-[#E5E2DB] shadow-sm" : "bg-[#F9F8F5]/90 backdrop-blur-sm"
      }`}
    >
      <div className={`${pageShell} min-h-[4.25rem] sm:min-h-20 py-3 flex items-center justify-between gap-3 min-w-0`}>
        <BrandMark variant="nav" href="/" className="shrink-0 min-w-0" />

        <nav className="hidden md:flex items-center gap-10">
          <button type="button" onClick={goProducts} className="text-[13px] text-[#555] hover:text-[#0A0A0A]">
            Products
          </button>
          {links.map((l) =>
            l.isAbout ? (
              <button
                key={l.href}
                type="button"
                onClick={goAbout}
                className="text-[13px] text-[#555] hover:text-[#0A0A0A]"
              >
                {l.label}
              </button>
            ) : (
              <Link key={l.href} href={l.href} className="text-[13px] text-[#555] hover:text-[#0A0A0A]">
                {l.label}
              </Link>
            )
          )}
        </nav>

        <div className="hidden md:flex items-center gap-2 shrink-0">
          <CartIconLink ariaLabel="View bag" />
          <ShopNowButton className="inline-flex text-[11px] tracking-[0.12em] uppercase font-semibold bg-[#1C3A2A] text-white px-6 py-2.5 hover:bg-[#152d20] touch-manipulation" />
        </div>

        {/* Mobile: bag = review cart · Shop/Checkout = browse or pay */}
        <div className="flex md:hidden items-center gap-1 shrink-0">
          <CartIconLink ariaLabel="View bag" />
          <ShopNowButton
            onAfterClick={closeMenu}
            className="text-[10px] tracking-[0.1em] uppercase font-semibold bg-[#1C3A2A] text-white px-3.5 py-2.5 hover:bg-[#152d20] touch-manipulation"
          />
          <button
            type="button"
            className="p-2 touch-manipulation"
            onClick={() => setOpen(!open)}
            aria-label="Menu"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {open && (
        <nav className={`md:hidden border-t border-[#E5E2DB] bg-white ${pageShell} py-4 flex flex-col gap-1`}>
          <button
            type="button"
            onClick={goProducts}
            className="text-left text-[15px] py-3 touch-manipulation"
          >
            Products
          </button>
          {links.map((l) =>
            l.isAbout ? (
              <button
                key={l.href}
                type="button"
                onClick={goAbout}
                className="text-left text-[15px] py-3 touch-manipulation"
              >
                {l.label}
              </button>
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
