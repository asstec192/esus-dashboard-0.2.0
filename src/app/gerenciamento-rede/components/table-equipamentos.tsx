import { DataTableProvider } from "@/components/table/DataTableProvider";
import { DataTableSearch } from "@/components/table/DataTableSearch";
import { RouterOutputs } from "@/trpc/shared";
import { GerenciamentoRedeAddEquipamento } from "./add-equipamento";
import { Card } from "@/components/ui/card";
import { DataTable } from "@/components/table/DataTable";
import { DataTablePagination } from "@/components/table/DataTablePagination";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/table/DataTableColumnHeader";

export const GerenciamentoRedeTableEquipamentos = ({
  equipamentos,
}: {
  equipamentos: RouterOutputs["hospitalManager"]["getEquipamentos"];
}) => {
  return (
    <DataTableProvider columns={columns} data={equipamentos}>
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
};

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
