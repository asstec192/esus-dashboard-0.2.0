import { prisma } from "@/server/db";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import * as z from "zod";
import { formatServerDateRange } from "@/utils/formatServerDateRange";
import { dateRangeInput } from "@/hooks/useGlobalDateFilterStore";
import { turnInput } from "@/hooks/useTurnStore";
import { getTurnFilterQuery } from "@/utils/getTurnQuery";
import { addHours } from "date-fns";

export const vehicleRouter = createTRPCRouter({
  /**
   * Obtém todas as ocorrências relacioanadas ao veículo, recebe como input um date range
   */
  getIncidents: protectedProcedure
    .input(
      z.object({
        vehicleId: z.number(),
        dateRange: dateRangeInput,
      }),
    )
    .query(async ({ input }) => {
      const { from, to } = formatServerDateRange(input.dateRange);
      console.log(addHours(from, 7), addHours(to, 7));
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
            gte: addHours(from, 7),
            lt: addHours(to, 7),
          },
          OcorrenciaMovimentacao: {
            some: {
              VeiculoID: input.vehicleId,
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

  /**
   * Obtém o relatório de tempo resposta de todos os veículos, recebe como input um date range e um turno
   */
  getResponseTimes: protectedProcedure
    .input(z.object({ dateRange: dateRangeInput, turn: turnInput }))
    .query(async ({ input }) => {
      const filter = getTurnFilterQuery(input.dateRange, input.turn);
      return await prisma.$queryRaw<TempoRespostaVeiculos[]>`
        SELECT
            V.VeiculoID AS id,
            V.VeiculoDS AS nome,
            AVG(DATEDIFF(MINUTE, OM.EnvioEquipeDT, OM.ChegadaLocalDT)) AS QTYQUS,
            AVG(DATEDIFF(MINUTE, OM.SaidaLocalDT, OM.ChegadaDestinoDT)) AS  QUSQUY,
            AVG(DATEDIFF(MINUTE, OM.ChegadaDestinoDT, OM.RetornoDestinoDT)) AS QUYQUU,
            COUNT(DISTINCT OM.OcorrenciaID) AS totalOcorrencias,
            COUNT(DISTINCT P.VitimaId) AS totalPacientes
        FROM Veiculos V 
        LEFT JOIN OcorrenciaMovimentacao OM ON V.VeiculoID = OM.VeiculoID
        LEFT JOIN Ocorrencia O ON O.OcorrenciaID = OM.OcorrenciaID
        LEFT JOIN Vitimas P ON P.OcorrenciaID = OM.OcorrenciaID
        WHERE ${filter}
        GROUP BY V.VeiculoID, V.VeiculoDS`;
    }),
});