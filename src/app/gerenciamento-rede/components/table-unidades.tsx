import { DataTable } from "@/components/table/DataTable";
import { DataTableColumnHeader } from "@/components/table/DataTableColumnHeader";
import { DataTablePagination } from "@/components/table/DataTablePagination";
import { DataTableProvider } from "@/components/table/DataTableProvider";
import { DataTableSearch } from "@/components/table/DataTableSearch";
import { Card } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import { api } from "@/trpc/react";
import { RouterOutputs } from "@/trpc/shared";
import { ColumnDef } from "@tanstack/react-table";

type Hospital = RouterOutputs["destinations"]["getAll"][0];

export const GerenciamentoRedeUnidadesTable = () => {
  const { data } = api.destinations.getAll.useQuery(undefined, {
    onError: (error) => {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const columns: ColumnDef<Hospital>[] = [
    {
      accessorKey: "UnidadeCOD",
      header: ({ column }) => <DataTableColumnHeader column={column} title="ID" />,
    },
    {
      accessorKey: "UnidadeDS",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Título" />
      ),
    },
  ];

  return (
    <div className="space-y-2">
      <DataTableProvider columns={columns} data={data || []}>
        <DataTableSearch />
        <Card>
          <DataTable />
        </Card>
        <DataTablePagination />
      </DataTableProvider>
    </div>
  );
};
