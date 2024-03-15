"use client";

import { DataTable } from "@/components/table/DataTable";
import { DataTableProvider } from "@/components/table/DataTableProvider";
import { DataTablePagination } from "@/components/table/DataTablePagination";
import { Card } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

import {
  type DateRange,
  useGlogalDateFilterStore,
} from "@/hooks/useGlobalDateFilterStore";
import { api } from "@/trpc/react";

import { RegulacaoPrimariaTableToolbar } from "./ocorrencias-filters";
import { ocorrenciaTableColumns } from "@/constants/ocorrenciaTableColumns";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { DataTableSearch } from "@/components/table/DataTableSearch";

export function RegulacaoOcorrencias() {
  const [checked, setChecked] = useState(true);

  const dateRange = useGlogalDateFilterStore(
    (state) => state.dateRange,
  ) as DateRange;

  const { data, isLoading } = api.ocorrencias.getAll.useQuery({
    dateRange,
    emAtendimento: checked,
  });

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
            checked={checked}
            onCheckedChange={setChecked}
            id="em-atendimento"
          />
        </div>
        <Card className="flex flex-grow flex-col justify-between overflow-hidden bg-background">
          <ScrollArea className="h-40 flex-grow">
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