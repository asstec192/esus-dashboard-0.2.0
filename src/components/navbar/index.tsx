"use client";

import { DropdownUserMenu } from "./user-menu-dropdown";
import { UserRole } from "@/types/UserRole";
import { SideBar } from "./sidebar";
import { DashboardLogo } from "./dahsboard-logo";
import { Navlink } from "./nav-link";
import { ModeToggle } from "./mode-toggle";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "../ui/navigation-menu";
import { cn } from "@/lib/utils";

export const navComponents = [
  {
    label: "Dashboard",
    href: "/dashboard",
  },
  {
    label: "SAMUFor",
    href: "/regulacao/secundaria",
  },
  {
    label: "Rede de Urgência",
    href: "/gerenciamento-rede",
  },
];

export const composedLinks = [
  {
    group: "Regulação de Urgências",
    groupLinks: [
      {
        label: "Monitoramento",
        href: "/monitoramento",
      },
      {
        label: "Regulação Primária",
        href: "/regulacao/primaria",
      },
    ],
  },
];

export function Navbar() {
  const session = useSession(); // verifica se há uma sessao ativa
  const pathname = usePathname(); //obtem o caminho da rota

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
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem className="text-">
                <NavigationMenuTrigger
                  className={cn(
                    "text-muted-foreground",
                    pathname === "" && "border-b-4 border-primary",
                  )}
                >
                  Regulação das Urgências
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <Navlink href="/regulacao/primaria">
                    Regulação Primária
                  </Navlink>
                  <Navlink href="/regulacao/secundaria">Monitoramento</Navlink>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
          {session.data?.user.role === UserRole.admin ? (
            <Navlink href="/admin" active={pathname === "/admin"}>
              Administrador
            </Navlink>
          ) : null}
        </div>
      </div>
      <ModeToggle />
      <DropdownUserMenu />
    </nav>
  );
}
