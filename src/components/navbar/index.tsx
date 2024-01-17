import { DropdownUserMenu } from "./user-menu-dropdown";
import { UserRole } from "@/types/UserRole";
import { SideBar } from "./sidebar";
import { DashboardLogo } from "./dahsboard-logo";
import { Navlink } from "./nav-link";
import { headers } from "next/headers";
import { getServerAuthSession } from "@/server/auth";
import { ModeToggle } from "./mode-toggle";

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

export const dynamic = "force-dynamic";

export async function Navbar() {
  const session = await getServerAuthSession(); // verifica se há uma sessao ativa
  const heads = headers(); //obtem a lsita de cabeçalhos
  const pathname = heads.get("x-pathname"); //obtem o pathname da rota

  return (
    <nav className="sticky top-0 z-50 flex w-full border-b border-border bg-background px-4 py-2">
      <SideBar />
      <div className="flex flex-grow items-center justify-center lg:justify-between">
        <DashboardLogo />
        <div className="mx-auto hidden lg:flex">
          {navComponents.map((component) => (
            <Navlink
              key={component.href}
              active={pathname?.includes(component.href)}
              href={component.href}
            >
              {component.label}
            </Navlink>
          ))}
          {session?.user.role === UserRole.admin ? (
            <Navlink href="/admin" active={pathname?.includes("/admin")}>
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
