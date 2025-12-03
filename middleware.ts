import { NextResponse, NextRequest } from "next/server";

const PUBLIC_ROUTES = ["/sign-in", "/sign-up"];
const PROTECTED_ROUTES = ["/profile", "/notes"];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const accessToken = req.cookies.get("accessToken")?.value;
  const refreshToken = req.cookies.get("refreshToken")?.value;

  const isPublic = PUBLIC_ROUTES.some(route => pathname.startsWith(route));
  const isProtected = PROTECTED_ROUTES.some(route => pathname.startsWith(route));

  if (isPublic && accessToken) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (isProtected) {
    if (accessToken) return NextResponse.next();

    if (refreshToken) {
      try {
        const res = await fetch("https://notehub-api.goit.study/users/current", {
          method: "GET",
          credentials: "include",
          headers: { Cookie: `refreshToken=${refreshToken};` },
        });

        if (res.ok) {
          const response = NextResponse.next();

          const setCookie = res.headers.get("set-cookie");
          if (setCookie) {
            response.headers.set("set-cookie", setCookie);
          }

          return response;
        }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (e) {
        return NextResponse.redirect(new URL("/sign-in", req.url));
      }
    }

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
