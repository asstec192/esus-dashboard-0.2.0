import { TypographySmall } from "@/components/typography/TypographySmall";
import { Separator } from "@/components/ui/separator";
import { UserRole } from "@/types/UserRole";
import { ModalOcorrenciaVeiculos } from "./veiculos";
import { ModalOcorrenciaVitimas } from "./vitimas";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  ParallelDialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

import { formatClientDateToLocaleString } from "@/utils/formatClientDateToLocaleString";
import { getServerAuthSession } from "@/server/auth";
import { api } from "@/trpc/server";
import { formatProperName } from "@/utils/formatProperName";
import { cn } from "@/lib/utils";

export const revalidate = 0; //nunca cacheia o resultado

export default async function ModalOcorrencia({
  searchParams,
}: {
  searchParams: { ocorrenciaId?: string };
}) {
  const session = await getServerAuthSession();

  //se o usuario não estiver logado ou o parametro nao existe retorna nulo
  if (!session || !searchParams.ocorrenciaId) return null;

  const ocorrenciaId = parseInt(searchParams.ocorrenciaId, 10);

  //se o parametro nao for um número retorna nulo
  if (isNaN(ocorrenciaId)) return null;

  //busca a ocorrencia
  const ocorrencia = await api.ocorrencias.getOne.mutate({
    incidentId: ocorrenciaId,
  });

  //se a ocorrência nao existir retorna nulo
  if (!ocorrencia) return null;

  //verifica se o usuario tem permissões de alto privilégio
  const hasPermissions = [UserRole.admin, UserRole.medico].some(
    (role) => role === session?.user.role,
  );

  return (
    <ParallelDialog open={!!searchParams.ocorrenciaId}>
      <DialogContent className="sm:px sm:max-w-4xl">
        <DialogHeader className="p">
          <DialogTitle className={cn(ocorrencia.riscoColorClass.text)}>
            #{ocorrencia.OcorrenciaID.toString()}
          </DialogTitle>
          <TypographySmall>
            Motivo:{" "}
            <span className="text-muted-foreground">
              {ocorrencia.Motivo?.MotivoDS}
            </span>
          </TypographySmall>
          <TypographySmall>
            Regulador:{" "}
            <span className="text-muted-foreground">
              {formatProperName(
                ocorrencia.FORMEQUIPE_SolicitacaoVeiculo[0]?.Operador
                  ?.OperadorNM,
              )}
            </span>
          </TypographySmall>
          <TypographySmall>
            Bairro:{" "}
            <span className="text-muted-foreground">
              {formatProperName(ocorrencia.Bairro)}
            </span>
          </TypographySmall>
          <TypographySmall>
            Data:{" "}
            <span className="text-muted-foreground">
              {formatClientDateToLocaleString(ocorrencia.DtHr)}
            </span>
          </TypographySmall>
        </DialogHeader>

        <Separator />
        <ScrollArea className="h-[60vh] sm:h-max">
          <Carousel className="mx-auto w-full">
            <CarouselContent>
              {ocorrencia.Vitimas.length > 0 && (
                <CarouselItem>
                  <ModalOcorrenciaVitimas
                    vitimas={ocorrencia.Vitimas}
                    hasPrivilege={hasPermissions}
                  />
                </CarouselItem>
              )}
              {ocorrencia.OcorrenciaMovimentacao.length > 0 && (
                <CarouselItem>
                  <ModalOcorrenciaVeiculos
                    movimentacoes={ocorrencia.OcorrenciaMovimentacao}
                    hasPrivilege={hasPermissions}
                  />
                </CarouselItem>
              )}
            </CarouselContent>
            <CarouselPrevious className="left-0 " />
            <CarouselNext className="right-0" />
          </Carousel>
        </ScrollArea>
      </DialogContent>
    </ParallelDialog>
  );
}
