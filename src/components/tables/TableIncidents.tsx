import { useTable } from "@/hooks/useTable";
import { incidentTableColumns } from "@/utils/incidentTableColumns";
import { TableIncidentsToolBar } from "./TableIncidentsToolBar";
import { TablePagination } from "./TablePagination";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";
import { DataTable } from "./Table";

export const TableIncidents = ({ data }: { data: Ocorrencia[] }) => {
  const table = useTable({ columns: incidentTableColumns, data });
  return (
    <div className="flex flex-grow flex-col space-y-3 ">
      <TableIncidentsToolBar table={table} />
      <ScrollArea className="relative h-[500px] flex-grow rounded-lg border bg-card shadow-sm">
        <DataTable table={table} columns={incidentTableColumns} />
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
      <TablePagination table={table} />
    </div>
  );
};
