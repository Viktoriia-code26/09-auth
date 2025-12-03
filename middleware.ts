import { NextResponse, NextRequest } from "next/server";
import { cookies } from "next/headers";
import { checkServerSession } from "@/lib/api/serverApi";

const PUBLIC_ROUTES = ["/sign-in", "/sign-up"];
const PROTECTED_ROUTES = ["/profile", "/notes"];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const cookieStore = await cookies();

  const accessToken = cookieStore.get("accessToken")?.value;
  const refreshToken = cookieStore.get("refreshToken")?.value;

  const isPublic = PUBLIC_ROUTES.some((route) => pathname.startsWith(route));
  const isProtected = PROTECTED_ROUTES.some((route) => pathname.startsWith(route));

  if (isPublic && accessToken) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (isProtected) {
  
    if (accessToken) return NextResponse.next();

    if (refreshToken) {
      try {
        const sessionResponse = await checkServerSession();

        if (sessionResponse?.status === 200) {
          const response = NextResponse.next();

          const setCookie = sessionResponse.headers["set-cookie"];
          if (setCookie) {
            const cookiesArray = Array.isArray(setCookie) ? setCookie : [setCookie];
            for (const cookie of cookiesArray) {
              response.headers.append("set-cookie", cookie);
            }
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
