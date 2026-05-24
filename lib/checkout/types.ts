export type ShippingAddress = {
  fullName: string;
  email: string;
  phone: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
};

/** Simplified: Delivery → Pay (account step merged into delivery) */
export type CheckoutStep = "delivery" | "pay";

export const CHECKOUT_STEPS: { id: CheckoutStep; label: string }[] = [
  { id: "delivery", label: "Delivery" },
  { id: "pay", label: "Pay" },
];

export function parseCheckoutStep(raw: string | null): CheckoutStep {
  if (raw === "pay" || raw === "payment") return "pay";
  if (raw === "delivery" || raw === "shipping" || raw === "account") return "delivery";
  return "delivery";
}

export const EMPTY_SHIPPING: ShippingAddress = {
  fullName: "",
  email: "",
  phone: "",
  addressLine1: "",
  addressLine2: "",
  city: "",
  state: "",
  pincode: "",
  country: "India",
};
