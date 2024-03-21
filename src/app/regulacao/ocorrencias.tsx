"use client";

import { useState } from "react";

import type { DateRange } from "@/hooks/useGlobalDateFilterStore";
import { DataTable } from "@/components/table/DataTable";
import { DataTablePagination } from "@/components/table/DataTablePagination";
import { DataTableProvider } from "@/components/table/DataTableProvider";
import { DataTableSearch } from "@/components/table/DataTableSearch";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import { ocorrenciaTableColumns } from "@/constants/ocorrenciaTableColumns";
import { useGlogalDateFilterStore } from "@/hooks/useGlobalDateFilterStore";
import { api } from "@/trpc/react";
import { RegulacaoPrimariaTableToolbar } from "./ocorrencias-filters";

export function RegulacaoOcorrencias() {
  const [isChecked, setIsChecked] = useState(true);

  const dateRange = useGlogalDateFilterStore(
    (state) => state.dateRange,
  ) as DateRange;

  const { data, isLoading } = api.ocorrencias.getAll.useQuery(
    {
      dateRange,
      emAtendimento: isChecked,
    },
    {
      refetchInterval: isChecked ? 5000 : undefined,
    },
  );

  return (
    <DataTableProvider data={data ?? []} columns={ocorrenciaTableColumns}>
      <div className="flex w-full flex-col gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <DataTableSearch />
          <RegulacaoPrimariaTableToolbar />
          <Label htmlFor="em-atendimento" className="ml-auto">
            Em atendimento
          </Label>
          <Switch
            checked={isChecked}
            onCheckedChange={setIsChecked}
            id="em-atendimento"
          />
        </div>
        <Card className="flex flex-grow flex-col justify-between overflow-hidden bg-background">
          <ScrollArea className="h-40 min-h-[70vh] flex-grow">
            <DataTable isLoading={isLoading} />
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
          <div className="sticky bottom-0 border border-transparent border-t-border bg-background p-3">
            <DataTablePagination />
          </div>
        </Card>
      </div>
    </DataTableProvider>
  );
}
