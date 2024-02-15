"use client";

import { DataTableProvider } from "@/components/table/DataTableProvider";
import { TypographyH4 } from "@/components/typography/TypographyH4";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { DataTable } from "@/components/table/DataTable";
import { Card } from "@/components/ui/card";
import { DataTablePagination } from "@/components/table/DataTablePagination";
import { ocorrenciaTableColumns } from "@/constants/ocorrenciaTableColumns";
import { RegulacaoPrimariaTableToolbar } from "../(date-range-layout)/regulacao/primaria/table-tool-bar";

export const UserIncidents = ({ data }: { data: Ocorrencia[] }) => {
  return (
    <DataTableProvider columns={ocorrenciaTableColumns} data={data}>
      <div className="flex h-[calc(100vh-var(--nav))] flex-col space-y-3">
        <TypographyH4>Minhas Ocorrências</TypographyH4>
        <RegulacaoPrimariaTableToolbar />
        <Card className="flex flex-col">
          <ScrollArea className="flex-grow">
            <DataTable />
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </Card>
        <DataTablePagination />
      </div>
    </DataTableProvider>
  );
};
