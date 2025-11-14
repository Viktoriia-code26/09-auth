
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
    const signInUrl = new URL("/sign-in", req.url);
    signInUrl.searchParams.set("redirectTo", pathname);
    return NextResponse.redirect(signInUrl);
  }

  if (accessToken && isPublic) {
    const homeUrl = new URL("/", req.url);
    return NextResponse.redirect(homeUrl);
  }

  if (pathname.startsWith("/api/")) {
    const proxyUrl = req.nextUrl.clone();
    proxyUrl.hostname = "notehub-api.goit.study";
    proxyUrl.protocol = "https";
    proxyUrl.port = "";

  
    console.log("🔁 Proxying API request to:", proxyUrl.toString());
    
  return NextResponse.next();
}

    return NextResponse.next();
  }

  export const config = {
    matcher: ["/api/:path", "/profile/:path*", "/notes/:path*", "/sign-in", "/sign-up"],
  };
