import { NextResponse } from "next/server";

/** Placeholder until Supabase Google OAuth is wired */
export async function GET(request: Request) {
  const origin = new URL(request.url).origin;
  const configured =
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
    process.env.NEXT_PUBLIC_GOOGLE_AUTH_ENABLED === "true";

  if (!configured) {
    return NextResponse.redirect(new URL("/checkout?step=account&auth=unavailable", origin));
  }

  // TODO: redirect to Supabase signInWithOAuth({ provider: 'google' })
  return NextResponse.json({ error: "Google auth not implemented yet" }, { status: 501 });
}
