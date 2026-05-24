"use client";

import { usePathname, useRouter } from "next/navigation";
import { useCallback, type ReactNode } from "react";
import { scrollToSection } from "@/lib/scroll-to-section";

type Props = {
  className?: string;
  children?: ReactNode;
  onAfterClick?: () => void;
};

export default function ShopNowButton({
  className = "",
  children = "Shop now",
  onAfterClick,
}: Props) {
  const pathname = usePathname();
  const router = useRouter();

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      e.stopPropagation();
      onAfterClick?.();

      if (pathname === "/") {
        scrollToSection("products");
        return;
      }

      router.push("/#products");
    },
    [pathname, router, onAfterClick]
  );

  return (
    <button type="button" onClick={handleClick} className={className}>
      {children}
    </button>
  );
}
