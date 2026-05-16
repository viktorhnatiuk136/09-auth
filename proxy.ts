import { NextRequest, NextResponse } from "next/server";

const privateRoutes = ["/profile", "/notes"];
const publicRoutes = ["/sign-in", "/sign-up"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const accessToken = request.cookies.get("accessToken")?.value;

  const isPrivateRoute = privateRoutes.some((route) =>
    pathname.startsWith(route),
  );

  const isPublicRoute = publicRoutes.some((route) =>
    pathname.startsWith(route),
  );

  // 🔐 Якщо користувач НЕ авторизований
  if (!accessToken) {
    // неавторизований → пробує зайти в приватну сторінку
    if (isPrivateRoute) {
      return NextResponse.redirect(new URL("/sign-in", request.url));
    }

    // публічні сторінки дозволяємо
    return NextResponse.next();
  }

  // 🔐 Якщо користувач АВТОРИЗОВАНИЙ
  if (accessToken) {
    // авторизований → не може бачити login/register
    if (isPublicRoute) {
      return NextResponse.redirect(new URL("/profile", request.url));
    }

    // приватні сторінки дозволяємо
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/profile/:path*", "/notes/:path*", "/sign-in", "/sign-up"],
};
