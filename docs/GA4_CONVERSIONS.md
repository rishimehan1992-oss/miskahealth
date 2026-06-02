# Google Analytics 4 — conversion events (MISKA)

Measurement ID: **G-JP9Q237XV0**

The site sends these GA4 **recommended ecommerce events** from the browser:

| User action | GA4 event name |
|-------------|----------------|
| Product page view | `view_item` |
| Add to cart | `add_to_cart` |
| Checkout started | `begin_checkout` |
| Payment method chosen | `add_payment_info` |
| Order completed | `purchase` |

Implementation: `lib/analytics/ecommerce.ts` (Meta Pixel + GA4).

## Mark events as conversions in GA4

1. Open [Google Analytics](https://analytics.google.com) → property **MISKA** (G-JP9Q237XV0).
2. **Admin** (gear) → **Data display** → **Events**.
3. Wait 24–48 hours after traffic, or use **DebugView** (see below) to see events sooner.
4. For each event above, toggle **Mark as conversion** (star icon), especially:
   - `add_to_cart`
   - `begin_checkout`
   - `add_payment_info`
   - `purchase`

## Test before going live

1. Install [Google Analytics Debugger](https://chrome.google.com/webstore/detail/google-analytics-debugger) (Chrome), or use GA4 **Admin → DebugView**.
2. On your site: view a product → add to cart → checkout → pick payment → complete test order.
3. In **DebugView**, confirm events appear with `items`, `currency: INR`, and `value`.

## Optional: Google Ads linking

If you run Google Ads:

1. **Admin → Product links → Google Ads links** → link account.
2. Import conversions from GA4 (`purchase`, `add_to_cart`, etc.) in Google Ads conversion settings.

## Troubleshooting

- No events: confirm ad blockers are off during testing.
- `purchase` missing: only fires on `/checkout/success` once per order ID.
- Duplicate `begin_checkout`: fires once per checkout page load (expected).
