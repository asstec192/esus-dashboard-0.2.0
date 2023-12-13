import { ColumnDef } from "@tanstack/react-table";
import { Card } from "../ui/card";
import { TableColumnHeader } from "./TableColumnHeader";
import { DialogAddEquipamento } from "../dialogs/DialogAddEquipamento";
import { RouterOutputs } from "@/utils/api";
import { DataTableProvider } from "./DataTableContext";
import { DataTableSearch } from "./DataTableSearch";
import { DataTable } from "./DataTable";

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
          <DialogAddEquipamento />
        </div>
        <Card>
          <DataTable />
        </Card>
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
