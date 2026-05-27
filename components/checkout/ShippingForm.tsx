"use client";

import { useState, type ReactNode } from "react";
import { INDIA_STATES } from "@/lib/checkout/india-states";
import { lookupPincode } from "@/lib/checkout/pincode";
import type { ShippingAddress } from "@/lib/checkout/types";
import type { FieldErrors } from "@/lib/checkout/validate";

type Props = {
  value: ShippingAddress;
  errors: FieldErrors;
  onChange: (next: ShippingAddress) => void;
  disabled?: boolean;
};

function Field({
  id,
  label,
  hint,
  error,
  children,
}: {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-[13px] font-medium text-[#0A0A0A] mb-1.5">
        {label}
      </label>
      {children}
      {hint && !error && <p className="text-[11px] text-[#999] mt-1.5">{hint}</p>}
      {error && <p className="text-[12px] text-[#B42318] mt-1.5">{error}</p>}
    </div>
  );
}

export default function ShippingForm({ value, errors, onChange, disabled }: Props) {
  const [showLine2, setShowLine2] = useState(Boolean(value.addressLine2.trim()));
  const [pinLoading, setPinLoading] = useState(false);
  const [pinHint, setPinHint] = useState<string | null>(null);

  const set = (key: keyof ShippingAddress, v: string) => {
    onChange({ ...value, [key]: v });
    if (key === "pincode") setPinHint(null);
  };

  const onPincodeComplete = async (pin: string) => {
    if (pin.length !== 6) return;
    setPinLoading(true);
    setPinHint(null);
    try {
      const result = await lookupPincode(pin);
      if (result.found && result.city && result.state) {
        onChange({
          ...value,
          pincode: pin,
          city: result.city,
          state: result.state,
          country: result.country ?? "India",
        });
        setPinHint(`${result.city}, ${result.state}`);
      } else {
        setPinHint("Enter city and state manually");
      }
    } catch {
      setPinHint("Could not verify PIN — enter city and state");
    } finally {
      setPinLoading(false);
    }
  };

  const inputClass = `shop-input shop-input-checkout w-full ${disabled ? "opacity-60 pointer-events-none" : ""}`;

  return (
    <div className={`space-y-8 ${disabled ? "opacity-90" : ""}`}>
      {/* Contact — phone first (India delivery norm) */}
      <section aria-labelledby="contact-heading">
        <h2 id="contact-heading" className="text-[11px] tracking-[0.14em] uppercase text-[#888] font-semibold mb-4">
          Contact
        </h2>
        <div className="space-y-4">
          <Field id="phone" label="Mobile number" error={errors.phone}>
            <input
              id="phone"
              name="phone"
              type="tel"
              inputMode="numeric"
              autoComplete="tel-national"
              enterKeyHint="next"
              className={inputClass}
              value={value.phone}
              onChange={(e) => set("phone", e.target.value.replace(/\D/g, "").slice(0, 10))}
              placeholder="10-digit mobile"
              disabled={disabled}
            />
          </Field>
          <Field id="fullName" label="Full name" error={errors.fullName}>
            <input
              id="fullName"
              name="name"
              type="text"
              autoComplete="name"
              enterKeyHint="next"
              className={inputClass}
              value={value.fullName}
              onChange={(e) => set("fullName", e.target.value)}
              placeholder="As on ID / doorbell"
              disabled={disabled}
            />
          </Field>
          <Field id="email" label="Email" hint="Order updates & receipt" error={errors.email}>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              enterKeyHint="next"
              className={inputClass}
              value={value.email}
              onChange={(e) => set("email", e.target.value)}
              placeholder="you@email.com"
              disabled={disabled}
            />
          </Field>
        </div>
      </section>

      {/* Address */}
      <section aria-labelledby="address-heading">
        <h2 id="address-heading" className="text-[11px] tracking-[0.14em] uppercase text-[#888] font-semibold mb-4">
          Delivery address
        </h2>
        <div className="space-y-4">
          <Field
            id="pincode"
            label="PIN code"
            hint={pinLoading ? "Looking up your area…" : pinHint ?? "We will fill city & state"}
            error={errors.pincode}
          >
            <input
              id="pincode"
              name="postal-code"
              inputMode="numeric"
              autoComplete="postal-code"
              enterKeyHint="next"
              className={inputClass}
              value={value.pincode}
              onChange={(e) => {
                const pin = e.target.value.replace(/\D/g, "").slice(0, 6);
                set("pincode", pin);
                if (pin.length === 6) void onPincodeComplete(pin);
              }}
              onBlur={() => {
                if (value.pincode.length === 6) void onPincodeComplete(value.pincode);
              }}
              placeholder="6-digit PIN"
              disabled={disabled}
              maxLength={6}
            />
          </Field>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field id="city" label="City" error={errors.city}>
              <input
                id="city"
                name="city"
                type="text"
                autoComplete="address-level2"
                enterKeyHint="next"
                className={inputClass}
                value={value.city}
                onChange={(e) => set("city", e.target.value)}
                placeholder="City / district"
                disabled={disabled}
              />
            </Field>
            <Field id="state" label="State" error={errors.state}>
              <select
                id="state"
                name="state"
                autoComplete="address-level1"
                className={`shop-select shop-input-checkout w-full ${disabled ? "opacity-60" : ""}`}
                value={value.state}
                onChange={(e) => set("state", e.target.value)}
                disabled={disabled}
              >
                <option value="">Select state</option>
                {INDIA_STATES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          <Field id="addressLine1" label="House no., building, street" error={errors.addressLine1}>
            <input
              id="addressLine1"
              name="address-line1"
              type="text"
              autoComplete="street-address"
              enterKeyHint="next"
              className={inputClass}
              value={value.addressLine1}
              onChange={(e) => set("addressLine1", e.target.value)}
              placeholder="Flat 402, Green Park, MG Road"
              disabled={disabled}
            />
          </Field>

          {!showLine2 ? (
            <button
              type="button"
              onClick={() => setShowLine2(true)}
              className="text-[12px] text-[#1C3A2A] font-medium hover:underline"
              disabled={disabled}
            >
              + Add landmark / apartment (optional)
            </button>
          ) : (
            <Field id="addressLine2" label="Landmark / apartment (optional)" error={errors.addressLine2}>
              <input
                id="addressLine2"
                name="address-line2"
                type="text"
                autoComplete="address-line2"
                enterKeyHint="done"
                className={inputClass}
                value={value.addressLine2}
                onChange={(e) => set("addressLine2", e.target.value)}
                placeholder="Near metro, society name, etc."
                disabled={disabled}
              />
            </Field>
          )}

          <input type="hidden" name="country" autoComplete="country" value="India" readOnly />
        </div>
      </section>
    </div>
  );
}
