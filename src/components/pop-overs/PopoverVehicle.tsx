import { TypographySmall } from "@/components/typography/TypographySmall";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Timer } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { RouterOutputs } from "@/utils/api";
import { addHours } from "date-fns";

type Motimentacao = NonNullable<
  RouterOutputs["incidents"]["getOne"]
>["OcorrenciaMovimentacao"][0];

export function PopoverVehicle({
  movimentacao,
}: {
  movimentacao: Motimentacao;
}) {
  return (
    <Popover>
      <PopoverTrigger>
        <Badge variant="outline" className="w-max py-1">
          {movimentacao.RetornoDestinoDT ? (
            <CheckCircle2 size="0.9rem" className="mr-2 text-slate-500" />
          ) : (
            <Timer size="1rem" className="mr-2 text-slate-500" />
          )}
          {movimentacao.Veiculo?.VeiculoDS}
        </Badge>
      </PopoverTrigger>
      <PopoverContent className="flex w-max flex-col gap-1">
        <TypographySmall className="flex justify-between gap-4">
          <b>Contato com equipe:</b>
          {movimentacao.EnvioEquipeDT &&
            addHours(movimentacao.EnvioEquipeDT, 3).toLocaleString()}
        </TypographySmall>
        <TypographySmall className="flex flex-nowrap justify-between gap-4">
          <b>Saída da base: </b>
          {movimentacao.SaidaBaseDT &&
            addHours(movimentacao.SaidaBaseDT, 3).toLocaleString()}
        </TypographySmall>
        <TypographySmall className="flex justify-between gap-4">
          <b>Chegada ao local: </b>
          {movimentacao.ChegadaLocalDT &&
            addHours(movimentacao.ChegadaLocalDT, 3).toLocaleString()}
        </TypographySmall>
        <TypographySmall className="flex justify-between gap-4">
          <b>Saída do local: </b>
          {movimentacao.SaidaLocalDT &&
            addHours(movimentacao.SaidaLocalDT, 3).toLocaleString()}
        </TypographySmall>
        <TypographySmall className="flex justify-between gap-4">
          <b>Chegada ao destino: </b>
          {movimentacao.ChegadaDestinoDT &&
            addHours(movimentacao.ChegadaDestinoDT, 3).toLocaleString()}
        </TypographySmall>
        <TypographySmall className="flex justify-between gap-4">
          <b>Retorno do destino: </b>
          {movimentacao.RetornoDestinoDT &&
            addHours(movimentacao.RetornoDestinoDT, 3).toLocaleString()}
        </TypographySmall>
        <TypographySmall className="flex justify-between gap-4">
          <b>Chegada à base: </b>
          {movimentacao.ChegadaBaseDT &&
            addHours(movimentacao.ChegadaBaseDT, 3).toLocaleString()}
        </TypographySmall>
      </PopoverContent>
    </Popover>
  );
}
