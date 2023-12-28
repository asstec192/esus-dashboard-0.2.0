"use client";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { DropdownUserMenu } from "./user-menu-dropdown";
import { useSession } from "next-auth/react";
import { UserRole } from "@/types/UserRole";
import { SideBar } from "./sidebar";
import { DashboardLogo } from "./dahsboard-logo";
import { Navlink } from "./nav-link";

export const navComponents = [
  {
    label: "Monitoramento",
    href: "/monitoramento",
  },
  {
    label: "Regulação Primária",
    href: "/regulacao/primaria",
  },
  {
    label: "Regulação Secundária",
    href: "/regulacao/secundaria",
  },
  {
    label: "Epidemiologia",
    href: "/epidemiologia",
  },
  {
    label: "Gerenciamento da Rede",
    href: "/gerenciamento-rede",
  },
];

export function Navbar() {
  const session = useSession();
  const pathname = usePathname();
  return (
    <nav className="sticky top-0 z-50 flex w-full border-b border-border bg-background px-4 py-2">
      <SideBar />
      <div className="flex flex-grow items-center justify-center lg:justify-between">
        <DashboardLogo />
        <div className="mx-auto hidden lg:flex">
          {navComponents.map((component) => (
            <Navlink
              key={component.href}
              active={pathname === component.href}
              href={component.href}
            >
              {component.label}
            </Navlink>
          ))}
          {session.data?.user.role === UserRole.admin ? (
            <Navlink href="/admin" active={pathname === "/admin"}>
              Administrador
            </Navlink>
          ) : null}
        </div>
      </div>
      <DropdownUserMenu />
    </nav>
  );
}
