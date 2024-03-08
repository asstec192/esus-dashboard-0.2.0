import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MontitoramentoOcorrencias } from "./components/ocorrencias";
import { MonitoramentoEstatisticasGerais } from "./components/estatisticas-gerais";
import { api } from "@/trpc/server";
import { ChartSituacaoFrota } from "./components/grafico-situacao-frota";
import { ChartSolocitacoesPendentes } from "./components/grafico-solicitacoes-pendentes";
import { ScrollArea } from "@/components/ui/scroll-area";

export const dynamic = "force-dynamic";

export default async function Monitoramento() {
  const [
    ocorrencias,
    tarms,
    medicos,
    movimentacoes,
    ligacoesCount,
    situacaoFrota,
    situacaoSolicitacoes,
  ] = await Promise.all([
    await api.ocorrencias.getAllInProgress.query(),
    await api.tempoResposta.tarm.query(),
    await api.tempoResposta.medico.query(),
    await api.tempoResposta.movimentacoes.query(),
    await api.ligacoes.liveCount.query(),
    await api.veiculos.situacaoDaFrota.query(),
    await api.veiculos.situacaoSolicitacoes.query(),
  ]);

  return (
    <div className="grid grid-cols-12 gap-2 py-4 sm:p-4">
      <MonitoramentoEstatisticasGerais
        medicos={medicos}
        ligacoesCount={ligacoesCount}
        movimentacoes={movimentacoes}
        tarms={tarms}
      />
      <div className="col-span-full flex lg:col-span-8 2xl:col-span-9">
        <MontitoramentoOcorrencias initialData={ocorrencias} />
      </div>
      <ScrollArea className="col-span-full lg:col-span-4 lg:h-[calc(100vh-13rem)] 2xl:col-span-3">
        <div className="col-span-full grid grid-cols-2 items-stretch gap-2 ">
          <Card className="col-span-full sm:max-lg:col-span-1">
            <CardHeader>
              <CardTitle className="text-base font-medium">
                Ocupação da Frota
              </CardTitle>
              <CardDescription>Proporção de veículos ocupados</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartSituacaoFrota initialData={situacaoFrota} />
            </CardContent>
          </Card>
          <Card className="col-span-full sm:max-lg:col-span-1">
            <CardHeader>
              <CardTitle className="text-base font-medium">
                Solicitações Pendentes
              </CardTitle>
              <CardDescription>
                Quantidade de solicitações de frota pendentes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChartSolocitacoesPendentes initialData={situacaoSolicitacoes} />
            </CardContent>
          </Card>
        </div>
      </ScrollArea>
    </div>
  );
}
