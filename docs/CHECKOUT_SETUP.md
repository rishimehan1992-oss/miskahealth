# Checkout integration — what to provide

The site now has a **guest checkout UI** with this flow:

1. **Bag** (`/cart`) — add products, adjust quantity  
2. **Delivery** (`/checkout?step=shipping`) — shipping address (saved in browser for guests)  
3. **Sign in** (`/checkout?step=account`) — **Continue with Google** (required before payment)  
4. **Payment** (`/checkout?step=payment`) — Razorpay (enabled when keys are set)

Amazon links remain as a secondary option on product cards.

---

## 1. Razorpay (payments)

From [Razorpay Dashboard](https://dashboard.razorpay.com/):

| Item | Where | Env variable |
|------|--------|----------------|
| Key ID (Test/Live) | Settings → API Keys | `NEXT_PUBLIC_RAZORPAY_KEY_ID` |
| Key Secret | Same | `RAZORPAY_KEY_SECRET` (server only, never commit) |
| Webhook secret | Settings → Webhooks | `RAZORPAY_WEBHOOK_SECRET` |

**Also share:**

- Whether you use **Test** or **Live** mode for launch  
- **Business name** and **logo URL** for the Razorpay checkout modal  
- **Webhook URL** we will register: `https://YOUR_DOMAIN/api/webhooks/razorpay`  
- Events to enable: `payment.captured`, `payment.failed`, `order.paid` (recommended)

**Optional:** GSTIN, registered business address if you need tax invoices on receipts.

---

## 2. Supabase + Google sign-in

Create a project at [supabase.com](https://supabase.com).

| Item | Env variable |
|------|----------------|
| Project URL | `NEXT_PUBLIC_SUPABASE_URL` |
| Anon public key | `NEXT_PUBLIC_SUPABASE_ANON_KEY` |
| Service role key (server only) | `SUPABASE_SERVICE_ROLE_KEY` |

**In Supabase → Authentication → Providers → Google:**

1. Enable Google  
2. Add **Authorized redirect URLs** (we will confirm exact path when wiring OAuth; typically):  
   - `http://localhost:3000/auth/callback`  
   - `https://YOUR_DOMAIN/auth/callback`  
3. Send the **Google OAuth Client ID** credentials you use in Supabase (or create in Google Cloud Console)

Set `NEXT_PUBLIC_GOOGLE_AUTH_ENABLED=true` when Google is ready.

**Tables we will add next (you do not need to create manually unless you prefer):**

- `profiles` (user id, name, email, phone)  
- `orders` (user_id, shipping JSON, amounts, status)  
- `order_items` (product slug, qty, price)  
- `payments` (razorpay_order_id, razorpay_payment_id, status)

---

## 3. Site / deployment

| Item | Example |
|------|---------|
| Production domain | `https://shop.miskahealth.com` |
| `NEXT_PUBLIC_SITE_URL` | Same as production URL |
| Vercel project | Already on `miskahealth` repo (if applicable) |

---

## 4. Business rules (your decisions)

Reply with:

1. **Shipping fee** — currently ₹49 under ₹999, free above (change?)  
2. **COD** — yes/no (Razorpay supports; off by default)  
3. **States you ship to** — all India or restricted list?  
4. **Order email** — address for BCC / support (`orders@...`)  
5. **Return policy URL** — for checkout footer  
6. **Inventory** — unlimited for now, or stock per SKU?

---

## 5. Security note

Never paste **Key Secret** or **Service role key** in chat. Add them only in:

- Local `.env.local` (gitignored)  
- Vercel → Project → Environment Variables  

Copy `.env.example` to `.env.local` and fill values locally.

---

## Dev preview

- Run `npm run dev`  
- Add items → `/cart` → **Proceed to checkout**  
- In development, use **Dev: skip to payment preview** on the sign-in step to see the payment screen without Google/Razorpay.
