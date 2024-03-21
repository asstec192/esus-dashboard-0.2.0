"use client";

import { GlobalDatePicker } from "@/components/date-pickers/global-date-picker";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { api } from "@/trpc/react";
import { ChartSituacaoFrota } from "./chart-situacao-frota";
import { ChartSolocitacoesPendentes } from "./chart-solicitacoes-pendentes";
import { RegulacaoOcorrencias } from "./ocorrencias";

export default function RegulacaoPage() {
  const refetchInterval = 5000;

  const { data: situacaoFrota } = api.veiculos.situacaoDaFrota.useQuery(
    undefined,
    { refetchInterval },
  );

  const { data: situacaoSolicitacoes } =
    api.veiculos.situacaoSolicitacoes.useQuery(undefined, { refetchInterval });

  return (
    <main className="flex flex-col gap-2">
      <GlobalDatePicker className="self-end" />
      <div className="grid grid-cols-12 gap-2">
        <div className="col-span-full flex lg:col-span-8 2xl:col-span-9">
          <RegulacaoOcorrencias />
        </div>
        <div className="col-span-full grid grid-cols-1 items-stretch gap-2 md:max-lg:grid-cols-2 lg:col-span-4 2xl:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-medium">
                Ocupação da Frota
              </CardTitle>
              <CardDescription>Proporção de veículos ocupados</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartSituacaoFrota
                data={situacaoFrota ?? []}
                loading={!situacaoFrota}
              />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-medium">
                Solicitações Pendentes
              </CardTitle>
              <CardDescription>
                Quantidade de solicitações de frota pendentes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChartSolocitacoesPendentes
                data={situacaoSolicitacoes ?? []}
                loading={!situacaoSolicitacoes}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
