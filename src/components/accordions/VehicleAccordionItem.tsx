import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { RouterOutputs } from "@/utils/api";
import { TypographySmall } from "../typography/TypographySmall";
import { addHours } from "date-fns";
import { TypographyMuted } from "../typography/TypographyMuted";
import { ScrollArea } from "../ui/scroll-area";
import { Card } from "../ui/card";
import { formatProperName } from "@/utils/formatProperName";

type VehicleAccordionItemProps = {
  movimentacao: NonNullable<
    RouterOutputs["incidents"]["getOne"]
  >["OcorrenciaMovimentacao"][0];
};

export function VehicleAccordionItem({
  movimentacao,
}: VehicleAccordionItemProps) {
  return (
    <AccordionItem value={movimentacao.VeiculoSEQ.toString()}>
      <AccordionTrigger className="py-2">
        <TypographySmall> {movimentacao.Veiculo?.VeiculoDS}</TypographySmall>
      </AccordionTrigger>
      <AccordionContent>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="grid grid-cols-2 items-baseline gap-x-2 gap-y-1 sm:flex-1">
            <TypographySmall className="col-span-full sm:text-center">
              Histórico de movimentação
            </TypographySmall>
            <TypographySmall>Contato com equipe:</TypographySmall>
            <TypographyMuted>
              {movimentacao.EnvioEquipeDT &&
                addHours(movimentacao.EnvioEquipeDT, 3).toLocaleString()}
            </TypographyMuted>
            <TypographySmall className="flex flex-nowrap justify-between gap-4">
              Saída da base:
            </TypographySmall>
            <TypographyMuted>
              {movimentacao.SaidaBaseDT &&
                addHours(movimentacao.SaidaBaseDT, 3).toLocaleString()}
            </TypographyMuted>
            <TypographySmall>Chegada ao local:</TypographySmall>
            <TypographyMuted>
              {movimentacao.ChegadaLocalDT &&
                addHours(movimentacao.ChegadaLocalDT, 3).toLocaleString()}
            </TypographyMuted>
            <TypographySmall>Saída do local:</TypographySmall>
            <TypographyMuted>
              {movimentacao.SaidaLocalDT &&
                addHours(movimentacao.SaidaLocalDT, 3).toLocaleString()}
            </TypographyMuted>
            <TypographySmall>Chegada ao destino:</TypographySmall>
            <TypographyMuted>
              {movimentacao.ChegadaDestinoDT &&
                addHours(movimentacao.ChegadaDestinoDT, 3).toLocaleString()}
            </TypographyMuted>
            <TypographySmall>Retorno do destino:</TypographySmall>
            <TypographyMuted>
              {movimentacao.RetornoDestinoDT &&
                addHours(movimentacao.RetornoDestinoDT, 3).toLocaleString()}
            </TypographyMuted>
            <TypographySmall>Chegada à base:</TypographySmall>
            <TypographyMuted>
              {movimentacao.ChegadaBaseDT &&
                addHours(movimentacao.ChegadaBaseDT, 3).toLocaleString()}
            </TypographyMuted>
          </div>
          <div className="flex flex-col gap-2 sm:flex-1">
            <TypographySmall className="sm:self-center">
              Histórico de conduta
            </TypographySmall>
            {movimentacao.Veiculo?.HISTORICO_CONDUTA.map((conduta) => (
              <Card className="p-2">
                <p className="flex items-baseline gap-2">
                  <TypographySmall>Vítima:</TypographySmall>
                  <TypographyMuted>
                    {formatProperName(conduta.vitima?.VitimaNM)}
                  </TypographyMuted>
                </p>
                <TypographyMuted>{conduta.OBS_MEDICO}</TypographyMuted>
                <TypographyMuted className="text-end">
                  {conduta.DTHR_CONDUTA &&
                    addHours(conduta.DTHR_CONDUTA, 3).toLocaleString()}
                </TypographyMuted>
              </Card>
            ))}
          </div>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}
