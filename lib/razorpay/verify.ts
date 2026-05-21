import crypto from "crypto";

export function verifyPaymentSignature(
  orderId: string,
  paymentId: string,
  signature: string,
  secret: string
) {
  const body = `${orderId}|${paymentId}`;
  const expected = crypto.createHmac("sha256", secret).update(body).digest("hex");
  return expected === signature;
}

export function verifyWebhookSignature(body: string, signature: string, secret: string) {
  const expected = crypto.createHmac("sha256", secret).update(body).digest("hex");
  return expected === signature;
}
