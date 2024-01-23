"use client";

import { TypographyMuted } from "@/components/typography/TypographyMuted";
import { TypographySmall } from "@/components/typography/TypographySmall";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RouterOutputs } from "@/trpc/shared";
import { formatProperName } from "@/utils/formatProperName";
import { addHours } from "date-fns";

type ModalOcorrenciaProps = {
  hasPrivilege?: boolean;
  movimentacoes: NonNullable<
    RouterOutputs["ocorrencias"]["getOne"]
  >["OcorrenciaMovimentacao"];
};

export function ModalOcorrenciaVeiculos({
  hasPrivilege,
  movimentacoes,
}: ModalOcorrenciaProps) {
  return (
    <Tabs
      defaultValue={`${movimentacoes[0]?.OcorrenciaID}-${movimentacoes[0]?.VeiculoID}-${movimentacoes[0]?.VeiculoSEQ}`}
    >
      <TabsList className="flex h-max w-full flex-wrap justify-start">
        {movimentacoes.map((movimentacao) => (
          <TabsTrigger
            key={`trigger-${movimentacao.OcorrenciaID}-${movimentacao.VeiculoID}-${movimentacao.VeiculoSEQ}`}
            value={`${movimentacao.OcorrenciaID}-${movimentacao.VeiculoID}-${movimentacao.VeiculoSEQ}`}
          >
            {movimentacao.Veiculo?.VeiculoDS}
          </TabsTrigger>
        ))}
      </TabsList>

      {movimentacoes.map((movimentacao) => (
        <TabsContent
          key={`content-${movimentacao.OcorrenciaID}-${movimentacao.VeiculoID}-${movimentacao.VeiculoSEQ}`}
          value={`${movimentacao.OcorrenciaID}-${movimentacao.VeiculoID}-${movimentacao.VeiculoSEQ}`}
        >
          <div className="grid grid-cols-2  gap-2">
            {/* ---------------MOVIMENTACOES DO VEICULO------------------ */}
            <div className="col-span-full flex max-w-[300px] flex-col self-start sm:max-md:grid sm:max-md:max-w-none sm:max-md:grid-cols-2 md:col-span-1">
              <p className="grid grid-cols-2 items-baseline">
                <TypographySmall>Contato com equipe:</TypographySmall>
                <TypographyMuted>
                  {movimentacao.EnvioEquipeDT &&
                    addHours(movimentacao.EnvioEquipeDT, 3).toLocaleString()}
                </TypographyMuted>
              </p>
              <p className="grid grid-cols-2 items-baseline">
                <TypographySmall>Saída da base:</TypographySmall>
                <TypographyMuted>
                  {movimentacao.SaidaBaseDT &&
                    addHours(movimentacao.SaidaBaseDT, 3).toLocaleString()}
                </TypographyMuted>
              </p>
              <p className="grid grid-cols-2 items-baseline">
                <TypographySmall>Chegada ao local:</TypographySmall>
                <TypographyMuted>
                  {movimentacao.ChegadaLocalDT &&
                    addHours(movimentacao.ChegadaLocalDT, 3).toLocaleString()}
                </TypographyMuted>
              </p>
              <p className="grid grid-cols-2 items-baseline">
                <TypographySmall>Saída do local:</TypographySmall>
                <TypographyMuted>
                  {movimentacao.SaidaLocalDT &&
                    addHours(movimentacao.SaidaLocalDT, 3).toLocaleString()}
                </TypographyMuted>
              </p>
              <p className="grid grid-cols-2 items-baseline">
                <TypographySmall>Chegada ao destino:</TypographySmall>
                <TypographyMuted>
                  {movimentacao.ChegadaDestinoDT &&
                    addHours(movimentacao.ChegadaDestinoDT, 3).toLocaleString()}
                </TypographyMuted>
              </p>
              <p className="grid grid-cols-2 items-baseline">
                <TypographySmall>Retorno do destino:</TypographySmall>
                <TypographyMuted>
                  {movimentacao.RetornoDestinoDT &&
                    addHours(movimentacao.RetornoDestinoDT, 3).toLocaleString()}
                </TypographyMuted>
              </p>
              <p className="grid grid-cols-2 items-baseline">
                <TypographySmall>Chegada à base:</TypographySmall>
                <TypographyMuted>
                  {movimentacao.ChegadaBaseDT &&
                    addHours(movimentacao.ChegadaBaseDT, 3).toLocaleString()}
                </TypographyMuted>
              </p>
            </div>

            {/* ----------------------HISTORICO DE CONDUTA------------------------- */}
            {hasPrivilege && (
              <Card className="col-span-full md:col-span-1">
                <CardHeader>
                  <CardTitle className="text-sm font-medium">
                    Histórico de conduta
                  </CardTitle>
                </CardHeader>

                <ScrollArea className="h-[20rem]">
                  <CardContent className="space-y-4">
                    {movimentacao.Veiculo?.HISTORICO_CONDUTA.map((conduta) => (
                      <div
                        key={conduta.DTHR_CONDUTA?.toString()}
                        className="flex flex-col"
                      >
                        <TypographySmall className="font-medium">
                          Vítima: {formatProperName(conduta.vitima?.VitimaNM)}
                        </TypographySmall>
                        <TypographyMuted>{conduta.OBS_MEDICO}</TypographyMuted>
                        <TypographyMuted className="text-end font-medium">
                          {conduta.DTHR_CONDUTA &&
                            addHours(conduta.DTHR_CONDUTA, 3).toLocaleString()}
                        </TypographyMuted>
                      </div>
                    ))}
                  </CardContent>
                </ScrollArea>
              </Card>
            )}
          </div>
        </TabsContent>
      ))}
    </Tabs>
  );
}
