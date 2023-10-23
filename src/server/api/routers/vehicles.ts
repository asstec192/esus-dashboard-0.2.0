import { prisma } from "@/server/db";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import * as z from "zod";
import { formatServerDateRange } from "@/utils/formatServerDateRange";
import { dateRangeInput, turnInput } from "@/hooks/useGlobalDateFilterStore";
import { getTurnQuery } from "@/utils/getTurnQuery";

export const vehicleRouter = createTRPCRouter({
  //---------OBTEM TODAS AS OCORRENCIAS ATENDIDAS PELO VEICULO--------//
  getIncidents: protectedProcedure
    .input(z.object({ vehicleId: z.number(), dateRange: dateRangeInput }))
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
  getResponseTimes: protectedProcedure
    .input(z.object({ dateRange: dateRangeInput, turn: turnInput }))
    .query(async ({ input }) => {
      const { from, to } = formatServerDateRange(input.dateRange);
      const turnRangeQuery = getTurnQuery(input.turn);
      return await prisma.$queryRaw<TempoRespostaVeiculos[]>`
        SELECT
            V.VeiculoID AS id,
            V.VeiculoDS AS nome,
            AVG(DATEDIFF(MINUTE, OM.EnvioEquipeDT, OM.ChegadaLocalDT)) AS QTYQUS,
            AVG(DATEDIFF(MINUTE, OM.SaidaLocalDT, OM.ChegadaDestinoDT)) AS  QUSQUY,
            AVG(DATEDIFF(MINUTE, OM.ChegadaDestinoDT, OM.RetornoDestinoDT)) AS QUYQUU,
          COUNT(OM.OcorrenciaID) AS totalOcorrencias
        FROM Veiculos V 
        LEFT JOIN OcorrenciaMovimentacao OM ON V.VeiculoID = OM.VeiculoID
        LEFT JOIN Ocorrencia O ON O.OcorrenciaID = OM.OcorrenciaID
        WHERE O.DtHr BETWEEN ${from} AND ${to} ${turnRangeQuery}
        GROUP BY V.VeiculoID, V.VeiculoDS`;
    }),
});
