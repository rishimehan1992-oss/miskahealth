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
  onUsingSavedChange?: (usingSaved: boolean) => void;
};

export default function SavedAddressPicker({
  onSelect,
  selectedId,
  onSelectedIdChange,
  onUsingSavedChange,
}: Props) {
  const [addresses, setAddresses] = useState<SavedAddress[]>([]);
  const [loading, setLoading] = useState(true);
  const initialPickDone = useRef(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/addresses");
        const data = await res.json();
        if (!cancelled) setAddresses(data.addresses ?? []);
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
    onUsingSavedChange?.(true);
  }, [loading, addresses, onSelect, onSelectedIdChange, onUsingSavedChange]);

  useEffect(() => {
    onUsingSavedChange?.(selectedId !== null);
  }, [selectedId, onUsingSavedChange]);

  if (loading) {
    return (
      <div className="mb-6 rounded-lg border border-[#E5E2DB] bg-white px-4 py-3">
        <p className="text-[13px] text-[#999]">Loading your addresses…</p>
      </div>
    );
  }

  if (addresses.length === 0) return null;

  const pick = (addr: SavedAddress) => {
    onSelectedIdChange(addr.id);
    onSelect(toShipping(addr));
    onUsingSavedChange?.(true);
  };

  const useNew = () => {
    onSelectedIdChange(null);
    onUsingSavedChange?.(false);
  };

  return (
    <div className="mb-6">
      <p className="text-[11px] tracking-[0.14em] uppercase text-[#888] font-semibold mb-3">
        Deliver to
      </p>
      <div className="space-y-2">
        {addresses.map((addr) => {
          const active = selectedId === addr.id;
          return (
            <button
              key={addr.id}
              type="button"
              onClick={() => pick(addr)}
              className={`w-full text-left px-4 py-3.5 rounded-lg border-2 transition-colors touch-manipulation ${
                active
                  ? "border-[#1C3A2A] bg-[#1C3A2A]/[0.04]"
                  : "border-[#E5E2DB] bg-white hover:border-[#CCC9C2]"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-[14px] font-semibold text-[#0A0A0A]">{addr.fullName}</p>
                  <p className="text-[13px] text-[#666] mt-0.5">
                    {addr.addressLine1}
                    {addr.addressLine2 ? `, ${addr.addressLine2}` : ""}
                  </p>
                  <p className="text-[13px] text-[#666]">
                    {addr.city}, {addr.state} — {addr.pincode}
                  </p>
                  <p className="text-[12px] text-[#999] mt-1">{addr.phone}</p>
                </div>
                <span
                  className={`shrink-0 mt-0.5 h-5 w-5 rounded-full border-2 flex items-center justify-center ${
                    active ? "border-[#1C3A2A]" : "border-[#D4D0C8]"
                  }`}
                  aria-hidden
                >
                  {active && <span className="h-2.5 w-2.5 rounded-full bg-[#1C3A2A]" />}
                </span>
              </div>
            </button>
          );
        })}

        <button
          type="button"
          onClick={useNew}
          className={`w-full text-left px-4 py-3.5 rounded-lg border-2 transition-colors touch-manipulation ${
            selectedId === null
              ? "border-[#1C3A2A] bg-[#1C3A2A]/[0.04]"
              : "border-dashed border-[#CCC9C2] bg-transparent hover:border-[#999]"
          }`}
        >
          <span className="text-[14px] font-medium text-[#0A0A0A]">+ Use a different address</span>
        </button>
      </div>
    </div>
  );
}
