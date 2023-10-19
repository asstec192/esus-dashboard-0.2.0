import localFont from "next/font/local";
import { Toaster } from "@/components/ui/toaster";
import { ReactNode, useEffect } from "react";
import { Navbar } from "../navbar/navbar";
import { signOut, useSession } from "next-auth/react";

const inter = localFont({
  src: [
    {
      path: "../../../public/fonts/Inter-Thin.ttf",
      weight: "100",
    },
    {
      path: "../../../public/fonts/Inter-ExtraLight.ttf",
      weight: "200",
    },
    {
      path: "../../../public/fonts/Inter-Light.ttf",
      weight: "300",
    },
    {
      path: "../../../public/fonts/Inter-Regular.ttf",
      weight: "400",
    },
    {
      path: "../../../public/fonts/Inter-Medium.ttf",
      weight: "500",
    },
    {
      path: "../../../public/fonts/Inter-SemiBold.ttf",
      weight: "600",
    },
    {
      path: "../../../public/fonts/Inter-Bold.ttf",
      weight: "700",
    },
    {
      path: "../../../public/fonts/Inter-ExtraBold.ttf",
      weight: "800",
    },
    {
      path: "../../../public/fonts/Inter-Black.ttf",
      weight: "900",
    },
  ],
  variable: "--font-inter",
});

export default function RootLayout({ children }: { children: ReactNode }) {
  const { data, status } = useSession();
  useEffect(() => {
    const isSessionExpired =
      data?.expires && new Date(data.expires) < new Date();
    if (isSessionExpired && status === "authenticated") {
      signOut();
    }
  }, [data?.expires, status]);
  return (
    <div className={`${inter.variable} pb-4 font-sans`}>
      <Navbar />
      <div className="px-2 sm:px-4">{children}</div>
      <Toaster />
    </div>
  );
}
