declare global {
  interface Window {
    fbq?: (...args: any[]) => void;
  }
}

type PixelParams = Record<string, unknown>;

export function trackMeta(event: string, params?: PixelParams) {
  if (typeof window === "undefined") return;
  if (typeof window.fbq !== "function") return;
  try {
    if (params) window.fbq("track", event, params);
    else window.fbq("track", event);
  } catch {
    /* non-blocking */
  }
}

export function trackViewContent(product: {
  id: string;
  name: string;
  price: number;
}) {
  trackMeta("ViewContent", {
    content_type: "product",
    content_ids: [product.id],
    contents: [{ id: product.id, quantity: 1, item_price: product.price }],
    content_name: product.name,
    value: product.price,
    currency: "INR",
  });
}

export function trackAddToCart(product: {
  id: string;
  name: string;
  price: number;
}) {
  trackMeta("AddToCart", {
    content_type: "product",
    content_ids: [product.id],
    contents: [{ id: product.id, quantity: 1, item_price: product.price }],
    content_name: product.name,
    value: product.price,
    currency: "INR",
  });
}

export function trackInitiateCheckout(payload: {
  value: number;
  items: { id: string; quantity: number; item_price: number }[];
}) {
  trackMeta("InitiateCheckout", {
    content_type: "product",
    content_ids: payload.items.map((i) => i.id),
    contents: payload.items,
    value: payload.value,
    currency: "INR",
  });
}

export function trackAddPaymentInfo(payload: {
  value: number;
  items: { id: string; quantity: number; item_price: number }[];
  payment_method?: string;
}) {
  trackMeta("AddPaymentInfo", {
    content_type: "product",
    content_ids: payload.items.map((i) => i.id),
    contents: payload.items,
    value: payload.value,
    currency: "INR",
    ...(payload.payment_method ? { payment_method: payload.payment_method } : {}),
  });
}

export function trackPurchase(payload: {
  value: number;
  order_id: string;
  items: { id: string; quantity: number; item_price: number }[];
}) {
  trackMeta("Purchase", {
    content_type: "product",
    content_ids: payload.items.map((i) => i.id),
    contents: payload.items,
    value: payload.value,
    currency: "INR",
    order_id: payload.order_id,
  });
}

