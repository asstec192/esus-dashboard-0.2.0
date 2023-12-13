import { ReactElement } from "react";
import { Show } from "@/components/flow/show";
import TableIncidentsLoading from "../../components/skeletons/skeleton-table-incident";
import { type NextPageWithLayout } from "../_app";
import AnalyticsLayout from "@/components/layouts/analytics-layout";
import { api } from "@/utils/api";
import {
  DateRange,
  useGlogalDateFilterStore,
} from "@/hooks/useGlobalDateFilterStore";
import { DataTableProvider } from "@/components/tables/DataTableContext";
import { incidentTableColumns } from "@/utils/incidentTableColumns";
import { DataTableSearch } from "@/components/tables/DataTableSearch";
import { DataTable } from "@/components/tables/DataTable";
import { DataTablePagination } from "@/components/tables/DataTablePagination";
import { TableIncidentsToolBar } from "@/components/tables/TableIncidentsToolBar";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";

const Page: NextPageWithLayout = () => {
  const dateRange = useGlogalDateFilterStore(
    (state) => state.dateRange,
  ) as DateRange;
  const { data, isLoading, isError } = api.incidents.getAll.useQuery(dateRange);

  if (isError || isLoading) {
    return <TableIncidentsLoading />;
  }

  return (
    <DataTableProvider columns={incidentTableColumns} data={data}>
      <div className="space-y-2">
        <TableIncidentsToolBar />
        <Card>
          <ScrollArea className="relative h-[500px] flex-grow">
            <DataTable />
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </Card>
        <DataTablePagination />
      </div>
    </DataTableProvider>
  );
};

Page.getLayout = (page: ReactElement) => {
  return (
    <AnalyticsLayout pageTitle="Regulação Primária">{page}</AnalyticsLayout>
  );
};

export default Page;
