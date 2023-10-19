import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Show } from "@/components/flow/show";
import { SkeletonTable } from "@/components/skeletons/skeleton-table";
import { TableVehicle } from "../../components/table-vehicle";
import { TableHospital } from "../../components/table-hospital";
import { type NextPageWithLayout } from "../_app";
import { type ReactElement } from "react";
import AnalyticsLayout from "@/components/layouts/analytics-layout";
import { useDestinyQuery } from "@/hooks/useDestinyQuery";
import { useVehicleQuery } from "@/hooks/useVehicleQuery";
import { isWithinHourInterval } from "@/utils/isWithinHourInterval";

const RegulacaoSecundaria: NextPageWithLayout = () => {
  const vehicleQuery = useVehicleQuery();
  const destinyQuery = useDestinyQuery();
  const date = new Date().setHours(1, 0, 0, 0);
  isWithinHourInterval(new Date(date), 1, 7);
  return (
    <Tabs defaultValue="veiculos" className="h-[calc(100%-2rem)]">
      <TabsList>
        <TabsTrigger value="veiculos">Veículos</TabsTrigger>
        <TabsTrigger value="destinos">Destinos</TabsTrigger>
      </TabsList>
      <TabsContent className="h-[calc(100%-4rem)]" value="veiculos">
        <Show
          when={vehicleQuery.isLoading}
          fallback={
            <div className="relative h-full flex-1 overflow-y-auto rounded-md border">
              <SkeletonTable className="h-full" />
            </div>
          }
        >
          <TableVehicle data={vehicleQuery.data!} />
        </Show>
      </TabsContent>
      <TabsContent className="h-[calc(100%-4rem)]" value="destinos">
        <Show
          when={destinyQuery.isLoading}
          fallback={
            <div className="relative h-full flex-1 overflow-y-auto rounded-md border">
              <SkeletonTable className="h-full" />
            </div>
          }
        >
          <TableHospital data={destinyQuery.data!} />
        </Show>
      </TabsContent>
    </Tabs>
  );
};

RegulacaoSecundaria.getLayout = (page: ReactElement) => {
  return (
    <AnalyticsLayout pageTitle="Regulação Secundária">{page}</AnalyticsLayout>
  );
};

export default RegulacaoSecundaria;
