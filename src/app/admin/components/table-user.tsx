"use client";

import { DataTable } from "@/components/table/DataTable";
import { DataTablePagination } from "@/components/table/DataTablePagination";
import { DataTableProvider } from "@/components/table/DataTableProvider";
import { DataTableSearch } from "@/components/table/DataTableSearch";
import { Card } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import { api } from "@/trpc/react";
import { RouterOutputs } from "@/trpc/shared";
import { formatProperName } from "@/utils/formatProperName";
import { ColumnDef } from "@tanstack/react-table";
import { AdminDropdownUserActions } from "./dropdown-user-actions";

export const AdminUserTable = () => {
  const {
    data: users,
    isError,
    isLoading,
  } = api.users.getAll.useQuery(undefined, {
    onError: (error) => {
      toast({
        title: "Houve um erro ao buscar a lista de usuários",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  if (isLoading || isError) return null;

  return (
    <DataTableProvider columns={columns} data={users}>
      <div className="space-y-2">
        <DataTableSearch />
        <Card className="bg-background">
          <DataTable />
        </Card>
        <DataTablePagination />
      </div>
    </DataTableProvider>
  );
};

const columns: ColumnDef<RouterOutputs["users"]["getAll"][0]>[] = [
  {
    accessorFn: ({ operador }) => operador?.OperadorNM || "",
    header: "Nome",
    cell: ({ row }) => formatProperName(row.original.operador?.OperadorNM),
  },
  {
    accessorFn: ({ operador }) => operador?.OperadorApelido || "",
    header: "Apelido",
  },
  {
    accessorFn: ({ perfil }) => perfil.descricao,
    header: "Função",
  },
  {
    accessorKey: "createdAt",
    header: "Data de Cadastro",
    cell: ({ row }) => row.original.createdAt.toLocaleString(),
  },
  {
    accessorKey: "updatedAt",
    header: "Última Atualização",
    cell: ({ row }) => row.original.updatedAt.toLocaleString(),
  },
  {
    accessorKey: "id",
    header: "",
    cell: ({ row }) => <AdminDropdownUserActions user={row.original} />,
  },
];
