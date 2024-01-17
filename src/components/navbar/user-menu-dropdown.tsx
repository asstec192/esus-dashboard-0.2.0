"use client";

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

export const DropdownUserMenu = () => {
  const { data: sessionData } = useSession(); //obtem a sessao ativa

  if (!sessionData) return null; //retorna nulo se nao houver uma sessao ativa

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="ml-2">
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
        <Link href={`/usuarios/${sessionData.user.esusId}`}>
          <DropdownMenuItem>Perfil</DropdownMenuItem>
        </Link>
        <DropdownMenuItem disabled>Relatórios</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => signOut({ callbackUrl: "/" })}>
          Sair
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
