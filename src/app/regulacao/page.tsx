import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { api } from "@/trpc/server";
import { ChartSituacaoFrota } from "./grafico-situacao-frota";
import { ChartSolocitacoesPendentes } from "./grafico-solicitacoes-pendentes";
import { RegulacaoOcorrencias } from "./ocorrencias";

export const dynamic = "force-dynamic";

export default async function Monitoramento() {
  const [situacaoFrota, situacaoSolicitacoes] = await Promise.all([
    await api.veiculos.situacaoDaFrota.query(),
    await api.veiculos.situacaoSolicitacoes.query(),
  ]);

  return (
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
            <ChartSituacaoFrota initialData={situacaoFrota} />
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
            <ChartSolocitacoesPendentes initialData={situacaoSolicitacoes} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
