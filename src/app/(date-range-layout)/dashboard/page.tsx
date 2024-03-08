import { ChartAge } from "./components/chart-age";
import { ChartGender } from "./components/chart-gender";
import { ChartHour } from "./components/chart-hour";
import { ChartVehicles } from "./components/chart-veiculos";
import { ChartWeekDay } from "./components/chart-week-day";
import { ChartTipoOcorrencia } from "./components/chart-tipo-ocorrencia";
import { ChartLogFrota } from "./components/chart-log-frota";
import { ChartLogSolicitacoes } from "./components/chart-log-solicitacoes";
import { ChartLigacoes } from "./components/chart-ligacoes";
import { ChartRisco } from "./components/chart-risco";

export default function Epidemiologia() {
  return (
    <main className="flex min-h-nav-offset flex-col p-4">
      <div className="mt-14 grid auto-rows-min grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
        <ChartLogFrota />
        <ChartLogSolicitacoes />
        <ChartLigacoes />
        <ChartRisco />
        <ChartGender />
        <ChartAge />
        <ChartWeekDay />
        <ChartVehicles />
        <ChartHour />
        <ChartTipoOcorrencia />
      </div>
    </main>
  );
}
