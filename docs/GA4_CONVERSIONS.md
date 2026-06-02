# Google Analytics 4 — key events (MISKA)

Measurement ID: **G-JP9Q237XV0**

The site sends these **recommended ecommerce events** from the browser (see `lib/google/analytics.ts`):

| User action | GA4 event name |
|-------------|----------------|
| Product page view | `view_item` |
| Add to cart | `add_to_cart` |
| Checkout started | `begin_checkout` |
| Payment method chosen | `add_payment_info` |
| Order completed | `purchase` |

Events are queued in `dataLayer` immediately so clicks right after page load are not lost.

---

## Why events don’t show in the list yet

GA4 only lists an event under **Admin → Data display → Events** after it has been **received at least once** (often within minutes in DebugView, up to 24–48 hours in the main Events table).

If you don’t see `add_to_cart` or `purchase`:

1. Deploy the latest site code (with GA fixes).
2. Test with ad blockers **off**.
3. Use **DebugView** (below) — don’t rely on the Events list until you see hits there.
4. Perform the real actions: click Add to cart, complete checkout, land on `/checkout/success`.

Official guide: [Create or modify key events](https://support.google.com/analytics/answer/12844695)

---

## Step 1 — Verify events (DebugView)

DebugView only shows traffic when **debug mode is on** in the browser you’re testing. If you see *“No development devices have logged any debug events”*, do **A + B** below.

### A — Enable debug on the site (required)

1. Open (bookmark this):  
   **`https://www.miskahealth.in?debug_ga=1`**
2. Open browser **DevTools → Console**. You should see:  
   `[MISKA GA] Debug mode enabled — open GA4 → Admin → DebugView`
3. Stay on that tab; browse with `?debug_ga=1` on the URL **or** debug stays on via localStorage after first visit.

### B — Chrome extension (if A still shows nothing)

1. Install [Google Analytics Debugger](https://chrome.google.com/webstore/detail/google-analytics-debugger/jnkmfdileelhofjcijamephohjechfla) in Chrome.
2. Turn the extension **ON** (icon lit).
3. Reload `https://www.miskahealth.in?debug_ga=1` with ad blockers **disabled** for this site.

### C — GA4 DebugView

1. Use the **same Google account** that owns the Analytics property.
2. **Admin → Data display → DebugView** (not Realtime).
3. Within ~30 seconds you should see your device and `miska_debug_ping`, then `page_view`.
4. Do this flow:
   - Open a product page → expect `view_item`
   - Click **Add to cart** → expect `add_to_cart`
   - Go to checkout → expect `begin_checkout`
   - Choose prepaid or COD → expect `add_payment_info`
   - Complete order → on thank-you page expect `purchase` with `transaction_id`

In DebugView, click an event and confirm parameters: `currency: INR`, `value`, `items`, and for `purchase` — `transaction_id`.

---

## Step 2 — Mark as key events (conversions)

After events appear in **Admin → Data display → Events** (Recent events tab):

1. Find `add_to_cart`, `begin_checkout`, `add_payment_info`, `purchase`.
2. Toggle **Mark as key event** (star) for each one you care about.

Or create/mark when registering (same Google doc):

1. **Admin → Data display → Events → + Create event**
2. Choose **Create with code** if you already send `purchase` from the site (we do).
3. Optionally enable **Mark as key event** and set default value for `purchase`.

You do **not** need a separate “thank you page” event if `purchase` already fires on `/checkout/success` — unless you want a backup URL-based event:

- **Create without code** → event name `order_placed` → trigger `page_view` where URL contains `/checkout/success`  
  (Only use as backup; `purchase` is better for revenue.)

---

## Step 3 — Realtime check (no debug)

**Reports → Realtime** → scroll to **Event count by Event name** after you add to cart on the live site.

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| DebugView empty | `?debug_ga=1` + Console log; GA Debugger extension; same Google login as GA4; ad blocker off |
| No events at all | Ad blocker off; confirm `G-JP9Q237XV0` in page source; try `?debug_ga=1` |
| `add_to_cart` missing | Click Add to cart on a product page after deploy |
| `purchase` missing | Must reach `/checkout/success?order=...` with order data |
| Events in DebugView but not Events list | Wait 24–48h or keep using DebugView |
| Wrong property | GA4 property must match **G-JP9Q237XV0** |

---

## Google Ads (optional)

**Admin → Product links → Google Ads** → link account → import key events (`purchase`, `add_to_cart`).

---

## Implementation reference

- `components/analytics/GoogleAnalytics.tsx` — loads gtag, optional `debug_mode`
- `lib/analytics/ecommerce.ts` — Meta Pixel + GA4 together
