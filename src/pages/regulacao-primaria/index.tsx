import { Show } from "@/components/flow/show";
import IncidentTableLoading from "../../components/skeletons/skeleton-table-incident";
import { type NextPageWithLayout } from "../_app";
import AnalyticsLayout from "@/components/layouts/analytics-layout";
import { useEffect, type ReactElement } from "react";
import { useIncidentQuery } from "@/hooks/useIncidentQuery";
import { IncidentTable } from "@/components/table-incidents";

const Page: NextPageWithLayout = () => {
  const { data, isLoading, isError } = useIncidentQuery();

  useEffect(() => console.log(data), [data]);

  return (
    <Show when={isLoading || isError} fallback={<IncidentTableLoading />}>
      <IncidentTable data={data!} />
    </Show>
  );
};

Page.getLayout = (page: ReactElement) => {
  return (
    <AnalyticsLayout pageTitle="Regulação Primária">{page}</AnalyticsLayout>
  );
};

export default Page;
