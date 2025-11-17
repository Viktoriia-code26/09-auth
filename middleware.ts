// middleware.ts
import { NextRequest, NextResponse } from "next/server";

const protectedRoutes = ["/profile"];

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  const path = req.nextUrl.pathname;

  if (protectedRoutes.some((r) => path.startsWith(r)) && !token) {
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/profile/:path*"],
};
