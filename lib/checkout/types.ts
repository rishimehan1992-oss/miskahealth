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

export type CheckoutStep = "shipping" | "account" | "payment";

export const CHECKOUT_STEPS: { id: CheckoutStep; label: string }[] = [
  { id: "shipping", label: "Delivery" },
  { id: "account", label: "Sign in" },
  { id: "payment", label: "Payment" },
];

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
