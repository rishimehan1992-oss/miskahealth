import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

const ADMIN_COOKIE = "miska-admin-session";

export async function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  // Admin auth guard
  if (pathname.startsWith("/admin")) {
    if (pathname === "/admin/login") {
      return NextResponse.next();
    }
    const session = request.cookies.get(ADMIN_COOKIE)?.value;
    const adminPass = process.env.ADMIN_PASSWORD;
    if (!adminPass || session !== adminPass) {
      const loginUrl = request.nextUrl.clone();
      loginUrl.pathname = "/admin/login";
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  if (searchParams.has("code") && !pathname.startsWith("/auth/callback")) {
    const url = request.nextUrl.clone();
    url.pathname = "/auth/callback";
    if (!url.searchParams.has("next")) {
      url.searchParams.set("next", "/checkout?step=pay");
    }
    return NextResponse.redirect(url);
  }

  return updateSession(request);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
