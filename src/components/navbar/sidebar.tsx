import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Columns } from "lucide-react";
import { useSession } from "next-auth/react";
import { UserRole } from "@/types/UserRole";
import { navComponents } from ".";
import { usePathname } from "next/navigation";
import { Navlink } from "./nav-link";
import { DashboardLogo } from "./dahsboard-logo";

export const SideBar = () => {
  const pathname = usePathname();
  const session = useSession();
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
              active={pathname === component.href}
              className="justify-start"
            >
              {component.label}
            </Navlink>
          ))}
          {session.data?.user.role === UserRole.admin ? (
            <Navlink
              href="/admin"
              active={pathname === "/admin"}
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
