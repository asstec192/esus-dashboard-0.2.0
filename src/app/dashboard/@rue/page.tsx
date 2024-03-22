"use client";

import { isToday } from "date-fns";

import type { DateRange } from "@/hooks/useGlobalDateFilterStore";
import { ChartLogFrota } from "@/components/charts/chart-log-frota";
import { ChartLogSolicitacoes } from "@/components/charts/chart-log-solicitacoes";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGlogalDateFilterStore } from "@/hooks/useGlobalDateFilterStore";
import { api } from "@/trpc/react";
import { RUECards } from "./rue-cards";

export default function RUETab() {
  const dateRange = useGlogalDateFilterStore(
    (state) => state.dateRange,
  ) as DateRange;
  const refetchInterval = isToday(dateRange.from) ? 5000 : undefined;

  const { data: logFrota } = api.veiculos.logSituacaoDaFrota.useQuery(
    { date: dateRange.from },
    { refetchInterval },
  );

  const { data: logSolicitacoes } =
    api.veiculos.logSolicitacoesPendentes.useQuery(
      { date: dateRange.from },
      { refetchInterval },
    );

  return (
    <div className="space-y-2">
      <RUECards />
      <div className="grid grid-cols-3 gap-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              Histórioco de ocupação da frota
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartLogFrota data={logFrota ?? []} loading={!logFrota} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-medium">
              Histórico de solicitações pendentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartLogSolicitacoes
              data={logSolicitacoes ?? []}
              loading={!logSolicitacoes}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
