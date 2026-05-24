"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { scrollToSection } from "@/lib/scroll-to-section";

/** After navigating to /#products, scroll once the home page has mounted. */
export default function HomeHashScroll() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname !== "/") return;

    const scrollIfNeeded = () => {
      const hash = window.location.hash.replace("#", "");
      if (hash === "products" || hash === "about") {
        scrollToSection(hash, "auto");
      }
    };

    scrollIfNeeded();
    const t = window.setTimeout(scrollIfNeeded, 50);
    window.addEventListener("hashchange", scrollIfNeeded);
    return () => {
      window.clearTimeout(t);
      window.removeEventListener("hashchange", scrollIfNeeded);
    };
  }, [pathname]);

  return null;
}
