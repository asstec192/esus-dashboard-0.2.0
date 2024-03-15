"use client";

import { DropdownUserMenu } from "./user-menu-dropdown";
import { UserRole } from "@/types/UserRole";
import { SideBar } from "./sidebar";
import { DashboardLogo } from "./dahsboard-logo";
import { Navlink } from "./nav-link";
import { ModeToggle } from "./mode-toggle";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";

export const navLinks = [
  {
    label: "Dashboard",
    href: "/dashboard",
  },
  {
    label: "Regulação",
    href: "/regulacao",
  },
  {
    label: "SAMUFor",
    href: "/samufor",
  },
  {
    label: "Rede de Urgência",
    href: "/gerenciamento-rede",
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
          {navLinks.map((link) => (
            <Navlink
              key={link.href}
              href={link.href}
              active={pathname === link.href}
            >
              {link.label}
            </Navlink>
          ))}

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
