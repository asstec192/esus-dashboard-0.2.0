import { prisma } from "@/server/db";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import * as z from "zod";
import { dateRangeInput } from "@/hooks/useGlobalDateFilterStore";
import { formatServerDateRange } from "@/utils/formatServerDateRange";
import { getTurnFilterQuery } from "@/utils/getTurnQuery";
import { turnInput } from "@/hooks/useTurnStore";
import { addHours } from "date-fns";

export const destinationRouter = createTRPCRouter({
  /**Obtém a lista de todas as unidades de destino */
  getAll: protectedProcedure.query(() =>
    prisma.unidadesDestino.findMany({
      select: {
        UnidadeCOD: true,
        UnidadeDS: true,
      },
    }),
  ),

  /** Obtém todos as ocorrências relacionadas à unidade de destino. Recebe como input um date range */
  getIncidents: protectedProcedure
    .input(z.object({ destinationId: z.number(), dateRange: dateRangeInput }))
    .query(async ({ input }) => {
      const { from, to } = formatServerDateRange(input.dateRange);
      return await prisma.ocorrencia.findMany({
        select: {
          OcorrenciaID: true,
          Bairro: true,
          DtHr: true,
          RISCOCOD: true,
          Motivo: {
            select: {
              MotivoDS: true,
            },
          },
        },
        where: {
          DtHr: {
            gte: addHours(from, 1), //primeiro turno inicia as 1h
            lt: addHours(to, 1), //ultimo turno encerra as 1h
          },
          HISTORICO_DECISAO_GESTORA: {
            some: {
              DESTINOID: input.destinationId,
            },
          },
          LigacaoTPID: {
            in: [9, 11, 15, 20],
          },
        },
        orderBy: {
          OcorrenciaID: "desc",
        },
      });
    }),

  /**Obtém o relatório de tempo resposta da unidade de destino. Recebe como input um date range e um turno */
  getResponseTimes: protectedProcedure
    .input(z.object({ dateRange: dateRangeInput, turn: turnInput }))
    .query(async ({ input }) => {
      const filter = getTurnFilterQuery(input.dateRange, input.turn);
      return await prisma.$queryRaw<TempoRespostaDestino[]>`
        SELECT
            UD.UnidadeCOD AS id,
          UD.UnidadeDS AS nome,
            COUNT(DISTINCT OM.OcorrenciaID) AS totalOcorrencias,
            AVG(
                DATEDIFF(
                    MINUTE,
                    OM.ChegadaDestinoDT,
                    OM.RetornoDestinoDT
                )
            ) AS tempo
        FROM UnidadesDestino UD
        INNER JOIN HISTORICO_DECISAO_GESTORA HDG ON UD.UnidadeCOD = HDG.DESTINOID
        LEFT JOIN OcorrenciaMovimentacao OM ON HDG.OCORRENCIAID = OM.OcorrenciaID
        LEFT JOIN Ocorrencia O ON O.OcorrenciaID = HDG.OCORRENCIAID
        WHERE ${filter}
        GROUP BY
            UD.UnidadeCOD,
            UD.UnidadeDS
        ORDER BY
            tempo ASC`;
    }),
});
