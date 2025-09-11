import { NextRequest, NextResponse } from "next/server";
export { default } from "next-auth/middleware";
import { getToken } from "next-auth/jwt";
import { checkRateLimit } from "./helpers/checkRateLimit";

export async function middleware(request: NextRequest) {
  const url = request.nextUrl;

  // Rate Limiting - Only for specific public endpoints
  const rateLimitedEndpoints = [
    "/api/send-message",
    "/api/suggest-messages",
    "/api/sign-up",
    "/api/verify-code",
  ];

  // if (
  //   rateLimitedEndpoints.some((endpoint) =>
  //     request.nextUrl.pathname.startsWith(endpoint)
  //   )
  // ) {
  //   const rateLimitResult = checkRateLimit(request);
  //   if (rateLimitResult.limited) {
  //     return new NextResponse(
  //       JSON.stringify({
  //         error: "Too many requests",
  //         message: "Rate limit exceeded. Please try again later.",
  //       }),
  //       {
  //         status: 429,
  //         headers: { "Content-Type": "application/json" },
  //       }
  //     );
  //   }
  // }

  if (
    request.method !== "OPTIONS" &&
    rateLimitedEndpoints.some((endpoint) =>
      request.nextUrl.pathname.startsWith(endpoint)
    )
  ) {
    const {
      limited,
      remaining = 0,
      limit,
      resetMs,
    } = checkRateLimit(request);

    if (limited) {
      const retryAfterSeconds = Math.ceil(resetMs / 1000);
      return new NextResponse(
        JSON.stringify({
          success: false,
          error: "Too many requests",
          message: "Rate limit exceeded. Please try again later",
          limit,
          remaining,
          reset: retryAfterSeconds,
        }),
        {
          status: 429,
          headers: {
            "Content-Type": "application/json",
            "Retry-After": String(retryAfterSeconds),
            "X-RateLimit-Limit": String(limit),
            "X-RateLimit-Remaining": String(remaining),
            "X-RateLimit-Reset": String(retryAfterSeconds),
          },
        }
      );
    }
  }
  // Authentication logic - only for pages that need it
  if (
    url.pathname.startsWith("/dashboard") ||
    url.pathname.startsWith("/sign-in") ||
    url.pathname.startsWith("/sign-up") ||
    url.pathname.startsWith("/verify")
  ) {
    const token = await getToken({ req: request });

    if (
      token &&
      (url.pathname.startsWith("/sign-in") ||
        url.pathname.startsWith("/sign-up") ||
        url.pathname.startsWith("/verify"))
    ) {
      return NextResponse.redirect(
        new URL("/dashboard", request.url)
      );
    }

    if (!token && url.pathname.startsWith("/dashboard")) {
      return NextResponse.redirect(new URL("/sign-in", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Auth-related pages (need redirect logic)
    "/sign-in",
    "/sign-up",
    "/verify/:path*",

    // Protected pages (need authentication)
    "/dashboard/:path*",

    // API routes that need rate limiting
    "/api/send-message",
    "/api/suggest-messages",
    "/api/sign-up",
    "/api/verify-code",

    // Include auth API routes (NextAuth needs them)
    "/api/auth/:path*",
  ],
};
