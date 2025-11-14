import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PUBLIC_ROUTES = ["/sign-in", "/sign-up"];
const PRIVATE_PREFIXES = ["/profile", "/notes"];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const token =
    req.cookies.get("token")?.value ||
    req.cookies.get("accessToken")?.value;

  const isPublic = PUBLIC_ROUTES.some((r) => pathname.startsWith(r));
  const isPrivate = PRIVATE_PREFIXES.some((r) => pathname.startsWith(r));

  if (!token && isPrivate) {
    const signInUrl = new URL("/sign-in", req.url);
    signInUrl.searchParams.set("redirectTo", pathname);
    return NextResponse.redirect(signInUrl);
  }


  if (token && isPublic) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (pathname.startsWith("/api/")) {
    const proxyUrl = req.nextUrl.clone();
    proxyUrl.hostname = "notehub-api.goit.study";
    proxyUrl.protocol = "https";
    proxyUrl.port = "";

    return NextResponse.redirect(proxyUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/api/:path*",
    "/profile",
    "/profile/:path*",
    "/notes",
    "/notes/:path*",
    "/sign-in",
    "/sign-up",
  ],
};
