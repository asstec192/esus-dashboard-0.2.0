import Link from "next/link";

import { getServerAuthSession } from "@/server/auth";
import { buttonVariants } from "@/components/ui/button";

export default async function Home() {
  const session = await getServerAuthSession();

  return (
    <div className="min-h-nav-offset flex flex-col justify-center">
      <div className="container flex items-center justify-center gap-4 px-4 py-16 ">
        <div className="flex flex-col items-center justify-center gap-4">
          <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
            <span className="text-primary">SAMU</span>Dashboard
          </h1>

          <h3 className="max-w-xl text-center  text-xl font-bold">
            Uma visão abrangente e em tempo real das principais operações de
            atendimento do SAMU.
          </h3>

          <div className="flex flex-col items-center gap-2">
            <div className="flex flex-col justify-center gap-4">
              <p className="text-center text-xl">
                {session && <span>Logado como {session.user?.name}</span>}
              </p>

              {!session && (
                <Link
                  href="/api/auth/signin"
                  className={buttonVariants({ size: "lg" })}
                >
                  Entrar
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
