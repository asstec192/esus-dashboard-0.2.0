import { DataTable } from "@/components/tables/Table";
import { TablePagination } from "@/components/tables/TablePagination";
import { useTable } from "@/hooks/useTable";
import { TypographyH4 } from "@/components/typography/TypographyH4";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Ocorrencia } from "@/lib/ocorrencias";
import { incidentTableColumns } from "@/utils/incidentTableColumns";
import { ProtectedDialogIncident } from "@/components/dialog-incident";
import { TableIncidentsToolBar } from "./table-incidents-toolbar";

export const UserIncidents = ({ data }: { data: Ocorrencia[] }) => {
  const table = useTable({ columns: incidentTableColumns, data });
  return (
    <div className="flex h-[calc(100vh-var(--nav))] flex-col space-y-3">
      <TypographyH4>Minhas Ocorrências</TypographyH4>
      <TableIncidentsToolBar table={table} />
      <ScrollArea className="flex-grow rounded-lg border bg-card shadow-sm">
        <DataTable columns={incidentTableColumns} table={table} />
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
      <TablePagination table={table} />
      <ProtectedDialogIncident />
    </div>
  );
};
