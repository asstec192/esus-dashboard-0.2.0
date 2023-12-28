import { ModalOcorrencia } from "@/components/dialogs/ModalOcorrencia";
import { ChartRisk } from "@/components/charts/ChartRisk";
import { Card } from "@/components/ui/card";
import { ChartCalls } from "@/components/charts/ChartCalls";
import { TypographySmall } from "@/components/typography/TypographySmall";
import { MontitoramentoOcorrencias } from "./ocorrencias";
import { MonitoramentoEstatisticasGerais } from "./estatisticas-gerais";

export default function Monitoramento() {
  return (
    <div className="grid min-h-nav-offset grid-cols-12 gap-2 py-4 sm:p-4">
      <div className="col-span-full flex lg:col-span-8 2xl:col-span-9">
        <MontitoramentoOcorrencias />
      </div>
      <div className="col-span-full grid grid-cols-2 items-stretch gap-2 lg:col-span-4 2xl:col-span-3">
        <div className="col-span-full grid grid-cols-3 gap-2">
          <MonitoramentoEstatisticasGerais />
        </div>
        <Card className="col-span-full min-h-[300px] p-2 sm:max-lg:col-span-1">
          <TypographySmall>Ligações</TypographySmall>
          <ChartCalls />
        </Card>
        <Card className="col-span-full p-2 sm:max-lg:col-span-1">
          <TypographySmall>Risco</TypographySmall>
          <ChartRisk />
        </Card>
      </div>
      <ModalOcorrencia />
    </div>
  );
}
