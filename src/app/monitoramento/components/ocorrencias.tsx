"use client";

import { DataTable } from "@/components/table/DataTable";
import { DataTableProvider } from "@/components/table/DataTableProvider";
import { DataTablePagination } from "@/components/table/DataTablePagination";
import { Card } from "@/components/ui/card";
import { api } from "@/trpc/react";
import { ocorrenciaTableColumns } from "@/constants/ocorrenciaTableColumns";
import { ColumnDef } from "@tanstack/react-table";
import { RouterOutputs } from "@/trpc/shared";

export const MontitoramentoOcorrencias = ({
  initialData,
}: {
  initialData: RouterOutputs["ocorrencias"]["getAllInProgress"];
}) => {
  const { data } = api.ocorrencias.getAllInProgress.useQuery(undefined, {
    initialData,
    refetchInterval: 5000,
  });

  return (
    <DataTableProvider
      data={data}
      columns={
        ocorrenciaTableColumns as ColumnDef<
          Omit<Ocorrencia, "data" | "pacientes">
        >[]
      }
    >
      <Card className="flex h-[calc(100vh-13rem)] flex-grow flex-col overflow-hidden bg-background">
        <p className="bg-slate-100 p-2 text-center font-semibold dark:bg-card">
          Ocorrências em Atendimento
        </p>
        <DataTable />
        <div className="mt-auto border border-transparent border-t-border p-3">
          <DataTablePagination />
        </div>
      </Card>
    </DataTableProvider>
  );
};
