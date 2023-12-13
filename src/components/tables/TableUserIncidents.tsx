import { TypographyH4 } from "@/components/typography/TypographyH4";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { incidentTableColumns } from "@/utils/incidentTableColumns";
import { TableIncidentsToolBar } from "./TableIncidentsToolBar";
import { Card } from "../ui/card";
import { DataTable } from "./DataTable";
import { DataTableProvider } from "./DataTableContext";
import { DataTablePagination } from "./DataTablePagination";

export const TableUserIncidents = ({ data }: { data: Ocorrencia[] }) => {
  return (
    <DataTableProvider columns={incidentTableColumns} data={data}>
      <div className="flex h-[calc(100vh-var(--nav))] flex-col space-y-3">
        <TypographyH4>Minhas Ocorrências</TypographyH4>
        <TableIncidentsToolBar />
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
