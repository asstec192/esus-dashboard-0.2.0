import { RouterOutputs, api } from "@/utils/api";
import { DataTable } from "./DataTable";
import { DataTableSearch } from "./DataTableSearch";
import { DataTablePagination } from "./DataTablePagination";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableProvider } from "./DataTableContext";
import { useMemo } from "react";
import {
  DialogFormRelatorioUnidade,
  useDialogFormRelatorioUnidadeStore,
} from "../dialogs/DialogFormRelatorioUnidade";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";
import { Card } from "../ui/card";
import { DatePicker } from "../date-picker/date-picker";

export function TableRelatoriosRedeHospitalar() {
  const setModalOpen = useDialogFormRelatorioUnidadeStore(
    (state) => state.setOpen,
  );
  const setRelatorio = useDialogFormRelatorioUnidadeStore(
    (state) => state.setRelatorio,
  );
  const date = useDialogFormRelatorioUnidadeStore((state) => state.date);
  const setDate = useDialogFormRelatorioUnidadeStore((state) => state.setDate);

  const { data: relatorios } =
    api.hospitalManager.obterRelatorios.useQuery(date);

  const columns = useMemo<
    ColumnDef<RouterOutputs["hospitalManager"]["obterRelatorios"][0]>[]
  >(
    () => [
      {
        accessorKey: "id",
        header: "#",
        cell: ({ row }) => (
          <Button
            variant="ghost"
            className="absolute left-0 top-0 w-full justify-start hover:bg-transparent"
            onClick={() => {
              setModalOpen(true);
              setRelatorio(row.original);
            }}
          >
            {row.original.id}
          </Button>
        ),
      },
      {
        accessorKey: "unidade.UnidadeDS",
        header: "Unidade",
      },
      {
        accessorKey: "criadoPor.operador.OperadorNM",
        header: "Criado por",
      },
      {
        accessorKey: "turno",
        header: "Turno",
      },
      {
        accessorKey: "createdAt",
        header: "Data",
        cell: ({ row }) => row.original.createdAt.toLocaleString(),
      },
    ],
    [],
  );

  return (
    <DataTableProvider columns={columns} data={relatorios || []}>
      <div className="mb-2 flex gap-2">
        <DataTableSearch />
        <DatePicker
          date={date}
          className="h-8"
          onSelect={(value) => value && setDate(value)}
        />
        <Button className="ml-auto h-8 w-16" onClick={() => setModalOpen(true)}>
          <Plus />
        </Button>
      </div>
      <Card className="mb-2">
        <DataTable />
      </Card>
      <DataTablePagination />
      <DialogFormRelatorioUnidade />
    </DataTableProvider>
  );
}
