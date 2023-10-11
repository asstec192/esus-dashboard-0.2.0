import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { getNameInitials } from "@/utils/getNameInitials";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { extractFirstAndLastNames } from "@/utils/extractFirstAndLastNames";
import { formatProperName } from "@/utils/formatProperName";

export const UserDropdownMenu = () => {
  const { data: sessionData } = useSession();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar>
          <AvatarImage src="" alt="retrato do usuário" />
          <AvatarFallback className="font-medium text-primary">
            {sessionData && getNameInitials(sessionData.user.username)}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>
          {sessionData
            ? formatProperName(extractFirstAndLastNames(sessionData.user.name))
            : "Minha conta"}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <Link href="/usuarios">
          <DropdownMenuItem>Perfil</DropdownMenuItem>
        </Link>
        <DropdownMenuItem disabled>Relatórios</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => signOut()}>Sair</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
