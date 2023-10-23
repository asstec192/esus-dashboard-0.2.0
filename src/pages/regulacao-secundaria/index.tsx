import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SkeletonTable } from "@/components/skeletons/skeleton-table";
import { TableVehicles } from "../../components/tables/TableVehicles";
import { TableDestinations } from "../../components/tables/TableDestinations";
import { type NextPageWithLayout } from "../_app";
import { type ReactElement } from "react";
import AnalyticsLayout from "@/components/layouts/analytics-layout";
import { useDestinationResponseTimeQuery } from "@/hooks/useDestinationResponseTimeQuery";
import { useIntercorrenciaCountQuery } from "@/hooks/useIntercorrenciaCountQuery";
import { TableIntercorrencias } from "@/components/tables/TableIntercorrencias";
import { useVehicleResponseTimeQuery } from "@/hooks/useVehicleResponseTimeQuery";

const RegulacaoSecundaria: NextPageWithLayout = () => {
  const vehicleQuery = useVehicleResponseTimeQuery();
  const destinationQuery = useDestinationResponseTimeQuery();
  const intercorrenciaQuery = useIntercorrenciaCountQuery();
  return (
    <Tabs defaultValue="veiculos" className="h-[calc(100%-2rem)]">
      <TabsList>
        <TabsTrigger value="veiculos">Veículos</TabsTrigger>
        <TabsTrigger value="destinos">Destinos</TabsTrigger>
        <TabsTrigger value="intercorrencias">Intercorrências</TabsTrigger>
      </TabsList>
      <TabsContent className="h-[calc(100%-4rem)]" value="veiculos">
        {vehicleQuery.isLoading || vehicleQuery.isError ? (
          <div className="relative h-full flex-1 overflow-y-auto rounded-md border">
            <SkeletonTable className="h-full" />
          </div>
        ) : (
          <TableVehicles data={vehicleQuery.data} />
        )}
      </TabsContent>
      <TabsContent className="h-[calc(100%-4rem)]" value="destinos">
        {destinationQuery.isLoading || destinationQuery.isError ? (
          <div className="relative h-full flex-1 overflow-y-auto rounded-md border">
            <SkeletonTable className="h-full" />
          </div>
        ) : (
          <TableDestinations data={destinationQuery.data} />
        )}
      </TabsContent>
      <TabsContent className="h-[calc(100%-4rem)]" value="intercorrencias">
        {intercorrenciaQuery.isLoading || intercorrenciaQuery.isError ? (
          <div className="relative h-full flex-1 overflow-y-auto rounded-md border">
            <SkeletonTable className="h-full" />
          </div>
        ) : (
          <TableIntercorrencias data={intercorrenciaQuery.data} />
        )}
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
