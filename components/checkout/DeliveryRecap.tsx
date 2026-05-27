import type { ShippingAddress } from "@/lib/checkout/types";

type Props = {
  shipping: ShippingAddress;
  onEdit: () => void;
};

export default function DeliveryRecap({ shipping, onEdit }: Props) {
  return (
    <div className="mb-6 rounded-lg border border-[#E5E2DB] bg-white p-4 sm:p-5">
      <div className="flex items-start justify-between gap-4 mb-3">
        <p className="text-[11px] tracking-[0.14em] uppercase text-[#888] font-semibold">
          Delivering to
        </p>
        <button
          type="button"
          onClick={onEdit}
          className="text-[12px] font-semibold text-[#1C3A2A] hover:underline shrink-0"
        >
          Change
        </button>
      </div>
      <p className="text-[15px] font-semibold text-[#0A0A0A]">{shipping.fullName}</p>
      <p className="text-[14px] text-[#666] mt-1 leading-relaxed">
        {shipping.addressLine1}
        {shipping.addressLine2 ? `, ${shipping.addressLine2}` : ""}
        <br />
        {shipping.city}, {shipping.state} {shipping.pincode}
      </p>
      <p className="text-[13px] text-[#999] mt-2">
        {shipping.phone} · {shipping.email}
      </p>
    </div>
  );
}
