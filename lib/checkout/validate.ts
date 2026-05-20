import type { ShippingAddress } from "./types";

export type FieldErrors = Partial<Record<keyof ShippingAddress, string>>;

export function validateShipping(a: ShippingAddress): FieldErrors {
  const errors: FieldErrors = {};
  if (!a.fullName.trim()) errors.fullName = "Full name is required";
  if (!a.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(a.email)) {
    errors.email = "Valid email is required";
  }
  if (!/^[6-9]\d{9}$/.test(a.phone.replace(/\s/g, ""))) {
    errors.phone = "Enter a valid 10-digit Indian mobile number";
  }
  if (!a.addressLine1.trim()) errors.addressLine1 = "Address is required";
  if (!a.city.trim()) errors.city = "City is required";
  if (!a.state.trim()) errors.state = "State is required";
  if (!/^\d{6}$/.test(a.pincode.trim())) errors.pincode = "Enter a valid 6-digit PIN code";
  return errors;
}

export function hasErrors(errors: FieldErrors) {
  return Object.keys(errors).length > 0;
}
