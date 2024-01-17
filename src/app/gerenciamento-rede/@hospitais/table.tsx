"use client";

import { DataTableProvider } from "@/components/table/DataTableProvider";
import { DataTable } from "@/components/table/DataTable";
import { DataTableColumnHeader } from "@/components/table/DataTableColumnHeader";
import { DataTablePagination } from "@/components/table/DataTablePagination";
import { DataTableSearch } from "@/components/table/DataTableSearch";
import { Card } from "@/components/ui/card";
import { RouterOutputs } from "@/trpc/shared";
import { ColumnDef } from "@tanstack/react-table";

type Hospital = RouterOutputs["destinations"]["getAll"][0];

export function GerenciamentoRedeHospitaisTable({
  hospitais,
}: {
  hospitais: Hospital[];
}) {
  return (
    <div className="space-y-2">
      <DataTableProvider columns={columns} data={hospitais}>
        <DataTableSearch />
        <Card className="bg-background">
          <DataTable />
        </Card>
        <DataTablePagination />
      </DataTableProvider>
    </div>
  );
}

const columns: ColumnDef<Hospital>[] = [
  {
    accessorKey: "UnidadeCOD",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="ID" />
    ),
  },
  {
    accessorKey: "UnidadeDS",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Título" />
    ),
  },
];
