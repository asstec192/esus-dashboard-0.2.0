"use client";

import { api } from "@/trpc/react";
import { useGerenciamentoRedeRelatorioStore } from "../stores";
import { useMemo } from "react";
import { RouterOutputs } from "@/trpc/shared";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { DataTableSearch } from "@/components/table/DataTableSearch";
import { Plus } from "lucide-react";
import { DataTable } from "@/components/table/DataTable";
import { Card } from "@/components/ui/card";
import { DataTablePagination } from "@/components/table/DataTablePagination";
import { DatePicker } from "@/components/date-pickers/date-picker";
import { DataTableProvider } from "@/components/table/DataTableProvider";
import Link from "next/link";

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
        cell: ({ row }) => (
          <Button
            asChild
            variant="ghost"
            className="absolute left-0 top-0 w-full justify-start hover:bg-transparent"
            onClick={() => setRelatorio(row.original)}
          >
            <Link href="/gerenciamento-rede/relatorio" scroll={false}>
              {row.original.id}
            </Link>
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
        <Button asChild className="ml-auto h-8 w-16">
          <Link href="gerenciamento-rede/relatorio" scroll={false}>
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
