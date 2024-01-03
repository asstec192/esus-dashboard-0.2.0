import { MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DashboardUser } from "@/types/DashboardUser";
import { useManageUsersStore } from "../hooks/useManageUsersStore";
import { Button } from "@/components/ui/button";

export const AdminDropdownUserActions = ({ user }: { user: DashboardUser }) => {
  const setSelectedUser = useManageUsersStore((state) => state.setSelectedUser);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Button variant="ghost" className="h-min p-1">
          <MoreHorizontal size="1.2rem" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem disabled>Relatórios</DropdownMenuItem>
        <DropdownMenuItem onClick={() => setSelectedUser(user)}>
          Alterar Senha
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem disabled>Excluir Conta</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
