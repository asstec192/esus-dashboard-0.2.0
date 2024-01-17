"use client";

import { DataTable } from "@/components/table/DataTable";
import { DataTableProvider } from "@/components/table/DataTableProvider";
import { DataTablePagination } from "@/components/table/DataTablePagination";
import { Card } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import { ocorrenciaTableColumns } from "@/constants/ocorrenciaTableColumns";
import { useGlogalDateFilterStore } from "@/hooks/useGlobalDateFilterStore";
import { api } from "@/trpc/react";
import { RegulacaoPrimariaTableToolbar } from "./table-tool-bar";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

export default function RegulacaoPrimaria() {
  const dateRange = useGlogalDateFilterStore((state) => state.dateRange);
  const { data, isLoading } = api.incidents.getAll.useQuery(
    {
      from: dateRange.from!,
      to: dateRange.to!,
    },
    {
      onError: (error) =>
        toast({ description: error.message, variant: "destructive" }),
    },
  );
  return (
    <main className="flex min-h-nav-offset flex-col px-1 py-4 sm:px-4">
      <DataTableProvider data={data || []} columns={ocorrenciaTableColumns}>
        <RegulacaoPrimariaTableToolbar />
        <Card className="mt-2 flex flex-grow flex-col justify-between overflow-hidden bg-background">
          <ScrollArea className="h-40 flex-grow">
            <DataTable isLoading={isLoading} />
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
          <div className="sticky bottom-0 border border-transparent border-t-border bg-background p-3">
            <DataTablePagination />
          </div>
        </Card>
      </DataTableProvider>
    </main>
  );
}
