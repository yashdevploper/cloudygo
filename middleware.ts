import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { cookies } from "next/headers";

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const isPublicPath =
    path === "/login" || path === "/signup" || path === "verifyEmail";

  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (isPublicPath && token) {
    return NextResponse.redirect(new URL("/weatherDashboard", request.url));
  }else if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

export const config = {
  matcher: [
    "/login",
    "/signup",
    "/profile",
    "/weatherDashboard",
  ],
};
