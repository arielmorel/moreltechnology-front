import { NextRequest, NextResponse } from "next/server";

const SESSION_COOKIE_NAME = "admin_session";
const ADMIN_LOGIN_PATH = "/admin";

function isAdminRoute(pathname: string): boolean {
  return pathname.startsWith("/admin");
}

function isLoginPage(pathname: string): boolean {
  return pathname === ADMIN_LOGIN_PATH || pathname === ADMIN_LOGIN_PATH + "/";
}

function hasValidSession(cookieHeader: string | undefined): boolean {
  if (!cookieHeader) return false;

  const sessionCookie = cookieHeader
    .split("; ")
    .find((c) => c.startsWith(`${SESSION_COOKIE_NAME}=`));

  if (!sessionCookie) return false;

  try {
    const value = decodeURIComponent(sessionCookie.split("=").slice(1).join("="));
    const session = JSON.parse(value);
    return typeof session === "object" && session !== null && "token" in session && "expiresAt" in session && Date.now() < session.expiresAt;
  } catch {
    return false;
  }
}

export function middleware(request: NextRequest): NextResponse {
  const { pathname } = request.nextUrl;

  if (!isAdminRoute(pathname)) {
    return NextResponse.next();
  }

  const cookieHeader = request.headers.get("cookie") || undefined;
  const authenticated = hasValidSession(cookieHeader);

  if (!authenticated && !isLoginPage(pathname)) {
    const loginUrl = new URL(ADMIN_LOGIN_PATH, request.url);
    return NextResponse.redirect(loginUrl);
  }

  if (authenticated && isLoginPage(pathname)) {
    const dashboardUrl = new URL("/admin/dashboard", request.url);
    return NextResponse.redirect(dashboardUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
