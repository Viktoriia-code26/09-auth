// middleware.ts
import { NextRequest, NextResponse } from "next/server";

const PUBLIC_ROUTES = ["/sign-in", "/sign-up"];
const PROTECTED_ROUTES = ["/profile", "/notes"];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const accessToken = req.cookies.get("accessToken")?.value;

  const isPublic = PUBLIC_ROUTES.some((route) => pathname.startsWith(route));
  const isProtected = PROTECTED_ROUTES.some((route) =>
    pathname.startsWith(route)
  );

  if (isPublic) {
    return NextResponse.next();
  }


  if (isProtected && !accessToken) {
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }


  return NextResponse.next();
}

export const config = {
  matcher: [
    "/profile/:path*",
    "/notes/:path*",
    "/sign-in",
    "/sign-up",
  ],
};
