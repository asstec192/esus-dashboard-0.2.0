export { default } from "next-auth/middleware";

export const config = {
  matcher: [
    "/regulacao/primaria",
    "/regulacao/secundaria",
    "/epidemiologia",
    "/monitoramento",
    "/admin",
    "/usuarios/:path*",
    "/gerenciamento-rede",
  ],
};
