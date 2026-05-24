import type { ShippingAddress } from "@/lib/checkout/types";

type Props = {
  shipping: ShippingAddress;
  onEdit: () => void;
};

export default function DeliveryRecap({ shipping, onEdit }: Props) {
  return (
    <div className="mb-6 p-4 border border-[#E5E2DB] bg-white/60">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 text-[13px] text-[#666] leading-relaxed">
          <p className="font-medium text-[#0A0A0A]">{shipping.fullName}</p>
          <p className="truncate">{shipping.phone} · {shipping.email}</p>
          <p>
            {shipping.addressLine1}
            {shipping.addressLine2 ? `, ${shipping.addressLine2}` : ""}, {shipping.city},{" "}
            {shipping.state} {shipping.pincode}
          </p>
        </div>
        <button
          type="button"
          onClick={onEdit}
          className="shrink-0 text-[10px] tracking-[0.12em] uppercase font-semibold text-[#1C3A2A] hover:underline"
        >
          Edit
        </button>
      </div>
    </div>
  );
}
