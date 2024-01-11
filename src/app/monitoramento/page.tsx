export const dynamic = "force-dynamic";

import { ChartRisk } from "@/components/charts/ChartRisk";
import { Card } from "@/components/ui/card";
import { ChartCalls } from "@/components/charts/ChartCalls";
import { TypographySmall } from "@/components/typography/TypographySmall";
import { MontitoramentoOcorrencias } from "./ocorrencias";
import { MonitoramentoEstatisticasGerais } from "./estatisticas-gerais";
import { api } from "@/trpc/server";

export default async function Monitoramento() {
  const ocorrencias = await api.incidents.getAllInProgress.query();
  const estatisticas = await api.incidents.getDailyInfo.query();
  const contagemDeRisco = await api.incidents.getTotalIncidentsByRisk.query();
  const contagemDeLigacoes =
    await api.incidents.getTotalIncidentsByCallType.query();

  return (
    <div className="grid min-h-nav-offset grid-cols-12 gap-2 py-4 sm:p-4">
      <div className="col-span-full flex lg:col-span-8 2xl:col-span-9">
        <MontitoramentoOcorrencias initialData={ocorrencias} />
      </div>
      <div className="col-span-full grid grid-cols-2 items-stretch gap-2 lg:col-span-4 2xl:col-span-3">
        <div className="col-span-full grid grid-cols-3 gap-2">
          <MonitoramentoEstatisticasGerais initialData={estatisticas} />
        </div>
        <Card className="col-span-full min-h-[300px] p-2 sm:max-lg:col-span-1">
          <TypographySmall>Ligações</TypographySmall>
          <ChartCalls initialData={contagemDeLigacoes} />
        </Card>
        <Card className="col-span-full p-2 sm:max-lg:col-span-1">
          <TypographySmall>Risco</TypographySmall>
          <ChartRisk initialData={contagemDeRisco} />
        </Card>
      </div>
    </div>
  );
}
