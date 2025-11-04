import { NextResponse } from "next/server";

export function middleware(request) {
  const { pathname } = request.nextUrl;

  // Skip Next.js system and API routes
  if (
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // If URL contains uppercase letters → redirect to lowercase version
  if (/[A-Z]/.test(pathname)) {
    const lowercaseUrl = request.nextUrl.clone();
    lowercaseUrl.pathname = pathname.toLowerCase();
    return NextResponse.redirect(lowercaseUrl, 301); // permanent redirect
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/:path*",
};
