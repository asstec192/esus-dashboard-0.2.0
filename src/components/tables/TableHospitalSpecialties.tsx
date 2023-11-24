import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "./Table";
import { useTable } from "@/hooks/useTable";
import { Card } from "../ui/card";
import { TableColumnHeader } from "./TableColumnHeader";
import { TableSearch } from "./TableSearch";

export const TableHospitalSpecialties = () => {
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
  { nome: "Anestesiologista", id: "1" },
  { nome: "Cardiologista", id: "2" },
  { nome: "Chefe de Equipe Hospitalar", id: "3" },
  { nome: "Cirurgia Bucomaxilofacial", id: "4" },
  { nome: "Cirurgia Geral", id: "5" },
  { nome: "Cirurgia Pediátrica", id: "6" },
  { nome: "Cirurgia Plástica", id: "7" },
  { nome: "Cirurgia Vascular", id: "8" },
  { nome: "Clinica Medica", id: "9" },
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
