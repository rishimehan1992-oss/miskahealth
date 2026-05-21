# Supabase + Google login — step by step

Follow these steps in order. The code is already in the repo; you only configure Supabase, Google, and env vars.

---

## Part 1 — Create Supabase project

1. Go to [https://supabase.com](https://supabase.com) and sign in.
2. Click **New project**.
3. Choose:
   - **Name:** `miskahealth` (or any name)
   - **Database password:** save this somewhere safe (for DB access only)
   - **Region:** South Asia (Mumbai) if available — closest to India
4. Wait until the project status is **Active** (~2 minutes).

---

## Part 2 — Copy API keys into `.env.local`

1. In Supabase: **Project Settings** (gear) → **API**.
2. Copy these into `/Users/rishimehan/Desktop/shopify_website/.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...   # anon public key
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOi...       # service_role — NEVER commit or share
```

3. Keep existing Razorpay lines in the same file.
4. Set:

```env
NEXT_PUBLIC_GOOGLE_AUTH_ENABLED=false
```

(Change to `true` after Part 4.)

5. Restart dev server: `npm run dev`

---

## Part 3 — Create database tables

1. Supabase → **SQL Editor** → **New query**.
2. Open the file `supabase/schema.sql` in this repo.
3. Copy **all** SQL and paste into the editor.
4. Click **Run**. You should see “Success”.

This creates:

| Table | Purpose |
|-------|---------|
| `profiles` | User name, email, avatar (from Google) |
| `orders` | Each checkout / Razorpay order |
| `order_items` | Products in each order |

---

## Part 4 — Enable Google sign-in

### A. Google Cloud Console

1. Go to [https://console.cloud.google.com](https://console.cloud.google.com).
2. Create or select a project.
3. **APIs & Services** → **OAuth consent screen** → configure (External is fine for testing).
4. **Credentials** → **Create credentials** → **OAuth client ID**.
5. Type: **Web application**.
6. **Authorized JavaScript origins:**
   - `http://localhost:3000`
   - `https://YOUR_VERCEL_DOMAIN.vercel.app` (your live site)
7. **Authorized redirect URIs:** (get exact URL from Supabase in step B below)
8. Copy **Client ID** and **Client Secret**.

### B. Supabase Auth → Google

1. Supabase → **Authentication** → **Providers** → **Google**.
2. Turn **Enable** on.
3. Paste **Client ID** and **Client Secret** from Google.
4. Copy the **Callback URL** shown (looks like  
   `https://xxxxxxxx.supabase.co/auth/v1/callback`).
5. Add that URL to Google OAuth **Authorized redirect URIs** if not already there.
6. Save.

### C. Supabase redirect URLs (your site)

1. Supabase → **Authentication** → **URL Configuration**.
2. **Site URL:** your production URL, e.g. `https://miskahealth.vercel.app`
3. **Redirect URLs** — add both:
   - `http://localhost:3000/auth/callback`
   - `https://YOUR_VERCEL_DOMAIN.vercel.app/auth/callback`
4. Save.

### D. Turn on Google in `.env.local`

```env
NEXT_PUBLIC_GOOGLE_AUTH_ENABLED=true
```

Restart `npm run dev`.

---

## Part 5 — Vercel (production)

In **Vercel → Project → Settings → Environment Variables**, add:

| Variable | Value |
|----------|--------|
| `NEXT_PUBLIC_SUPABASE_URL` | Same as local |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Same as local |
| `SUPABASE_SERVICE_ROLE_KEY` | service_role key |
| `NEXT_PUBLIC_GOOGLE_AUTH_ENABLED` | `true` |
| `NEXT_PUBLIC_RAZORPAY_KEY_ID` | (already set) |
| `RAZORPAY_KEY_SECRET` | (already set) |
| `RAZORPAY_WEBHOOK_SECRET` | (already set) |
| `NEXT_PUBLIC_SITE_URL` | `https://your-live-domain` |

Redeploy after saving.

---

## Part 6 — Test the flow

### Google login

1. Add item to cart → checkout → delivery → **Continue to payment** or account step.
2. Click **Continue with Google**.
3. After Google, you should land on **Payment** signed in (email prefilled).

### Payment + database

1. Complete a test payment (use Razorpay **test** keys for safe testing).
2. Supabase → **Table Editor** → `orders` — you should see a new row.
3. `order_items` — lines for that order.
4. `profiles` — row for your Google user.

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| Google button disabled | Set `NEXT_PUBLIC_GOOGLE_AUTH_ENABLED=true` and restart dev server |
| Redirect error after Google | Check redirect URLs in Supabase + Google match exactly |
| Orders not in Supabase | Add `SUPABASE_SERVICE_ROLE_KEY` to env and redeploy |
| `relation "orders" does not exist` | Run `supabase/schema.sql` in SQL Editor |

---

## Security reminders

- Never commit `.env.local` or paste **service_role** / **Razorpay secret** in chat.
- Use Razorpay **test** keys until you are ready for real charges.
- Rotate keys if they were ever exposed.

---

## What the app does when configured

- **Google OAuth** → session cookie via `/auth/callback`
- **Orders** saved to Supabase on create + after payment
- **Guest checkout** still works without Google
- **Signed-in users** get `user_id` linked on orders
