import { NextRequest, NextResponse } from "next/server";
import { checkSession } from "./lib/api/serverApi";

const privateRoutes = ["/profile", "/notes"];
const publicRoutes = ["/sign-in", "/sign-up"];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const accessToken = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;

  const isPrivateRoute = privateRoutes.some((route) =>
    pathname.startsWith(route),
  );

  const isPublicRoute = publicRoutes.some((route) =>
    pathname.startsWith(route),
  );

  // 🔄 1. REFRESH SESSION
  if (!accessToken && refreshToken) {
    try {
      const res = await checkSession();

      const newAccessToken = res?.data?.accessToken;
      const newRefreshToken = res?.data?.refreshToken;

      if (newAccessToken) {
        const response = NextResponse.next();

        response.cookies.set("accessToken", newAccessToken, {
          httpOnly: true,
          path: "/",
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
        });

        if (newRefreshToken) {
          response.cookies.set("refreshToken", newRefreshToken, {
            httpOnly: true,
            path: "/",
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
          });
        }

        return response;
      }
    } catch (error) {
      console.log(error);
    }
  }

  // 🔐 2. НЕ АВТОРИЗОВАНИЙ
  if (!accessToken) {
    if (isPrivateRoute) {
      return NextResponse.redirect(new URL("/sign-in", request.url));
    }
    return NextResponse.next();
  }

  // 🔐 3. АВТОРИЗОВАНИЙ
  if (accessToken) {
    if (isPublicRoute) {
      return NextResponse.redirect(new URL("/profile", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/profile/:path*", "/notes/:path*", "/sign-in", "/sign-up"],
};
