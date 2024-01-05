"use client";

import { api } from "@/trpc/react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RegulacaoSecundariaIntercorrencias } from "./components/intercorrencias";
import { RegulacaoSecundariaOcorrencias } from "./components/dialog-ocorrencias";
import { RegulacaoSecundariaUnidadesDestino } from "./components/unidades-destino";
import { RegulacaoSecundariaSelectTurno } from "./components/select-turno";
import { RegulacaoSecundariaVeiculos } from "./components/veiculos";
import { PDFRelatorioVeiculo } from "./components/pdf-relatorio-veiculos";

import {
  DateRange,
  useGlogalDateFilterStore,
} from "@/hooks/useGlobalDateFilterStore";
import { PDFLink } from "@/components/PDF/link";
import { useState } from "react";
import { useTurnStore } from "./stores";
import { PDFModal } from "@/components/PDF/modal";
import { differenceInDays } from "date-fns";

export default function RegulacaoSecundaria() {
  const [currentTab, setCurrentTab] = useState("veiculos");
  const turn = useTurnStore((state) => state.turn);
  const dateRange = useGlogalDateFilterStore(
    (state) => state.dateRange,
  ) as DateRange;

  const veiculosQuery = api.vehicles.getReport.useQuery({
    dateRange,
    turn,
  });

  const unidadeDestinoQuery = api.destinations.getResponseTimes.useQuery({
    dateRange,
    turn,
  });

  const intercorrenciasQuery = api.intercorrencia.countIncidents.useQuery({
    dateRange,
    turn,
  });

  return (
    <div className="min-h-nav-offset flex flex-col px-1 py-4 sm:px-4">
      <Tabs defaultValue="veiculos" onValueChange={setCurrentTab}>
        <div className="flex flex-wrap gap-2">
          <TabsList className="w-full sm:w-auto">
            <TabsTrigger className="flex-grow sm:flex-grow-0" value="veiculos">
              Veículos
            </TabsTrigger>
            <TabsTrigger className="flex-grow sm:flex-grow-0" value="destinos">
              Destinos
            </TabsTrigger>
            <TabsTrigger
              className="flex-grow sm:flex-grow-0"
              value="intercorrencias"
            >
              Intercorrências
            </TabsTrigger>
          </TabsList>
          <RegulacaoSecundariaSelectTurno />
          {currentTab === "veiculos" &&
            veiculosQuery.data &&
            differenceInDays(dateRange.to, dateRange.from) <= 1 && (
              <PDFModal>
                <PDFRelatorioVeiculo
                  data={veiculosQuery.data}
                  dateRange={dateRange}
                  turn={turn}
                />
              </PDFModal>
            )}
        </div>

        <TabsContent value="veiculos">
          <RegulacaoSecundariaVeiculos
            data={veiculosQuery.data || []}
            isLoading={veiculosQuery.isLoading}
          />
        </TabsContent>

        <TabsContent value="destinos">
          <RegulacaoSecundariaUnidadesDestino
            data={unidadeDestinoQuery.data || []}
            isLoading={unidadeDestinoQuery.isLoading}
          />
        </TabsContent>

        <TabsContent value="intercorrencias">
          <RegulacaoSecundariaIntercorrencias
            data={intercorrenciasQuery.data || []}
            isLoading={intercorrenciasQuery.isLoading}
          />
        </TabsContent>
      </Tabs>
      <RegulacaoSecundariaOcorrencias />
    </div>
  );
}
