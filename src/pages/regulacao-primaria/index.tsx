import { ReactElement } from "react";
import { Show } from "@/components/flow/show";
import TableIncidentsLoading from "../../components/skeletons/skeleton-table-incident";
import { type NextPageWithLayout } from "../_app";
import AnalyticsLayout from "@/components/layouts/analytics-layout";
import { TableIncidents } from "@/components/tables/TableIncidents";
import { api } from "@/utils/api";
import {
  DateRange,
  useGlogalDateFilterStore,
} from "@/hooks/useGlobalDateFilterStore";

const Page: NextPageWithLayout = () => {
  const dateRange = useGlogalDateFilterStore(
    (state) => state.dateRange,
  ) as DateRange;
  const { data, isLoading, isError } =
    api.incidents.getAll.useQuery(dateRange);

  return (
    <Show when={isLoading || isError} fallback={<TableIncidentsLoading />}>
      <TableIncidents data={data!} />
    </Show>
  );
};

Page.getLayout = (page: ReactElement) => {
  return (
    <AnalyticsLayout pageTitle="Regulação Primária">{page}</AnalyticsLayout>
  );
};

export default Page;
