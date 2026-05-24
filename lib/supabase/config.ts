export function isSupabaseConfigured() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

export function isSupabaseAdminConfigured() {
  return isSupabaseConfigured() && Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY);
}

/** On when Supabase is configured unless explicitly disabled with `false`. */
export function isGoogleAuthEnabled() {
  if (!isSupabaseConfigured()) return false;
  return process.env.NEXT_PUBLIC_GOOGLE_AUTH_ENABLED !== "false";
}
