"use client";

import { useState } from "react";
import { isFuture, isToday } from "date-fns";

import type { DateRange } from "@/hooks/useGlobalDateFilterStore";
import { ChartSituacaoFrota } from "@/app/regulacao/chart-situacao-frota";
import { ChartSolocitacoesPendentes } from "@/app/regulacao/chart-solicitacoes-pendentes";
import { ChartAge } from "@/components/charts/chart-age";
import { ChartGender } from "@/components/charts/chart-gender";
import { ChartLigacoes } from "@/components/charts/chart-ligacoes";
import { ChartMotivoOcorrencia } from "@/components/charts/chart-motivo-ocorrencia";
import { ChartRisco } from "@/components/charts/chart-risco";
import { ChartTipoOcorrencia } from "@/components/charts/chart-tipo-ocorrencia";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGlogalDateFilterStore } from "@/hooks/useGlobalDateFilterStore";
import { api } from "@/trpc/react";

export function CruforCharts() {
  const [tipoId, setTipoId] = useState(17); //inicia com o id do tipo clinico

  const dateRange = useGlogalDateFilterStore(
    (state) => state.dateRange,
  ) as DateRange;

  // atualiza em tempo real caso o intervalo inclua o dia atual
  const refetchInterval =
    isToday(dateRange.to) || isFuture(dateRange.to) ? 5000 : undefined;

  const { data: ligacoesCount } = api.ocorrencias.countByTipoLigacao.useQuery(
    dateRange,
    { refetchInterval },
  );
  const { data: riscoCount } = api.ocorrencias.countByRisco.useQuery(
    dateRange,
    { refetchInterval },
  );

  const { data: tipoCount } = api.ocorrencias.countByTipo.useQuery(
    { dateRange, somenteComEnvioDeVeiculo: false },
    { refetchInterval },
  );

  const { data: motivoCount } = api.ocorrencias.countByMotivo.useQuery(
    { dateRange, somenteComEnvioDeVeiculo: false },
    { refetchInterval },
  );

  const { data: genderCount } = api.pacientes.countByGender.useQuery(
    { dateRange, somenteComEnvioDeVeiculo: false },
    { refetchInterval },
  );

  const { data: ageCount } = api.pacientes.countByAgeRange.useQuery(
    { dateRange, somenteComEnvioDeVeiculo: false },
    { refetchInterval },
  );

  const { data: ocupacaoDaFrota } = api.veiculos.situacaoDaFrota.useQuery(
    undefined,
    { refetchInterval: 5000 },
  );

  const { data: solicitacoesPendentes } =
    api.veiculos.situacaoSolicitacoes.useQuery(undefined, {
      refetchInterval: 5000,
    });

  return (
    <div className="grid grid-cols-1 gap-2 md:grid-cols-2 xl:grid-cols-3">
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-medium">
            Ocupação da frota
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ChartSituacaoFrota
            data={ocupacaoDaFrota ?? []}
            loading={!ocupacaoDaFrota}
          />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-medium">
            Solicitações pendentes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ChartSolocitacoesPendentes
            data={solicitacoesPendentes ?? []}
            loading={!solicitacoesPendentes}
          />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            Total de ocorrências por tipo de ligação
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ChartLigacoes data={ligacoesCount ?? []} loading={!ligacoesCount} />
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
            data={tipoCount ?? []}
            loading={!tipoCount}
            onBarHover={(tipoId) => setTipoId(tipoId)}
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
            data={motivoCount ?? []}
            loading={!motivoCount}
            tipoId={tipoId}
          />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            Total de ocorrências por risco classificado
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ChartRisco data={riscoCount ?? []} loading={!riscoCount} />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            Total de pacientes por sexo
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ChartGender data={genderCount ?? []} loading={!genderCount} />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            Total de pacientes por faixa etária
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ChartAge data={ageCount ?? []} loading={!ageCount} />
        </CardContent>
      </Card>
      {/*  <Card>
        <CardHeader>
          <CardTitle className="text-base">
            Total de ocorrência por horário de regulação
          </CardTitle>
        </CardHeader>
        <CardContent>Horario da regulação</CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            Total de ocorrências por regional
          </CardTitle>
        </CardHeader>
        <CardContent>Regional</CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            Total de ocorrências por regional / bairro
          </CardTitle>
        </CardHeader>
        <CardContent>Bairro por regional</CardContent>
      </Card> */}
    </div>
  );
}
