import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { AUTH_KEY } from "./constants/auth";
import { getMe, useAuthMe } from "./services/auth";

export async function middleware(request: NextRequest) {
  // await getMe()
  // get the user from the request
  const publicRoute = ["/login", "/register"];
  let cookieToken = request.cookies.get(AUTH_KEY);

  const originalWarn = console.warn;

  console.warn = (...args) => {
    const [firstArg] = args;
    if (
      typeof firstArg === "string" &&
      firstArg.includes(
        "An aria-label or aria-labelledby prop is required for accessibility.",
      )
    ) {
      return;
    }

    originalWarn(...args);
  };
  if (!publicRoute.includes(request.nextUrl.pathname)) {
    if (!cookieToken) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // "/",
    // "/(id|en)/:path*",
    // NON AUTH
    // '/login',
    // '/register',
    // WITH AUTH
  ],
};
