import { UserRole } from "@/types/UserRole";

export interface NavItemData {
  label: string;
  pathname: string;
}

//Hook para criar os links da barra de navegação
export const useNavItems = () => {
  const navItems: NavItemData[] = [
    {
      label: "Monitoramento",
      pathname: "/monitoramento",
    },
    {
      label: "Regulação Primária",
      pathname: "/regulacao-primaria",
    },
    {
      label: "Regulação Secundária",
      pathname: "/regulacao-secundaria",
    },
    {
      label: "Epidemiologia",
      pathname: "/epidemiologia",
    },
    {
      label: "Relatórios",
      pathname: "/relatorios",
    },
  ];

  return navItems;
};
