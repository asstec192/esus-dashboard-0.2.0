import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { DashboardLogo } from "./dahsboard-logo";
import { useNavItems } from "./useNavItems";
import NavItem from "./nav-item";
import { Columns } from "lucide-react";
import { useSession } from "next-auth/react";
import { UserRole } from "@/types/UserRole";

export const SideBar = () => {
  const navItems = useNavItems();
  const { data: sessionData } = useSession();
  return (
    <Sheet>
      <SheetTrigger className="mr-3 text-xl lg:hidden">
        <Columns size="1.3rem" className="text-slate-500" />
      </SheetTrigger>
      <SheetContent className="lg:hidden" side="left">
        <DashboardLogo />
        <div className="mt-5 flex flex-col space-y-3">
          {navItems.map((item) => (
            <NavItem
              itemData={item}
              key={item.pathname}
              className="text-base"
            />
          ))}
          {sessionData?.user.role === UserRole.admin && (
            <NavItem
              className="text-base"
              itemData={{ label: "Administrador", pathname: "/admin" }}
            />
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};
