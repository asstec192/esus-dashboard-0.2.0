import { DropdownAdminActions } from "@/components/dropdowns/DropdownAdminActions";
import { Card } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import { RouterOutputs, api } from "@/utils/api";
import { SkeletonTable } from "../skeletons/skeleton-table";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableProvider } from "./DataTableContext";
import { DataTableSearch } from "./DataTableSearch";
import { DataTable } from "./DataTable";
import { DataTablePagination } from "./DataTablePagination";
import { formatProperName } from "@/utils/formatProperName";

export const TableUsers = () => {
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

  if (isLoading || isError) return <SkeletonTable className="h-[600px]" />;

  return (
    <DataTableProvider columns={columns} data={users}>
      <div className="space-y-2">
        <DataTableSearch />
        <Card>
          <DataTable />
        </Card>
        <DataTablePagination />
      </div>
    </DataTableProvider>
  );
};

const columns: ColumnDef<RouterOutputs["users"]["getAll"][0]>[] = [
  {
    accessorKey: "operador.OperadorNM",
    header: "Nome",
    cell: ({ row }) => formatProperName(row.original.operador?.OperadorNM),
  },
  {
    accessorKey: "operador.OperadorApelido",
    header: "Apelido",
  },
  {
    accessorKey: "role",
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
    cell: ({ row }) => <DropdownAdminActions user={row.original} />,
  },
];
