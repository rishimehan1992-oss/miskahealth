/**
 * GA4 ecommerce events — queued via dataLayer so nothing is lost before gtag.js loads.
 * @see https://developers.google.com/analytics/devguides/collection/ga4/ecommerce
 */
export const GA_MEASUREMENT_ID = "G-JP9Q237XV0";
export const GOOGLE_ADS_ID = "AW-11299806152";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export type AnalyticsLineItem = {
  id: string;
  name?: string;
  quantity: number;
  item_price: number;
};

function gaItems(items: AnalyticsLineItem[]) {
  return items.map((i) => ({
    item_id: i.id,
    item_name: i.name ?? i.id,
    price: i.item_price,
    quantity: i.quantity,
  }));
}

/** Push event the same way gtag.js does — works before the external script finishes loading. */
function gaEvent(event: string, params: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  try {
    window.dataLayer = window.dataLayer ?? [];
    const gtag =
      window.gtag ??
      function (...args: unknown[]) {
        window.dataLayer!.push(args);
      };
    const payload = {
      send_to: GA_MEASUREMENT_ID,
      ...params,
      ...(isGaDebugMode() ? { debug_mode: true } : {}),
    };
    gtag("event", event, payload);
    if (isGaDebugMode()) {
      console.info(`[MISKA GA] event: ${event}`, payload);
    }
  } catch {
    /* non-blocking */
  }
}

export function isGaDebugMode(): boolean {
  if (typeof window === "undefined") return false;
  try {
    if (window.location.search.includes("debug_ga=1")) return true;
    return localStorage.getItem("miska-ga-debug") === "1";
  } catch {
    return false;
  }
}

export function trackViewItem(product: { id: string; name: string; price: number }) {
  gaEvent("view_item", {
    currency: "INR",
    value: product.price,
    items: gaItems([{ id: product.id, name: product.name, quantity: 1, item_price: product.price }]),
  });
}

export function trackAddToCart(product: { id: string; name: string; price: number }) {
  gaEvent("add_to_cart", {
    currency: "INR",
    value: product.price,
    items: gaItems([{ id: product.id, name: product.name, quantity: 1, item_price: product.price }]),
  });
}

export function trackBeginCheckout(payload: {
  value: number;
  items: AnalyticsLineItem[];
}) {
  gaEvent("begin_checkout", {
    currency: "INR",
    value: payload.value,
    items: gaItems(payload.items),
  });
}

export function trackAddPaymentInfo(payload: {
  value: number;
  items: AnalyticsLineItem[];
  payment_method?: string;
}) {
  gaEvent("add_payment_info", {
    currency: "INR",
    value: payload.value,
    payment_type: payload.payment_method,
    items: gaItems(payload.items),
  });
}

export function trackPurchase(payload: {
  value: number;
  order_id: string;
  items: AnalyticsLineItem[];
  shipping?: number;
  coupon?: string;
}) {
  gaEvent("purchase", {
    transaction_id: payload.order_id,
    currency: "INR",
    value: payload.value,
    shipping: payload.shipping,
    coupon: payload.coupon,
    items: gaItems(payload.items),
  });
}
