import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("Authorization");

  // Public routes
  const publicRoutes = ["/", "/sign-in", "/sign-up"];
  if (publicRoutes.includes(req.nextUrl.pathname) && token) {
    const projectUrl = new URL("/project", req.url);
    return NextResponse.redirect(projectUrl);
  }

  // Validate token
  if (!token) {
    const signInUrl = new URL("/sign-in", req.url);
    signInUrl.searchParams.set("redirect_to", req.url);
    return NextResponse.redirect(signInUrl);
  }
}

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
    // '/dashboard(.*)',
  ],
};
