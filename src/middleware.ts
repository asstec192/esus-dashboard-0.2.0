import { NextRequest, NextResponse } from "next/server";

export { default } from "next-auth/middleware";

export function middleware(request: NextRequest) {
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-pathname", request.nextUrl.pathname);

  return NextResponse.next({
    request: {
      // Apply new request headers
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: [
    "/regulacao/:path*",
    "/epidemiologia",
    "/monitoramento",
    "/admin",
    "/usuarios/:path*",
    "/gerenciamento-rede",
  ],
};
