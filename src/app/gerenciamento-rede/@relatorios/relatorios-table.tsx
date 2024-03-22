"use client";

import { useMemo } from "react";

import type { RouterOutputs } from "@/trpc/shared";
import type { ColumnDef } from "@tanstack/react-table";
import { DatePicker } from "@/components/date-pickers/date-picker";
import { DataTable } from "@/components/table/DataTable";
import { DataTablePagination } from "@/components/table/DataTablePagination";
import { DataTableProvider } from "@/components/table/DataTableProvider";
import { DataTableSearch } from "@/components/table/DataTableSearch";
import { Card } from "@/components/ui/card";
import { api } from "@/trpc/react";
import { useRelatoriosDateStore } from "../_useRelatoriosDateStore";
import { PDFRelatorioRede } from "./PDF/Link";
import { RelatorioDeleteModal } from "./relatorio-delete";
import { RelatorioFormModal } from "./relatorio-form-modal";
import { RelatorioView } from "./relatorio-view";

export function Relatorios({
  initialData,
}: {
  initialData: RouterOutputs["hospitalManager"]["obterRelatorios"];
}) {
  const date = useRelatoriosDateStore((state) => state.date);
  const setDate = useRelatoriosDateStore((state) => state.setDate);

  const { data: relatorios } = api.hospitalManager.obterRelatorios.useQuery(
    date,
    { initialData },
  );

  const columns = useMemo<
    ColumnDef<RouterOutputs["hospitalManager"]["obterRelatorios"][0]>[]
  >(
    () => [
      {
        accessorKey: "id",
        header: "#",
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
      {
        accessorKey: "actions",
        header: "Ações",
        cell: ({ row: { original: relatorio } }) => (
          <div className="flex gap-2">
            <RelatorioView relatorio={relatorio} />
            <RelatorioFormModal relatorioEditavel={relatorio} />
            <RelatorioDeleteModal relatorio={relatorio} />
          </div>
        ),
      },
      // ---------- Colunas Ocultas , somente para filtragem --------------- //
      {
        id: "equipamentos",
        accessorFn: ({ UnidadeRelatorioEquipamentos }) =>
          UnidadeRelatorioEquipamentos.map(
            (eqp) => eqp.equipamento.descricao,
          ).toString(),
        header: "",
        cell: "",
        meta: { className: "hidden" },
      },
      {
        id: "especialidades",
        accessorFn: ({ UnidadeRelatorioEspecialidades }) =>
          UnidadeRelatorioEspecialidades.map(
            (esp) => esp.especialidade.descricao,
          ).toString(),
        header: "",
        cell: "",
        meta: { className: "hidden" },
      },
    ],
    [],
  );

  return (
    <DataTableProvider columns={columns} data={relatorios || []}>
      <div className="mb-2 flex items-end gap-2">
        <DataTableSearch className="lg:w-[429px]" />
        <DatePicker
          date={date}
          className="h-8"
          onSelect={(value) => value && setDate(value)}
        />

        <PDFRelatorioRede />

        <RelatorioFormModal />
      </div>
      <Card className="mb-2 bg-background">
        <DataTable />
      </Card>
      <DataTablePagination />
    </DataTableProvider>
  );
}
