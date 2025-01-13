import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("Authorization");

  // List of public routes
  const publicRoutes = ["/", "/sign-in", "/sign-up"];

  // Extract the pathname from the request URL (ignoring query params)
  const pathname = req.nextUrl.pathname;

  // Redirect authenticated users away from public routes
  if (publicRoutes.includes(pathname) && token) {
    const projectUrl = new URL("/project", req.url);
    return NextResponse.redirect(projectUrl);
  }

  // Redirect unauthenticated users trying to access protected routes
  if (!publicRoutes.includes(pathname) && !token) {
    const signInUrl = new URL("/sign-in", req.url);
    signInUrl.searchParams.set("redirect_to", req.url);
    return NextResponse.redirect(signInUrl);
  }

  // Allow access if authenticated or on a public route
  return NextResponse.next();
}

export const config = {
  matcher: [
    // Skip internal paths and static files unless specified
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Apply middleware to API routes
    "/(api|trpc)(.*)",
  ],
};
