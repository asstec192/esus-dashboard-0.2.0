import { ChartRisk } from "@/app/monitoramento/components/grafico-risco";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChartCalls } from "@/app/monitoramento/components/grafico-ligacoes";
import { MontitoramentoOcorrencias } from "./components/ocorrencias";
import { MonitoramentoEstatisticasGerais } from "./components/estatisticas-gerais";
import { api } from "@/trpc/server";
import { format, startOfDay } from "date-fns";

export const dynamic = "force-dynamic";

export default async function Monitoramento() {
  const ocorrencias = await api.ocorrencias.getAllInProgress.query();
  const estatisticas = await api.ocorrencias.getDailyInfo.query();
  const contagemDeRisco = await api.ocorrencias.countByRisco.query();
  const contagemDeLigacoes = await api.ocorrencias.countByTipoLigacao.query();

  const inicioDoDia = format(startOfDay(new Date()), "dd/MM/yyyy, HH:mm:ss");

  return (
    <div className="grid min-h-nav-offset grid-cols-12 gap-2 py-4 sm:p-4">
      <MonitoramentoEstatisticasGerais initialData={estatisticas} />
      <div className="col-span-full flex lg:col-span-8 2xl:col-span-9">
        <MontitoramentoOcorrencias initialData={ocorrencias} />
      </div>
      <div className="col-span-full grid grid-cols-2 items-stretch gap-2 lg:col-span-4 2xl:col-span-3">
        <Card className="col-span-full min-h-[300px] sm:max-lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-base font-medium">Ligações</CardTitle>
            <CardDescription>
              O total de ocorrências por tipos de ligações desde {inicioDoDia}
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-0">
            <ChartCalls initialData={contagemDeLigacoes} />
          </CardContent>
        </Card>
        <Card className="col-span-full sm:max-lg:col-span-1 sm:max-lg:self-start">
          <CardHeader>
            <CardTitle className="text-base font-medium">Risco</CardTitle>
            <CardDescription>
              O total de ocorrências por classificação de risco desde{" "}
              {inicioDoDia}.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartRisk initialData={contagemDeRisco} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
