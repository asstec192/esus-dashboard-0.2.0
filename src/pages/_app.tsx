import { SessionProvider } from "next-auth/react";
import { type AppProps } from "next/app";
import { api } from "@/utils/api";
import "@/styles/globals.css";
import { type ReactElement, ReactNode } from "react";
import { type NextPage } from "next";
import RootLayout from "@/components/layouts/root-layout";
import { QueryParamProvider } from "use-query-params";
import NextAdapterPages from "next-query-params/pages";

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? ((page) => page);

  return (
    <SessionProvider session={pageProps.session}>
      <QueryParamProvider adapter={NextAdapterPages}>
        <RootLayout>{getLayout(<Component {...pageProps} />)}</RootLayout>
      </QueryParamProvider>
    </SessionProvider>
  );
}

export default api.withTRPC(MyApp);
