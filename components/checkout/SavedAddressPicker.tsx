"use client";

import { useEffect, useRef, useState } from "react";
import type { SavedAddress } from "@/lib/addresses/types";
import type { ShippingAddress } from "@/lib/checkout/types";

function toShipping(addr: SavedAddress): ShippingAddress {
  return {
    fullName: addr.fullName,
    email: addr.email,
    phone: addr.phone,
    addressLine1: addr.addressLine1,
    addressLine2: addr.addressLine2,
    city: addr.city,
    state: addr.state,
    pincode: addr.pincode,
    country: addr.country,
  };
}

type Props = {
  onSelect: (address: ShippingAddress) => void;
  selectedId: string | null;
  onSelectedIdChange: (id: string | null) => void;
};

export default function SavedAddressPicker({ onSelect, selectedId, onSelectedIdChange }: Props) {
  const [addresses, setAddresses] = useState<SavedAddress[]>([]);
  const [loading, setLoading] = useState(true);
  const initialPickDone = useRef(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/addresses");
        const data = await res.json();
        if (!cancelled) {
          setAddresses(data.addresses ?? []);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (loading || addresses.length === 0 || initialPickDone.current) return;
    initialPickDone.current = true;
    const preferred = addresses.find((a) => a.isDefault) ?? addresses[0];
    onSelectedIdChange(preferred.id);
    onSelect(toShipping(preferred));
  }, [loading, addresses, onSelect, onSelectedIdChange]);

  if (loading) {
    return <p className="text-[12px] text-[#999] mb-4">Loading saved addresses…</p>;
  }

  if (addresses.length === 0) return null;

  const pick = (addr: SavedAddress) => {
    onSelectedIdChange(addr.id);
    onSelect(toShipping(addr));
  };

  return (
    <div className="mb-6">
      <p className="text-[10px] tracking-[0.14em] uppercase text-[#888] font-semibold mb-3">Saved addresses</p>
      <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 snap-x snap-mandatory">
        {addresses.map((addr) => {
          const active = selectedId === addr.id;
          return (
            <button
              key={addr.id}
              type="button"
              onClick={() => pick(addr)}
              className={`snap-start shrink-0 max-w-[220px] text-left px-3 py-2.5 border text-[12px] leading-snug transition-colors ${
                active
                  ? "border-[#1C3A2A] bg-[#1C3A2A]/5 text-[#0A0A0A]"
                  : "border-[#E5E2DB] text-[#666] hover:border-[#999]"
              }`}
            >
              <span className="block font-semibold text-[11px] uppercase tracking-wide text-[#1C3A2A] mb-0.5">
                {addr.label}
                {addr.isDefault ? " · Default" : ""}
              </span>
              <span className="block truncate">{addr.fullName}</span>
              <span className="block truncate text-[#999]">
                {addr.city}, {addr.state} {addr.pincode}
              </span>
            </button>
          );
        })}
        <button
          type="button"
          onClick={() => onSelectedIdChange(null)}
          className={`snap-start shrink-0 px-3 py-2.5 border text-[11px] tracking-[0.1em] uppercase font-semibold ${
            selectedId === null
              ? "border-[#1C3A2A] text-[#1C3A2A]"
              : "border-[#E5E2DB] text-[#888] hover:border-[#999]"
          }`}
        >
          New address
        </button>
      </div>
    </div>
  );
}
