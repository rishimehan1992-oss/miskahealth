import { NextResponse } from "next/server";
import { isGoogleAuthEnabled, isSupabaseConfigured } from "@/lib/supabase/config";

export async function GET() {
  const supabaseConfigured = isSupabaseConfigured();
  const googleAuthEnabled = isGoogleAuthEnabled();

  return NextResponse.json({
    supabaseConfigured,
    authEnabled: supabaseConfigured,
    googleAuthEnabled,
    razorpayConfigured: Boolean(
      (process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID) &&
        process.env.RAZORPAY_KEY_SECRET
    ),
  });
}
