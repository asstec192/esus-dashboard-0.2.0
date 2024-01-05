import "@/styles/globals.css";

import localFont from "next/font/local";
import { cookies } from "next/headers";

import { TRPCReactProvider } from "@/trpc/react";
import { ModalOcorrencia } from "@/components/dialogs/ModalOcorrencia";
import { NextAuthProvider } from "@/providers/NextAuthProvider";
import { NextQueryParamProvider } from "@/providers/NextQueryParamProvider";
import { Toaster } from "@/components/ui/toaster";
import { Navbar } from "@/components/navbar";

const inter = localFont({
  src: [
    {
      path: "../../public/fonts/Inter-Thin.ttf",
      weight: "100",
    },
    {
      path: "../../public/fonts/Inter-ExtraLight.ttf",
      weight: "200",
    },
    {
      path: "../../public/fonts/Inter-Light.ttf",
      weight: "300",
    },
    {
      path: "../../public/fonts/Inter-Regular.ttf",
      weight: "400",
    },
    {
      path: "../../public/fonts/Inter-Medium.ttf",
      weight: "500",
    },
    {
      path: "../../public/fonts/Inter-SemiBold.ttf",
      weight: "600",
    },
    {
      path: "../../public/fonts/Inter-Bold.ttf",
      weight: "700",
    },
    {
      path: "../../public/fonts/Inter-ExtraBold.ttf",
      weight: "800",
    },
    {
      path: "../../public/fonts/Inter-Black.ttf",
      weight: "900",
    },
  ],
  variable: "--font-sans",
});

export const metadata = {
  title: "SAMUDashboard",
  description: "Generated by create-t3-app",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
  modalOcorrencia,
}: {
  children: React.ReactNode;
  modalOcorrencia: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`font-sans ${inter.variable} flex flex-col overflow-auto`}
      >
        <TRPCReactProvider cookies={cookies().toString()}>
          <NextAuthProvider>
            <Navbar />
            <Toaster />
            <NextQueryParamProvider>{children}</NextQueryParamProvider>
            <ModalOcorrencia />
          </NextAuthProvider>
        </TRPCReactProvider>
        {modalOcorrencia}
      </body>
    </html>
  );
}
