import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { parse } from "cookie";
import { checkServerSession } from "./lib/api/serverApi";

const privateRoutes = ["/profile", "/notes"];
const publicRoutes = ["/sign-in", "/sign-up"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const accessToken = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;

  const isPublicRoute = publicRoutes.some((route) => pathname.startsWith(route));
  const isPrivateRoute = privateRoutes.some((route) => pathname.startsWith(route));

  // 🔒 Если нет accessToken, но есть refreshToken — пробуем обновить сессию
  if (!accessToken && refreshToken) {
    const data = await checkServerSession();
    const setCookie = data?.headers?.["set-cookie"];
    const response = NextResponse.next();

    if (setCookie) {
      const cookieArray = Array.isArray(setCookie) ? setCookie : [setCookie];
      for (const cookieStr of cookieArray) {
        const parsed = parse(cookieStr);
        const options = {
          expires: parsed.Expires ? new Date(parsed.Expires) : undefined,
          path: parsed.Path,
          maxAge: parsed["Max-Age"] ? Number(parsed["Max-Age"]) : undefined,
        };

        if (parsed.accessToken)
          response.cookies.set("accessToken", parsed.accessToken, options);
        if (parsed.refreshToken)
          response.cookies.set("refreshToken", parsed.refreshToken, options);
      }

      // Если обновили токен — направляем в зависимости от типа маршрута
      if (isPublicRoute) {
        return NextResponse.redirect(new URL("/", request.url));
      }

      if (isPrivateRoute) {
        return response;
      }
    }
  }

  // 🚫 Нет accessToken и нет refreshToken → редирект неавторизованного пользователя
  if (!accessToken && !refreshToken && isPrivateRoute) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  // ✅ Авторизован, но пытается попасть на публичную страницу → редиректим
  if (accessToken && isPublicRoute) {
    return NextResponse.redirect(new URL("/profile", request.url));
  }

  // ✅ Иначе пропускаем запрос дальше
  return NextResponse.next();
}

export const config = {
  matcher: ["/notes/:path*", "/profile", "/sign-in", "/sign-up"],
};
