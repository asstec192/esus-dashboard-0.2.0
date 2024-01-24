import { DataTableProvider } from "@/components/table/DataTableProvider";
import { DataTable } from "@/components/table/DataTable";
import { DataTablePagination } from "@/components/table/DataTablePagination";
import { DataTableSearch } from "@/components/table/DataTableSearch";
import { Card } from "@/components/ui/card";
import { RouterOutputs } from "@/trpc/shared";
import { ColumnDef } from "@tanstack/react-table";
import { api } from "@/trpc/server";

type Hospital = RouterOutputs["destinos"]["getAll"][0];

export default async function GerenciamentoRedeHospitaisPage() {
  const hospitais = await api.destinos.getAll.query();
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
    header: "ID",
  },
  {
    accessorKey: "UnidadeDS",
    header: "Unidade",
  },
];
