import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/** Handles OAuth and email-confirmation redirects from Supabase */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/checkout?step=pay";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(new URL(next, origin));
    }
  }

  return NextResponse.redirect(new URL("/checkout?step=delivery&auth=error", origin));
}
