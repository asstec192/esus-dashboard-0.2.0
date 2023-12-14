import { ColumnDef } from "@tanstack/react-table";
import { Card } from "../ui/card";
import { TableColumnHeader } from "./TableColumnHeader";
import { RouterOutputs } from "@/utils/api";
import { DataTableProvider } from "./DataTableContext";
import { DataTableSearch } from "./DataTableSearch";
import { DataTable } from "./DataTable";
import { DataTablePagination } from "./DataTablePagination";
import { InputAddEquipamento } from "../inputs/InputAddEquipamento";

export const TableHospitalEquipment = ({
  equipamentos,
}: {
  equipamentos: RouterOutputs["hospitalManager"]["getEquipamentos"];
}) => {
  return (
    <DataTableProvider columns={columns} data={equipamentos}>
      <div className="space-y-2">
        <div className="flex justify-between">
          <DataTableSearch />
          <InputAddEquipamento />
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
    header: ({ column }) => <TableColumnHeader column={column} title="ID" />,
  },
  {
    accessorKey: "descricao",
    header: ({ column }) => (
      <TableColumnHeader column={column} title="Título" />
    ),
  },
];
