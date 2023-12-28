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
import { date } from "zod";

export default function RegulacaoSecundaria() {
  const [currentTab, setCurrentTab] = useState("veiculos");
  const turn = useTurnStore((state) => state.turn);
  const dateRange = useGlogalDateFilterStore(
    (state) => state.dateRange,
  ) as DateRange;

  const { data: temposVeiculos } = api.vehicles.getReport.useQuery({
    dateRange,
    turn,
  });

  const { data: temposUnidadeDestino } =
    api.destinations.getResponseTimes.useQuery({
      dateRange,
      turn,
    });

  const { data: intercorrencias } = api.intercorrencia.countIncidents.useQuery({
    dateRange,
    turn,
  });

  return (
    <div className="flex min-h-nav-offset flex-col px-1 py-4 sm:px-4">
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
          {currentTab === "veiculos" && temposVeiculos && (
            <PDFLink
              document={
                <PDFRelatorioVeiculo
                  data={temposVeiculos}
                  dateRange={dateRange}
                  turn={turn}
                />
              }
            />
          )}
        </div>

        <TabsContent value="veiculos">
          <RegulacaoSecundariaVeiculos data={temposVeiculos || []} />
        </TabsContent>

        <TabsContent value="destinos">
          <RegulacaoSecundariaUnidadesDestino
            data={temposUnidadeDestino || []}
          />
        </TabsContent>

        <TabsContent value="intercorrencias">
          <RegulacaoSecundariaIntercorrencias data={intercorrencias || []} />
        </TabsContent>
      </Tabs>
      <RegulacaoSecundariaOcorrencias />
    </div>
  );
}
