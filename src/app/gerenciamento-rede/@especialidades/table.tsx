"use client";

import type { RouterOutputs } from "@/trpc/shared";
import type { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/table/DataTable";
import { DataTableColumnHeader } from "@/components/table/DataTableColumnHeader";
import { DataTablePagination } from "@/components/table/DataTablePagination";
import { DataTableProvider } from "@/components/table/DataTableProvider";
import { DataTableSearch } from "@/components/table/DataTableSearch";
import { Card } from "@/components/ui/card";
import { api } from "@/trpc/react";
import { GerenciamentoRedeAddEspecialidade } from "./new";

export const Especialidades = ({
  initialData,
}: {
  initialData: RouterOutputs["hospitalManager"]["getEspecialidades"];
}) => {
  const { data } = api.hospitalManager.getEspecialidades.useQuery(undefined, {
    initialData,
  });
  return (
    <DataTableProvider columns={columns} data={data}>
      <div className="space-y-2">
        <div className="flex justify-between">
          <DataTableSearch />
          <GerenciamentoRedeAddEspecialidade />
        </div>
        <Card className="bg-background">
          <DataTable />
        </Card>
        <DataTablePagination />
      </div>
    </DataTableProvider>
  );
};

const columns: ColumnDef<
  RouterOutputs["hospitalManager"]["getEspecialidades"][0]
>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="ID" />
    ),
  },
  {
    accessorKey: "descricao",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Título" />
    ),
  },
];
