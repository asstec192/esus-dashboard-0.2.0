import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "./Table";
import { useTable } from "@/hooks/useTable";
import { TableColumnHeader } from "./TableColumnHeader";
import { TableSearch } from "./TableSearch";
import { RouterOutputs, api } from "@/utils/api";
import { toast } from "../ui/use-toast";
import { ScrollArea } from "../ui/scroll-area";
import { TablePagination } from "./TablePagination";
import { ProtectedAddButton } from "../buttons/ProtectedAddButon";

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
  const table = useTable({ columns, data: data || [] });
  return (
    <div className="space-y-2">
      <div className="flex items-end justify-between">
        <TableSearch table={table} placeholder="Buscar" />
        <ProtectedAddButton />
      </div>
      <ScrollArea
        orientation="horizontal"
        className="rounded-lg border bg-card shadow-sm"
      >
        <DataTable columns={columns} table={table} />
      </ScrollArea>
      <TablePagination table={table} />
    </div>
  );
};

type Hospital = RouterOutputs["destinations"]["getAll"][0];

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
