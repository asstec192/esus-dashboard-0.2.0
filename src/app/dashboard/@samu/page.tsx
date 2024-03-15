import { api } from "@/trpc/server";
import { SAMUCards } from "./samu-cards";
import { SAMUCharts } from "./samu-charts";

export default async function SAMUTab() {
  const temposDeDeslocamento = await api.tempoResposta.movimentacoes.query();

  return (
    <div className="space-y-2">
      <SAMUCards movimentacoes={temposDeDeslocamento} />
      <SAMUCharts />
    </div>
  );
}
