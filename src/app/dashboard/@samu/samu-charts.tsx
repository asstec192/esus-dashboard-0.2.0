"use client";

import { ChartAge } from "@/components/charts/chart-age";
import { ChartGender } from "@/components/charts/chart-gender";
import { ChartHour } from "@/components/charts/chart-hour";
import { ChartMotivoOcorrencia } from "@/components/charts/chart-motivo-ocorrencia";
import { ChartTipoOcorrencia } from "@/components/charts/chart-tipo-ocorrencia";
import { DataTable } from "@/components/table/DataTable";
import { DataTableProvider } from "@/components/table/DataTableProvider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  useGlogalDateFilterStore,
  type DateRange,
} from "@/hooks/useGlobalDateFilterStore";
import { api } from "@/trpc/react";
import { isToday } from "date-fns";
import { useState } from "react";

export function SAMUCharts() {
  const [tipoId, setTipoId] = useState(17); //inicia com o id do tipo clinico

  const dateRange = useGlogalDateFilterStore(
    (state) => state.dateRange,
  ) as DateRange;

  // atualiza a cada segundo caso o periodo de data va ate o dia atual
  const refetchInterval = isToday(dateRange.to) ? 5000 : undefined;

  const { data: contagemDeSexo } = api.pacientes.countByGender.useQuery(
    { dateRange, somenteComEnvioDeVeiculo: true },
    { refetchInterval },
  );

  const { data: contagemFaixaEtaria } = api.pacientes.countByAgeRange.useQuery(
    { dateRange, somenteComEnvioDeVeiculo: true },
    { refetchInterval },
  );

  const { data: contagemTipo } = api.ocorrencias.countByTipo.useQuery(
    { dateRange, somenteComEnvioDeVeiculo: true },
    { refetchInterval },
  );

  const { data: contagemMotivo } = api.ocorrencias.countByMotivo.useQuery(
    { dateRange, somenteComEnvioDeVeiculo: true },
    { refetchInterval },
  );

  const { data: contagemHorario } =
    api.ocorrencias.countByHoraDeEnvioDoVeiculo.useQuery(dateRange, {
      refetchInterval,
    });

  return (
    <div className="grid grid-cols-1 gap-2 md:grid-cols-2 xl:grid-cols-3">
      <Card>
        <CardContent className="sm-h-full flex h-[400px] flex-col">
          <TabelaOcorrencias />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            Total de pacientes por sexo
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ChartGender data={contagemDeSexo ?? []} loading={!contagemDeSexo} />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            Total de pacientes por faixa etária
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ChartAge
            data={contagemFaixaEtaria ?? []}
            loading={!contagemFaixaEtaria}
          />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            Total de ocorrências por tipo
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ChartTipoOcorrencia
            data={contagemTipo ?? []}
            loading={!contagemTipo}
            onBarHover={setTipoId}
          />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            Total de ocorrências por motivo
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ChartMotivoOcorrencia
            data={contagemMotivo ?? []}
            loading={!contagemMotivo}
            tipoId={tipoId}
          />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            Total de ocorrências por horário de envio do veículo
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ChartHour data={contagemHorario ?? []} loading={!contagemHorario} />
        </CardContent>
      </Card>
    </div>
  );

  function TabelaOcorrencias() {
    const { data: atendimentos } = api.veiculos.countAtendimentos.useQuery(
      dateRange,
      { refetchInterval },
    );

    return (
      <DataTableProvider
        columns={[
          { accessorKey: "nome", header: "Veículo" },
          { accessorKey: "totalOcorrencias", header: "Ocorrências" },
          { accessorKey: "totalPacientes", header: "Pacientes" },
        ]}
        data={atendimentos ?? []}
      >
        <ScrollArea className="h-1 flex-grow">
          <DataTable />
        </ScrollArea>
      </DataTableProvider>
    );
  }
}