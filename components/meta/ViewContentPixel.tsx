"use client";

import { useEffect } from "react";
import { trackViewContent } from "@/lib/meta/pixel";

export default function ViewContentPixel({
  id,
  name,
  price,
}: {
  id: string;
  name: string;
  price: number;
}) {
  useEffect(() => {
    trackViewContent({ id, name, price });
  }, [id, name, price]);

  return null;
}

