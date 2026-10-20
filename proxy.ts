import { NextResponse, type NextRequest } from "next/server";

/**
 * Exposes the request pathname to server components as `x-pathname` so layouts
 * can make routing decisions (for example, letting /admin/login through while
 * everything else under /admin requires a session).
 *
 * This proxy only appends a header; it never rewrites the response, which keeps
 * its failure mode benign.
 */
export function proxy(request: NextRequest) {
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-pathname", request.nextUrl.pathname);
  return NextResponse.next({ request: { headers: requestHeaders } });
}

export const config = {
  matcher: ["/admin/:path*"],
};
