// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { checkSession } from "./lib/api/serverApi";

const privateRoutes = ["/profile", "/notes"];
const publicRoutes = ["/sign-in", "/sign-up"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const accessToken = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;

  const isPublicRoute = publicRoutes.some((route) => pathname.startsWith(route));
  const isPrivateRoute = privateRoutes.some((route) => pathname.startsWith(route));

  // 🔒 Якщо є refreshToken, але нема accessToken → пробуємо оновити сесію
  if (!accessToken && refreshToken) {
    try {
      const res = await checkSession();
      const setCookie = res?.headers?.["set-cookie"];
      const response = NextResponse.next();

      // Якщо бекенд повернув нові кукі
      if (setCookie) {
        const cookiesArray = Array.isArray(setCookie) ? setCookie : [setCookie];
        cookiesArray.forEach((cookieStr) => {
          const [name, value] = cookieStr.split(";")[0].split("=");
          if (name && value) {
            response.cookies.set(name.trim(), value.trim());
          }
        });

        // Якщо користувач оновив сесію і йде на публічну сторінку → редірект
        if (isPublicRoute) {
          return NextResponse.redirect(new URL("/", request.url));
        }

        // Якщо користувач йде на приватну сторінку → пропускаємо
        if (isPrivateRoute) {
          return response;
        }
      }
    } catch (err) {
      console.error("Session refresh failed:", err);
    }
  }

  // 🚫 Немає жодного токена → редірект на Sign In
  if (!accessToken && !refreshToken && isPrivateRoute) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  // ✅ Уже авторизований → не пускаємо на Sign In / Sign Up
  if (accessToken && isPublicRoute) {
    return NextResponse.redirect(new URL("/profile", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/notes/:path*", "/profile", "/sign-in", "/sign-up"],
};
