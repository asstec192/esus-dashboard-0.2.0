import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SkeletonTable } from "@/components/skeletons/skeleton-table";
import { TableVehicles } from "../../components/tables/TableVehicles";
import { TableDestinations } from "../../components/tables/TableDestinations";
import { type NextPageWithLayout } from "../_app";
import { useState, type ReactElement } from "react";
import AnalyticsLayout from "@/components/layouts/analytics-layout";
import { useDestinationResponseTimeQuery } from "@/hooks/useDestinationResponseTimeQuery";
import { useIntercorrenciaCountQuery } from "@/hooks/useIntercorrenciaCountQuery";
import { TableIntercorrencias } from "@/components/tables/TableIntercorrencias";
import { useVehicleReportQuery } from "@/hooks/useVehicleReportQuery";
import { TurnSelect } from "@/components/select/select-turn";
import { DialogPDFViwer } from "@/components/dialogs/DialogPDF";
import { PDFRelatorioVeiculo } from "@/components/PDFTempoRespostaVeiculos";

const RegulacaoSecundaria: NextPageWithLayout = () => {
  const vehicleQuery = useVehicleReportQuery();
  const destinationQuery = useDestinationResponseTimeQuery();
  const intercorrenciaQuery = useIntercorrenciaCountQuery();
  const [selectedTab, setSelectedTab] = useState("veiculos");
  return (
    <Tabs
      defaultValue="veiculos"
      className="h-[calc(100%-2rem)]"
      onValueChange={setSelectedTab}
    >
      <div className="flex flex-wrap gap-3">
        <TabsList>
          <TabsTrigger value="veiculos">Veículos</TabsTrigger>
          <TabsTrigger value="destinos">Destinos</TabsTrigger>
          <TabsTrigger value="intercorrencias">Intercorrências</TabsTrigger>
        </TabsList>
        <TurnSelect />
        {selectedTab === "veiculos" && (
          <DialogPDFViwer>
            {vehicleQuery.data && (
              <PDFRelatorioVeiculo data={vehicleQuery.data} />
            )}
          </DialogPDFViwer>
        )}
      </div>
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
