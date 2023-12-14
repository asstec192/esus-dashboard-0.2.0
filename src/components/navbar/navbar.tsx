import NavItem from "./nav-item";
import { useNavItems } from "./useNavItems";
import { DropdownUserMenu } from "../dropdowns/DropdownUserMenu";
import { UserRole } from "@/types/UserRole";
import { Show } from "../flow/show";
import { signIn, useSession } from "next-auth/react";
import { Button } from "../ui/button";
import { SideBar } from "./side-bar";
import { DashboardLogo } from "./dahsboard-logo";

export const Navbar = () => {
  const navItems = useNavItems();
  const { data: sessionData } = useSession();
  return (
    <nav className="sticky left-0 top-0 z-50 mb-4 flex h-14 w-screen items-center border-b bg-primary-foreground px-2 sm:px-4">
      <SideBar />
      <DashboardLogo />
      <div className="ml-10 hidden items-center space-x-4 self-center lg:flex lg:space-x-6">
        {navItems.map((item, index) => (
          <NavItem key={index} itemData={item} />
        ))}
        <Show when={sessionData?.user.role !== UserRole.admin} fallback={null}>
          <NavItem itemData={{ label: "Administrador", pathname: "/admin" }} />
        </Show>
      </div>

      <div className="ml-auto">
        {sessionData ? (
          <DropdownUserMenu />
        ) : (
          <Button onClick={() => signIn()}>Login</Button>
        )}
      </div>
    </nav>
  );
};
