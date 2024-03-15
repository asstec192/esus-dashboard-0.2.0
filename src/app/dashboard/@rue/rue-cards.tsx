import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { DateRange } from "@/hooks/useGlobalDateFilterStore";
import { api } from "@/trpc/react";
import { endOfDay, startOfDay } from "date-fns";
import { Hourglass, Siren } from "lucide-react";

const refetchInterval = 5000;
const dateRange: DateRange = {
  from: startOfDay(new Date()),
  to: endOfDay(new Date()),
};

export function RUECards() {
  const { data: tempos } = api.tempoResposta.movimentacoes.useQuery(undefined, {
    refetchInterval,
  });

  const tempoDeRetornoDoDestino = tempos?.find(
    (tempo) => tempo.label === "Retorno do destino",
  )?.value;

  const { data: atendimentosPorVeiculo } =
    api.veiculos.countAtendimentos.useQuery(dateRange, {
      refetchInterval,
    });

  const totalDeOcorrencias = atendimentosPorVeiculo?.reduce((acc, veiculo) => {
    acc += veiculo.totalOcorrencias;
    return acc;
  }, 0);

  return (
    <div className="grid grid-cols-6 gap-2">
      {" "}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 px-2 pb-2 sm:px-6">
          <CardTitle className="text-sm font-medium">Ocorrências</CardTitle>
          <Siren className="h-5 text-muted-foreground" />
        </CardHeader>
        <CardContent className="px-2 pb-4 sm:px-6 ">
          <div className="text-lg font-bold text-primary sm:text-2xl">
            {totalDeOcorrencias}
          </div>
          {/*    <p className="text-xs text-muted-foreground">
          +20.1% from last month
        </p> */}
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 px-2 pb-2 sm:px-6">
          <CardTitle className="text-sm font-medium">
            Retorno do Destino
          </CardTitle>
          <Hourglass className="h-4 text-muted-foreground" />
        </CardHeader>
        <CardContent className="px-2 pb-4 sm:px-6 ">
          <div className="text-lg font-bold text-primary sm:text-2xl">
            {tempoDeRetornoDoDestino} min
          </div>
          {/*    <p className="text-xs text-muted-foreground">
              +20.1% from last month
            </p> */}
        </CardContent>
      </Card>
    </div>
  );
}
