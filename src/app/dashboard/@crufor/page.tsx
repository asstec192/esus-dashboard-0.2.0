import { CruforCards } from "./crufor-cards";
import { CruforCharts } from "./crufor-charts";

import { api } from "@/trpc/server";

export default async function CruforTab() {
  const [tarms, medicos, ligacoes] = await Promise.all([
    await api.tempoResposta.tarm.query(),
    await api.tempoResposta.medico.query(),
    await api.ligacoes.liveCount.query(),
  ]);

  return (
    <div className="space-y-2">
      <CruforCards ligacoesCount={ligacoes} medicos={medicos} tarms={tarms} />
      <CruforCharts />
    </div>
  );
}
