import { TypographyMuted } from "@/components/typography/TypographyMuted";
import { TypographySmall } from "@/components/typography/TypographySmall";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RouterOutputs } from "@/trpc/shared";
import { formatClientDateToLocaleString } from "@/utils/formatClientDateToLocaleString";
import { formatProperName } from "@/utils/formatProperName";

type ModalOcorrenciaVitimasProps = {
  hasPrivilege?: boolean;
  vitimas: NonNullable<RouterOutputs["ocorrencias"]["getOne"]>["Vitimas"];
};

export function ModalOcorrenciaVitimas({
  hasPrivilege,
  vitimas,
}: ModalOcorrenciaVitimasProps) {
  return (
    <Tabs defaultValue={vitimas[0]?.VitimaId.toString()}>
      <TabsList className="grid h-max grid-cols-[repeat(auto-fit,minmax(100px,1fr))]">
        {vitimas.map((vitima) => (
          <TabsTrigger value={vitima.VitimaId.toString()} key={vitima.VitimaId}>
            <b className="truncate">{formatProperName(vitima.VitimaNM)}</b>
          </TabsTrigger>
        ))}
      </TabsList>

      {vitimas.map((vitima) => (
        <TabsContent value={vitima.VitimaId.toString()} key={vitima.VitimaId}>
          <div className="col-span-1 grid grid-cols-1 sm:grid-cols-6">
            <TypographySmall>
              ID:{" "}
              <span className="text-muted-foreground">#{vitima.VitimaId}</span>
            </TypographySmall>
            <TypographySmall>
              Idade:{" "}
              <span className="text-muted-foreground">
                {vitima.Idade}{" "}
                {vitima.IdadeTP_Vitimas_IdadeTPToIdadeTP?.IdadeTPDS?.toLocaleLowerCase()}
              </span>
            </TypographySmall>
            <TypographySmall>
              Sexo:{" "}
              <span className="text-muted-foreground">
                {vitima.Sexo_?.SEXO?.toLocaleLowerCase()}
              </span>
            </TypographySmall>
            <TypographySmall className="col-span-full">
              Desfecho:{" "}
              <span className="text-muted-foreground">
                {vitima.HistoricoDecisaoGestora[0]?.Destino?.UnidadeDS}
              </span>
            </TypographySmall>
          </div>
          {hasPrivilege && (
            <Card className="mt-2">
              <ScrollArea className="h-[21rem] p-2">
                {vitima.OCORRENCIA_AVALIACAO_INICIAL.map((avaliacao, index) => (
                  <div
                    key={index}
                    className="flex flex-col gap-1 rounded bg-slate-100 px-2 py-1 dark:bg-background [&:not(:first-child)]:mt-2"
                  >
                    <TypographySmall>
                      {formatProperName(avaliacao.Operador?.OperadorNM)}:
                    </TypographySmall>
                    <TypographyMuted>{avaliacao.AVALICAO}</TypographyMuted>
                    <TypographySmall className="self-end text-xs ">
                      {formatClientDateToLocaleString(avaliacao.DTHR)}
                    </TypographySmall>
                  </div>
                ))}
              </ScrollArea>
            </Card>
          )}
        </TabsContent>
      ))}
    </Tabs>
  );
}
