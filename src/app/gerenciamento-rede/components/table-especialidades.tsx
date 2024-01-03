import { DataTable } from "@/components/table/DataTable";
import { DataTableColumnHeader } from "@/components/table/DataTableColumnHeader";
import { DataTablePagination } from "@/components/table/DataTablePagination";
import { DataTableProvider } from "@/components/table/DataTableProvider";
import { DataTableSearch } from "@/components/table/DataTableSearch";
import { Card } from "@/components/ui/card";
import { RouterOutputs } from "@/trpc/shared";
import { ColumnDef } from "@tanstack/react-table";
import { GerenciamentoRedeAddEspecialidade } from "./add-especialidade";

export const GerenciamentoRedeTableEspecialidades = ({
  especialidades,
}: {
  especialidades: RouterOutputs["hospitalManager"]["getEspecialidades"];
}) => {
  return (
    <DataTableProvider columns={columns} data={especialidades}>
      <div className="space-y-2">
        <div className="flex justify-between">
          <DataTableSearch />
          <GerenciamentoRedeAddEspecialidade />
        </div>
        <Card>
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
