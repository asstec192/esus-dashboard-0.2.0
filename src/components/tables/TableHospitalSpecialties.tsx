import { ColumnDef } from "@tanstack/react-table";
import { Card } from "../ui/card";
import { TableColumnHeader } from "./TableColumnHeader";
import { RouterOutputs } from "@/utils/api";
import { DataTableProvider } from "./DataTableContext";
import { DataTableSearch } from "./DataTableSearch";
import { DataTable } from "./DataTable";
import { InputAddEspecialidade } from "../inputs/InputAddEspecialidade";
import { DataTablePagination } from "./DataTablePagination";

export const TableHospitalSpecialties = ({
  especialidades,
}: {
  especialidades: RouterOutputs["hospitalManager"]["getEspecialidades"];
}) => {
  return (
    <DataTableProvider columns={columns} data={especialidades}>
      <div className="space-y-2">
        <div className="flex justify-between">
          <DataTableSearch />
          <InputAddEspecialidade />
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
    header: ({ column }) => <TableColumnHeader column={column} title="ID" />,
  },
  {
    accessorKey: "descricao",
    header: ({ column }) => (
      <TableColumnHeader column={column} title="Título" />
    ),
  },
];
