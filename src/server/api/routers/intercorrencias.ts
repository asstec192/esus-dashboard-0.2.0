import { prisma } from "@/server/db";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import * as z from "zod";
import { dateRangeInput, turnInput } from "@/hooks/useGlobalDateFilterStore";
import { getTurnQuery } from "@/utils/getTurnQuery";
import { formatServerDateRange } from "@/utils/formatServerDateRange";

export type IntercorrenciaCount = {
  description: string;
  id: number;
  count: number;
};

export const intercorrenciaRouter = createTRPCRouter({
  getIncidents: protectedProcedure
    .input(
      z.object({
        intercorrenciaId: z.number(),
        from: z.date(),
        to: z.date(),
      }),
    )
    .query(async ({ input }) => {
      const { from, to } = formatServerDateRange(input);
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
              INTERCORRENCIAID: input.intercorrenciaId,
            },
          },
        },
      });
    }),
    
  countIncidents: protectedProcedure
    .input(z.object({ dateRange: dateRangeInput, turn: turnInput }))
    .query(async ({ input }) => {
      const { from, to } = formatServerDateRange(input.dateRange);
      const turnQuery = getTurnQuery(input.turn);
      return await prisma.$queryRaw<IntercorrenciaCount[]>`
        SELECT 
          I.IntercorrenciaDS as description, 
          I.IntercorrenciaID as id, 
          COUNT(DISTINCT O.OCORRENCIAID) AS count
        FROM Intercorrencias I
        LEFT JOIN HISTORICO_DECISAO_GESTORA HDG ON HDG.INTERCORRENCIAID = I.IntercorrenciaID
        LEFT JOIN Ocorrencia O ON O.OcorrenciaID = HDG.OcorrenciaID 
        WHERE O.DtHr BETWEEN ${from} AND ${to} ${turnQuery}
        GROUP BY I.IntercorrenciaDS, I.IntercorrenciaID
        ORDER BY I.IntercorrenciaDS   
    `;
    }),
});
