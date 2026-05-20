"use client";

import { INDIA_STATES } from "@/lib/checkout/india-states";
import type { ShippingAddress } from "@/lib/checkout/types";
import type { FieldErrors } from "@/lib/checkout/validate";

const labelClass = "block text-[10px] tracking-[0.14em] uppercase text-[#888] font-semibold mb-2";
const errorClass = "text-[11px] text-[#B42318] mt-1.5";

type Props = {
  value: ShippingAddress;
  errors: FieldErrors;
  onChange: (next: ShippingAddress) => void;
};

function Field({
  id,
  label,
  error,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className={labelClass}>
        {label}
      </label>
      {children}
      {error && <p className={errorClass}>{error}</p>}
    </div>
  );
}

export default function ShippingForm({ value, errors, onChange }: Props) {
  const set = (key: keyof ShippingAddress, v: string) => onChange({ ...value, [key]: v });

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-8">
      <div className="sm:col-span-2">
        <Field id="fullName" label="Full name" error={errors.fullName}>
          <input
            id="fullName"
            className="shop-input"
            value={value.fullName}
            onChange={(e) => set("fullName", e.target.value)}
            autoComplete="name"
          />
        </Field>
      </div>
      <Field id="email" label="Email" error={errors.email}>
        <input
          id="email"
          type="email"
          className="shop-input"
          value={value.email}
          onChange={(e) => set("email", e.target.value)}
          autoComplete="email"
        />
      </Field>
      <Field id="phone" label="Mobile" error={errors.phone}>
        <input
          id="phone"
          type="tel"
          className="shop-input"
          value={value.phone}
          onChange={(e) => set("phone", e.target.value.replace(/\D/g, "").slice(0, 10))}
          autoComplete="tel"
          placeholder="10-digit number"
        />
      </Field>
      <div className="sm:col-span-2">
        <Field id="addressLine1" label="Address line 1" error={errors.addressLine1}>
          <input
            id="addressLine1"
            className="shop-input"
            value={value.addressLine1}
            onChange={(e) => set("addressLine1", e.target.value)}
            autoComplete="address-line1"
          />
        </Field>
      </div>
      <div className="sm:col-span-2">
        <Field id="addressLine2" label="Address line 2 (optional)" error={errors.addressLine2}>
          <input
            id="addressLine2"
            className="shop-input"
            value={value.addressLine2}
            onChange={(e) => set("addressLine2", e.target.value)}
            autoComplete="address-line2"
          />
        </Field>
      </div>
      <Field id="city" label="City" error={errors.city}>
        <input
          id="city"
          className="shop-input"
          value={value.city}
          onChange={(e) => set("city", e.target.value)}
          autoComplete="address-level2"
        />
      </Field>
      <Field id="state" label="State" error={errors.state}>
        <select
          id="state"
          className="shop-select"
          value={value.state}
          onChange={(e) => set("state", e.target.value)}
        >
          <option value="">Select state</option>
          {INDIA_STATES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </Field>
      <Field id="pincode" label="PIN code" error={errors.pincode}>
        <input
          id="pincode"
          className="shop-input"
          value={value.pincode}
          onChange={(e) => set("pincode", e.target.value.replace(/\D/g, "").slice(0, 6))}
          autoComplete="postal-code"
        />
      </Field>
      <Field id="country" label="Country" error={errors.country}>
        <input id="country" className="shop-input text-[#666]" value={value.country} readOnly />
      </Field>
    </div>
  );
}
