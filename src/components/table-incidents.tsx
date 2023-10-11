import { Ocorrencia } from "@/lib/ocorrencias";
import { DataTable } from "./table/table";
import { useTable } from "@/hooks/useTable";
import { incidentTableColumns } from "@/utils/incidentTableColumns";
import { ProtectedDialogIncident } from "./dialog-incident";
import { TableIncidentsToolBar } from "./table-incidents-toolbar";
import { TablePagination } from "./table/table-pagination";
import { ScrollArea, ScrollBar } from "./ui/scroll-area";

export const IncidentTable = ({ data }: { data: Ocorrencia[] }) => {
  const table = useTable({ columns: incidentTableColumns, data });
  return (
    <div className="flex flex-grow flex-col space-y-3 ">
      <TableIncidentsToolBar table={table} />
      <ScrollArea className="relative h-[500px] flex-grow rounded-lg border bg-card shadow-sm">
        <DataTable table={table} columns={incidentTableColumns} />
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
      <TablePagination table={table} />
      <ProtectedDialogIncident />
    </div>
  );
};
