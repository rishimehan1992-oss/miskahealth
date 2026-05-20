import { NextResponse } from "next/server";

export async function GET() {
  const supabaseConfigured = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
  const googleAuthEnabled =
    supabaseConfigured && process.env.NEXT_PUBLIC_GOOGLE_AUTH_ENABLED === "true";

  return NextResponse.json({
    supabaseConfigured,
    googleAuthEnabled,
    razorpayConfigured: Boolean(
      process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET
    ),
  });
}
