/**
 * Unified ecommerce tracking — Meta Pixel + GA4.
 */
import * as meta from "@/lib/meta/pixel";
import * as ga from "@/lib/google/analytics";

export type LineItem = ga.AnalyticsLineItem;

export function trackViewContent(product: { id: string; name: string; price: number }) {
  meta.trackViewContent(product);
  ga.trackViewItem(product);
}

export function trackAddToCart(product: { id: string; name: string; price: number }) {
  meta.trackAddToCart(product);
  ga.trackAddToCart(product);
}

export function trackInitiateCheckout(payload: { value: number; items: LineItem[] }) {
  meta.trackInitiateCheckout(payload);
  ga.trackBeginCheckout(payload);
}

export function trackAddPaymentInfo(payload: {
  value: number;
  items: LineItem[];
  payment_method?: string;
}) {
  meta.trackAddPaymentInfo(payload);
  ga.trackAddPaymentInfo(payload);
}

export function trackPurchase(payload: {
  value: number;
  order_id: string;
  items: LineItem[];
  shipping?: number;
  coupon?: string;
}) {
  meta.trackPurchase({
    order_id: payload.order_id,
    value: payload.value,
    items: payload.items,
  });
  ga.trackPurchase(payload);
}
