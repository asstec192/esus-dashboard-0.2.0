import { ColumnDef } from "@tanstack/react-table";
import { Card } from "../ui/card";
import { TableColumnHeader } from "./TableColumnHeader";
import { DialogCreateSpecialties } from "../dialogs/DialogCreateSpecialties";
import { RouterOutputs } from "@/utils/api";
import { DataTableProvider } from "./DataTableContext";
import { DataTableSearch } from "./DataTableSearch";
import { DataTable } from "./DataTable";

export const TableHospitalSpecialties = ({
  especialidades,
}: {
  especialidades: RouterOutputs["hospitalManager"]["getSpecialties"];
}) => {
  return (
    <DataTableProvider columns={columns} data={especialidades}>
      <div className="space-y-2">
        <div className="flex justify-between">
          <DataTableSearch />
          <DialogCreateSpecialties />
        </div>
        <Card>
          <DataTable />
        </Card>
      </div>
    </DataTableProvider>
  );
};

const columns: ColumnDef<
  RouterOutputs["hospitalManager"]["getSpecialties"][0]
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
