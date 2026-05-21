import type { ShippingAddress } from "@/lib/checkout/types";

export type OrderItem = {
  slug: string;
  name: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
};

export type OrderRecord = {
  id: string;
  userId?: string;
  razorpayOrderId: string;
  status: "created" | "paid" | "failed";
  amountPaise: number;
  subtotal: number;
  shippingFee: number;
  items: OrderItem[];
  shipping: ShippingAddress;
  paymentId?: string;
  createdAt: string;
  paidAt?: string;
};
