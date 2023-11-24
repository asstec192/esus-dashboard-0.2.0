import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "./Table";
import { useTable } from "@/hooks/useTable";
import { Card } from "../ui/card";
import { TableColumnHeader } from "./TableColumnHeader";
import { TableSearch } from "./TableSearch";

export const TableHospitalEquipment = () => {
  const table = useTable({ columns, data });
  return (
    <div className="space-y-2">
      <TableSearch table={table} placeholder="Buscar" />
      <Card>
        <DataTable columns={columns} table={table} />
      </Card>
    </div>
  );
};

const data = [
  { nome: "DEA USB", id: "1" },
  { nome: "Desfibrilador USA", id: "2" },
  { nome: "ECG", id: "3" },
  { nome: "Endoscopia", id: "4" },
  { nome: "Incubadora USA", id: "5" },
  { nome: "Raio X", id: "6" },
  { nome: "Respirador USA", id: "7" },
  { nome: "Ressonância Magnética Nuclear", id: "8" },
  { nome: "Tele-ECG USA", id: "9" },
  { nome: "Tomografia", id: "10" },
  { nome: "Ultrassom", id: "11" },
];

const columns: ColumnDef<(typeof data)[0]>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => <TableColumnHeader column={column} title="ID" />,
  },
  {
    accessorKey: "nome",
    header: ({ column }) => (
      <TableColumnHeader column={column} title="Título" />
    ),
  },
];
