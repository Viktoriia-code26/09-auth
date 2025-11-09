// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PUBLIC_ROUTES = ["/sign-in", "/sign-up"];
const PRIVATE_ROUTES = ["/profile", "/notes"];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const accessToken =
    req.cookies.get("accessToken")?.value ||
    req.cookies.get("token")?.value;

  const isPublic = PUBLIC_ROUTES.some((r) => pathname.startsWith(r));
  const isPrivate = PRIVATE_ROUTES.some((r) => pathname.startsWith(r));

  
  if (!accessToken && isPrivate) {
    const url = req.nextUrl.clone();
    url.pathname = "/sign-in";
    return NextResponse.redirect(url);
  }


  if (accessToken && isPublic) {
    const url = req.nextUrl.clone();
    url.pathname = "/profile";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/profile/:path*", "/notes/:path*", "/sign-in", "/sign-up"],
};
