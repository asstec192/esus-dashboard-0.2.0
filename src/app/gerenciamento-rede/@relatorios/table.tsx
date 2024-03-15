"use client";

import { api } from "@/trpc/react";
import { useGerenciamentoRedeRelatorioStore } from "../stores";
import { useMemo } from "react";
import type { RouterOutputs } from "@/trpc/shared";
import type { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { DataTableSearch } from "@/components/table/DataTableSearch";
import { Pencil, Plus } from "lucide-react";
import { DataTable } from "@/components/table/DataTable";
import { Card } from "@/components/ui/card";
import { DataTablePagination } from "@/components/table/DataTablePagination";
import { DatePicker } from "@/components/date-pickers/date-picker";
import { DataTableProvider } from "@/components/table/DataTableProvider";
import Link from "next/link";
import { PDFRelatorioRede } from "./PDF/Link";
import { RelatorioDeleteModal } from "./relatorio-delete-modal";

export function Relatorios({
  initialData,
}: {
  initialData: RouterOutputs["hospitalManager"]["obterRelatorios"];
}) {
  const date = useGerenciamentoRedeRelatorioStore((state) => state.date);
  const setDate = useGerenciamentoRedeRelatorioStore((state) => state.setDate);
  const setRelatorio = useGerenciamentoRedeRelatorioStore(
    (state) => state.setRelatorio,
  );

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
        cell: ({ row }) => (
          <div className="flex gap-2">
            <Button
              asChild
              variant="secondary"
              onClick={() => setRelatorio(row.original)}
            >
              <Link
                href={{
                  query: {
                    isRelatorioOpen: true,
                    relatorioId: row.original.id,
                  },
                }}
                prefetch={false}
                scroll={false}
              >
                <Pencil className="w-4" />
              </Link>
            </Button>
            <RelatorioDeleteModal relatorio={row.original} />
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
    [setRelatorio],
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

        <Button asChild className="ml-auto h-8 w-16">
          <Link href={{ query: { isRelatorioOpen: true } }} scroll={false}>
            <Plus />
          </Link>
        </Button>
      </div>
      <Card className="mb-2 bg-background">
        <DataTable />
      </Card>
      <DataTablePagination />
    </DataTableProvider>
  );
}
