import { ColumnDef } from "@tanstack/react-table";
import { TableColumnHeader } from "./TableColumnHeader";
import { RouterOutputs, api } from "@/utils/api";
import { toast } from "../ui/use-toast";
import { DataTableProvider } from "./DataTableContext";
import { DataTable } from "./DataTable";
import { DataTableSearch } from "./DataTableSearch";
import { DataTablePagination } from "./DataTablePagination";
import { Card } from "../ui/card";

type Hospital = RouterOutputs["destinations"]["getAll"][0];

export const TableHospitals = () => {
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
      header: ({ column }) => <TableColumnHeader column={column} title="ID" />,
    },
    {
      accessorKey: "UnidadeDS",
      header: ({ column }) => (
        <TableColumnHeader column={column} title="Título" />
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
