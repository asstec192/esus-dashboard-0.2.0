"use client";

import { DataTable } from "@/components/table/DataTable";
import { DataTablePagination } from "@/components/table/DataTablePagination";
import { DataTableProvider } from "@/components/table/DataTableProvider";
import { DataTableSearch } from "@/components/table/DataTableSearch";
import { Card } from "@/components/ui/card";
import { api } from "@/trpc/react";
import type { RouterOutputs } from "@/trpc/shared";
import { formatProperName } from "@/utils/formatProperName";
import type { ColumnDef } from "@tanstack/react-table";
import { FormCadastroUsuario } from "./form-cadastro-usuario";
import { FormChangeUserPassword } from "./form-change-user-password";
import { FormChangeUserProfile } from "./form-change-user-profile";

export const AdminUserTable = () => {
  const { data: users, isError, isLoading } = api.users.all.useQuery();

  if (isLoading || isError) return null;

  return (
    <DataTableProvider columns={columns} data={users}>
      <div className="space-y-2">
        <div className="flex items-end justify-between">
          <DataTableSearch />
          <FormCadastroUsuario />
        </div>

        <Card className="bg-background">
          <DataTable />
        </Card>
        <DataTablePagination />
      </div>
    </DataTableProvider>
  );
};

const columns: ColumnDef<RouterOutputs["users"]["all"][0]>[] = [
  {
    accessorFn: ({ operador }) => operador?.OperadorNM ?? "",
    header: "Nome",
    meta: { className: "w-full max-w-0 sm:w-auto sm:max-w-none" },
    cell: ({ row }) => (
      <div className="flex flex-col gap-2 ">
        <span className="truncate">
          {formatProperName(row.original.operador?.OperadorNM)}
        </span>
        <span className="text-muted-foreground md:hidden">
          {row.original.perfil.descricao}
        </span>
      </div>
    ),
  },
  {
    accessorFn: ({ operador }) => operador?.OperadorApelido ?? "",
    header: "Apelido",
    meta: {
      className: "hidden md:table-cell",
    },
  },
  {
    accessorFn: ({ perfil }) => perfil.descricao,
    header: "Função",
    meta: {
      className: "hidden md:table-cell",
    },
  },
  {
    accessorKey: "createdAt",
    header: "Data de Cadastro",
    cell: ({ row }) => row.original.createdAt.toLocaleString().slice(0, 10),
  },
  {
    accessorKey: "updatedAt",
    header: "Última Atualização",
    cell: ({ row }) => row.original.updatedAt.toLocaleString().slice(0, 10),
    meta: {
      className: "hidden lg:table-cell",
    },
  },
  {
    accessorKey: "Ações",
    cell: ({ row }) => (
      <div className="flex gap-2">
        <FormChangeUserPassword user={row.original} />
        <FormChangeUserProfile user={row.original} />
      </div>
    ),
  },
];
