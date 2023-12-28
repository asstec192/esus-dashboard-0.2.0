"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { TypographySmall } from "@/components/typography/TypographySmall";
import { TypographyMuted } from "@/components/typography/TypographyMuted";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatProperName } from "@/utils/formatProperName";
import { getColorByRisk } from "@/utils/getColorByRisk";
import { Card } from "@/components/ui/card";
import { withRoles } from "@/components/HOCs/withRoles";
import { UserRole } from "@/types/UserRole";
import { addHours } from "date-fns";
import { VehicleAccordion } from "../accordions/VehicleAccordion";
import { useOcorrenciaStore } from "@/hooks/useOcorrenciaStore";

export const ModalOcorrencia = withRoles(() => {
  const ocorrencia = useOcorrenciaStore((state) => state.ocorrencia);
  const setOcorrencia = useOcorrenciaStore((state) => state.setOcorrencia);
  return (
    <Dialog open={!!ocorrencia} onOpenChange={() => setOcorrencia(undefined)}>
      <DialogContent className="px-2 sm:max-w-4xl sm:px-6">
        {ocorrencia && (
          <>
            <DialogHeader className="space-y-2">
              <DialogTitle
                style={{ color: getColorByRisk(ocorrencia.RISCOCOD) }}
              >
                #{ocorrencia.OcorrenciaID.toString()}
              </DialogTitle>
              <TypographySmall>
                <b>Motivo: </b>
                {ocorrencia.Motivo?.MotivoDS}
              </TypographySmall>
              <TypographySmall>
                <b>Regulador: </b>
                {formatProperName(
                  ocorrencia.FORMEQUIPE_SolicitacaoVeiculo[0]?.Operador
                    ?.OperadorNM,
                )}
              </TypographySmall>
              <TypographySmall>
                <b>Bairro: </b>
                {formatProperName(ocorrencia.Bairro)}
              </TypographySmall>
              <TypographySmall>
                <b>Data: </b>
                {addHours(ocorrencia.DtHr!, 3).toLocaleString()}
              </TypographySmall>
            </DialogHeader>

            <Separator />

            <ScrollArea className="flex h-[60vh] flex-col">
              <VehicleAccordion
                movimentacoes={ocorrencia.OcorrenciaMovimentacao}
              />
              {ocorrencia.Vitimas.length > 0 && (
                <Tabs
                  className="mt-4"
                  defaultValue={ocorrencia.Vitimas[0]?.VitimaId.toString()}
                >
                  <TabsList className="flex h-max flex-wrap justify-start">
                    {ocorrencia.Vitimas.map((vitima) => (
                      <TabsTrigger
                        value={vitima.VitimaId.toString()}
                        key={vitima.VitimaId}
                      >
                        <b>{formatProperName(vitima.VitimaNM)}</b>
                      </TabsTrigger>
                    ))}
                  </TabsList>

                  {ocorrencia.Vitimas.map((vitima) => (
                    <TabsContent
                      value={vitima.VitimaId.toString()}
                      key={vitima.VitimaId}
                    >
                      <div className="ml-4 mt-4 flex flex-wrap gap-x-10 gap-y-2">
                        <TypographySmall>
                          <b>ID: </b> #{vitima.VitimaId}
                        </TypographySmall>
                        <TypographySmall>
                          <b>Idade: </b> {vitima.Idade}{" "}
                          {vitima.IdadeTP_Vitimas_IdadeTPToIdadeTP?.IdadeTPDS}
                        </TypographySmall>
                        <TypographySmall>
                          <b>Sexo: </b> {vitima.Sexo_?.SEXO}
                        </TypographySmall>
                        <TypographySmall>
                          <b>Desfecho: </b>
                          {
                            vitima.HistoricoDecisaoGestora[0]?.Destino
                              ?.UnidadeDS
                          }
                        </TypographySmall>
                      </div>
                      <Card className="mt-4 p-2">
                        <ScrollArea className="h-[350px]">
                          {vitima.OCORRENCIA_AVALIACAO_INICIAL.map(
                            (avaliacao, index) => (
                              <div
                                key={index}
                                className="flex flex-col gap-1 rounded bg-slate-100 px-2 py-1 [&:not(:first-child)]:mt-2"
                              >
                                <TypographySmall className="font-semibold">
                                  {formatProperName(
                                    avaliacao.Operador?.OperadorNM,
                                  )}
                                  :
                                </TypographySmall>
                                <TypographyMuted>
                                  {avaliacao.AVALICAO}
                                </TypographyMuted>
                                <TypographySmall className="self-end text-xs ">
                                  {addHours(avaliacao.DTHR, 3).toLocaleString()}
                                </TypographySmall>
                              </div>
                            ),
                          )}
                        </ScrollArea>
                      </Card>
                    </TabsContent>
                  ))}
                </Tabs>
              )}
            </ScrollArea>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}, [UserRole.admin, UserRole.medico]);
