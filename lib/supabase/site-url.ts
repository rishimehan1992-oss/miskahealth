/** Canonical site origin for OAuth and email links. */
export function getSiteOrigin() {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  if (typeof window !== "undefined") {
    const { hostname, protocol, port } = window.location;
    const isLocal = hostname === "localhost" || hostname === "127.0.0.1";
    if (!isLocal) {
      return window.location.origin;
    }
    return fromEnv || `${protocol}//${hostname}${port ? `:${port}` : ""}`;
  }
  return fromEnv || "";
}

export function authCallbackUrl(nextPath = "/checkout?step=pay") {
  const origin = getSiteOrigin();
  if (!origin) return `/auth/callback?next=${encodeURIComponent(nextPath)}`;
  return `${origin}/auth/callback?next=${encodeURIComponent(nextPath)}`;
}
