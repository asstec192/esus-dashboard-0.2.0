import { TypographySmall } from "@/components/typography/TypographySmall";
import { Badge } from "@/components/ui/badge";
import { type Veiculo } from "@/lib/ocorrencias";
import { CheckCircle2, Timer } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export function PopoverVeiculo({ veiculo }: { veiculo: Veiculo }) {
  return (
    <Popover>
      <PopoverTrigger>
        <Badge variant="outline" className="w-max py-1">
          {veiculo.RetornoDestinoDT ? (
            <CheckCircle2 size="0.9rem" className="mr-2 text-slate-500" />
          ) : (
            <Timer size="1rem" className="mr-2 text-slate-500" />
          )}
          {veiculo.nome}
        </Badge>
      </PopoverTrigger>
      <PopoverContent className="flex w-max flex-col gap-1">
        <TypographySmall className="flex justify-between gap-4">
          <b>Contato com equipe:</b>
          {new Date(veiculo.EnvioEquipeDT).toLocaleString()}
        </TypographySmall>
        <TypographySmall className="flex flex-nowrap justify-between gap-4">
          <b>Saída da base: </b>
          {veiculo.SaidaBaseDT &&
            new Date(veiculo.SaidaBaseDT).toLocaleString()}
        </TypographySmall>
        <TypographySmall className="flex justify-between gap-4">
          <b>Chegada ao local: </b>
          {veiculo.ChegadaLocalDT &&
            new Date(veiculo.ChegadaLocalDT).toLocaleString()}
        </TypographySmall>
        <TypographySmall className="flex justify-between gap-4">
          <b>Saída do local: </b>
          {veiculo.SaidaLocalDT &&
            new Date(veiculo.SaidaLocalDT).toLocaleString()}
        </TypographySmall>
        <TypographySmall className="flex justify-between gap-4">
          <b>Chegada ao destino: </b>
          {veiculo.ChegadaDestinoDT &&
            new Date(veiculo.ChegadaDestinoDT).toLocaleString()}
        </TypographySmall>
        <TypographySmall className="flex justify-between gap-4">
          <b>Retorno do destino: </b>
          {veiculo.RetornoDestinoDT &&
            new Date(veiculo.RetornoDestinoDT).toLocaleString()}
        </TypographySmall>
        <TypographySmall className="flex justify-between gap-4">
          <b>Chegada à base: </b>
          {veiculo.ChegadaBaseDT &&
            new Date(veiculo.ChegadaBaseDT).toLocaleString()}
        </TypographySmall>
      </PopoverContent>
    </Popover>
  );
}
