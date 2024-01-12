"use client";

import { DataTable } from "@/components/table/DataTable";
import { DataTableProvider } from "@/components/table/DataTableProvider";
import { DataTablePagination } from "@/components/table/DataTablePagination";
import { Card } from "@/components/ui/card";
import { api } from "@/trpc/react";
import { ocorrenciaTableColumns } from "@/constants/ocorrenciaTableColumns";
import { ColumnDef } from "@tanstack/react-table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { RouterOutputs } from "@/trpc/shared";

export const MontitoramentoOcorrencias = ({
  initialData,
}: {
  initialData: RouterOutputs["incidents"]["getAllInProgress"];
}) => {
  const { data } = api.incidents.getAllInProgress.useQuery(undefined, {
    initialData,
    refetchInterval: 5000,
  });

  return (
    <DataTableProvider
      data={data}
      columns={ocorrenciaTableColumns as ColumnDef<OcorrenciaEmAndamento>[]}
    >
      <Card className="flex flex-grow flex-col overflow-hidden">
        <p className="bg-slate-100 p-2 text-center font-semibold">
          Ocorrências em Atendimento
        </p>
        <ScrollArea orientation="horizontal">
          <DataTable />
        </ScrollArea>
        <div className="mt-auto border border-transparent border-t-border py-3">
          <DataTablePagination />
        </div>
      </Card>
    </DataTableProvider>
  );
};
