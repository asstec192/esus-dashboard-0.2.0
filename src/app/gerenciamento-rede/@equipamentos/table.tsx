"use client";

import { DataTableProvider } from "@/components/table/DataTableProvider";
import { DataTableSearch } from "@/components/table/DataTableSearch";
import { DataTableColumnHeader } from "@/components/table/DataTableColumnHeader";
import { DataTable } from "@/components/table/DataTable";
import { DataTablePagination } from "@/components/table/DataTablePagination";
import { RouterOutputs } from "@/trpc/shared";
import { GerenciamentoRedeAddEquipamento } from "./new";
import { Card } from "@/components/ui/card";
import { ColumnDef } from "@tanstack/react-table";
import { api } from "@/trpc/react";

export function Equipamentos({
  initialData,
}: {
  initialData: RouterOutputs["hospitalManager"]["getEquipamentos"];
}) {
  const { data } = api.hospitalManager.getEquipamentos.useQuery(undefined, {
    initialData,
  });
  return (
    <DataTableProvider columns={columns} data={data}>
      <div className="space-y-2">
        <div className="flex justify-between">
          <DataTableSearch />
          <GerenciamentoRedeAddEquipamento />
        </div>
        <Card>
          <DataTable />
        </Card>
        <DataTablePagination />
      </div>
    </DataTableProvider>
  );
}

const columns: ColumnDef<
  RouterOutputs["hospitalManager"]["getEquipamentos"][0]
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
