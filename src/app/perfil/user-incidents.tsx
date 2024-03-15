"use client";

import { DataTable } from "@/components/table/DataTable";
import { DataTablePagination } from "@/components/table/DataTablePagination";
import { DataTableProvider } from "@/components/table/DataTableProvider";
import { DataTableSearch } from "@/components/table/DataTableSearch";
import { TypographyH4 } from "@/components/typography/TypographyH4";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { ocorrenciaTableColumns } from "@/constants/ocorrenciaTableColumns";
import { RegulacaoPrimariaTableToolbar } from "../regulacao/ocorrencias-filters";

export const UserIncidents = ({ data }: { data: Ocorrencia[] }) => {
  return (
    <DataTableProvider columns={ocorrenciaTableColumns} data={data}>
      <div className="flex h-[calc(100vh-6rem)] flex-col space-y-3">
        <TypographyH4>Minhas Ocorrências</TypographyH4>
        <div className="flex flex-wrap gap-2">
          <DataTableSearch />
          <RegulacaoPrimariaTableToolbar />
        </div>

        <ScrollArea className="flex-grow rounded border ">
          <DataTable />
          <ScrollBar orientation="horizontal" />
        </ScrollArea>

        <DataTablePagination />
      </div>
    </DataTableProvider>
  );
};
