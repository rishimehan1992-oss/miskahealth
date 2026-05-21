import Razorpay from "razorpay";

export function getRazorpayKeyId() {
  return process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ?? process.env.RAZORPAY_KEY_ID ?? "";
}

export function isRazorpayConfigured() {
  return Boolean(getRazorpayKeyId() && process.env.RAZORPAY_KEY_SECRET);
}

export function getRazorpayClient() {
  const key_id = getRazorpayKeyId();
  const key_secret = process.env.RAZORPAY_KEY_SECRET;
  if (!key_id || !key_secret) return null;
  return new Razorpay({ key_id, key_secret });
}
