import type { ShippingAddress } from "@/lib/checkout/types";

export type SavedAddress = ShippingAddress & {
  id: string;
  label: string;
  isDefault: boolean;
};

export type SavedAddressRow = {
  id: string;
  user_id: string;
  label: string;
  is_default: boolean;
  full_name: string;
  email: string;
  phone: string;
  address_line1: string;
  address_line2: string | null;
  city: string;
  state: string;
  pincode: string;
  country: string;
};

export function rowToSavedAddress(row: SavedAddressRow): SavedAddress {
  return {
    id: row.id,
    label: row.label,
    isDefault: row.is_default,
    fullName: row.full_name,
    email: row.email,
    phone: row.phone,
    addressLine1: row.address_line1,
    addressLine2: row.address_line2 ?? "",
    city: row.city,
    state: row.state,
    pincode: row.pincode,
    country: row.country,
  };
}

export function shippingToRow(userId: string, address: ShippingAddress, label: string, isDefault: boolean) {
  return {
    user_id: userId,
    label,
    is_default: isDefault,
    full_name: address.fullName,
    email: address.email,
    phone: address.phone,
    address_line1: address.addressLine1,
    address_line2: address.addressLine2 || "",
    city: address.city,
    state: address.state,
    pincode: address.pincode,
    country: address.country,
  };
}
