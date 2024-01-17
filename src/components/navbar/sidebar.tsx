import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Columns } from "lucide-react";
import { UserRole } from "@/types/UserRole";
import { navComponents } from ".";
import { Navlink } from "./nav-link";
import { DashboardLogo } from "./dahsboard-logo";
import { getServerAuthSession } from "@/server/auth";
import { headers } from "next/headers";

export const SideBar = async () => {
  const session = await getServerAuthSession(); // verifica se há uma sessao ativa
  const heads = headers(); //obtem a lsita de cabeçalhos
  const pathname = heads.get("x-pathname"); //obtem o pathname da ro
  return (
    <Sheet>
      <SheetTrigger className="mr-3 text-xl lg:hidden">
        <Columns size="1.3rem" className="text-slate-500" />
      </SheetTrigger>
      <SheetContent className="!max-w-xs lg:hidden" side="left">
        <div className="flex flex-col">
          <div className="ml-4">
            <DashboardLogo />
          </div>
          {navComponents.map((component) => (
            <Navlink
              key={component.href}
              href={component.href}
              active={pathname?.includes(component.href)}
              className="justify-start"
            >
              {component.label}
            </Navlink>
          ))}
          {session?.user.role === UserRole.admin ? (
            <Navlink
              href="/admin"
              active={pathname?.includes("/admin")}
              className="justify-start"
            >
              Administrador
            </Navlink>
          ) : null}
        </div>
      </SheetContent>
    </Sheet>
  );
};
