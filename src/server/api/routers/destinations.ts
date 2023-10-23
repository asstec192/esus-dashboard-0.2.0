import { prisma } from "@/server/db";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import * as z from "zod";
import { dateRangeInput, turnInput } from "@/hooks/useGlobalDateFilterStore";
import { formatServerDateRange } from "@/utils/formatServerDateRange";
import { getTurnQuery } from "@/utils/getTurnQuery";

export const destinationRouter = createTRPCRouter({
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
            gte: from,
            lt: to,
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
  getResponseTimes: protectedProcedure
    .input(z.object({ dateRange: dateRangeInput, turn: turnInput }))
    .query(async ({ input }) => {
      const { from, to } = formatServerDateRange(input.dateRange);
      const turnRangeQuery = getTurnQuery(input.turn);
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
        WHERE O.DtHr BETWEEN ${from} AND ${to} ${turnRangeQuery}
        GROUP BY
            UD.UnidadeCOD,
            UD.UnidadeDS
        ORDER BY
            tempo ASC`;
    }),
});
