"use client";

import { api } from "@/trpc/react";
import { useGerenciamentoRedeRelatorioStore } from "../../stores";
import { useMemo } from "react";
import { RouterOutputs } from "@/trpc/shared";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { DataTableProvider } from "@/components/table/DataTableProvider";
import { DataTableSearch } from "@/components/table/DataTableSearch";
import { Plus } from "lucide-react";
import { DataTable } from "@/components/table/DataTable";
import { Card } from "@/components/ui/card";
import { DataTablePagination } from "@/components/table/DataTablePagination";
import { GerenciamentoRedeDialogRelatorio } from "./dialog.tsx";
import { DatePicker } from "@/components/date-pickers/date-picker";
import { GerenciamentoRedePDFRelatorios } from "./pdf";
import { PDFLink } from "@/components/PDF/link";

export function GerenciamentoRedeRelatorios() {
  const setModalOpen = useGerenciamentoRedeRelatorioStore(
    (state) => state.setOpen,
  );
  const setRelatorio = useGerenciamentoRedeRelatorioStore(
    (state) => state.setRelatorio,
  );
  const date = useGerenciamentoRedeRelatorioStore((state) => state.date);
  const setDate = useGerenciamentoRedeRelatorioStore((state) => state.setDate);

  const { data: relatorios } =
    api.hospitalManager.obterRelatorios.useQuery(date);

  const { data: hospitais } =
    api.hospitalManager.obterRelatoriosAgrupadosPorHospitais.useQuery(date);

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
      <div className="mb-2 flex items-end gap-2">
        <DataTableSearch />
        <DatePicker
          date={date}
          className="h-8"
          onSelect={(value) => value && setDate(value)}
        />
{/*         {hospitais && hospitais?.length > 0 && (
          <PDFLink
            className="h-8"
            document={
              <GerenciamentoRedePDFRelatorios
                hospitais={hospitais}
                date={date}
              />
            }
          />
        )} */}
        <Button className="ml-auto h-8 w-16" onClick={() => setModalOpen(true)}>
          <Plus />
        </Button>
      </div>
      <Card className="mb-2">
        <DataTable />
      </Card>
      <DataTablePagination />
      <GerenciamentoRedeDialogRelatorio />
    </DataTableProvider>
  );
}
