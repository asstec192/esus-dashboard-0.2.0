import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "next-auth/middleware";

//wrapp do middleware de autenticação, faz com que as rotas em "cofig" exijam autenticacao
export default withAuth(
  //middleware interno, para outras funcionalidades
  function middleware(request: NextRequest) {
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-pathname", request.nextUrl.pathname);

    return NextResponse.next({
      request: {
        // Apply new request headers
        headers: requestHeaders,
      },
    });
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token, //autoriza se houver um token
    },
  },
);

//rotas onde o middlware acima sera executado
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
