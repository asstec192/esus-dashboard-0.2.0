import { db } from "@/server/db";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import * as z from "zod";
import { getTurnFilterQuery } from "@/utils/getTurnQuery";
import { formatServerDateRange } from "@/utils/formatServerDateRange";
import { addHours } from "date-fns";
import { turnosVeiculos } from "@/constants/turnos";
import { dateRangeSchema, turnoSchema } from "@/constants/zod-schemas";

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
        dateRange: dateRangeSchema,
        turn: turnoSchema,
      }),
    )
    .mutation(async ({ input }) => {
      const { from, to } = formatServerDateRange(input.dateRange);
      const turnoDeVeiculo = turnosVeiculos.some(
        (turno) => turno.label === input.turn.label,
      );
      return await db.ocorrencia.findMany({
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
            gte: turnoDeVeiculo ? addHours(from, 7) : addHours(from, 1), //primeiro turno inicia as 1h. 7h caso seja se veiculos
            lt: turnoDeVeiculo ? addHours(to, 7) : addHours(to, 1), //ultimo turno encerra as 1h. 7h caso seja se veiculos
          },
          HISTORICO_DECISAO_GESTORA: {
            some: {
              INTERCORRENCIAID: input.intercorrenciaId,
            },
          },
        },
        orderBy: {
          OcorrenciaID: "desc",
        },
      });
    }),

  countIncidents: protectedProcedure
    .input(z.object({ dateRange: dateRangeSchema, turn: turnoSchema }))
    .query(async ({ input }) => {
      const filter = getTurnFilterQuery(input.dateRange, input.turn);
      return await db.$queryRaw<IntercorrenciaCount[]>`
        SELECT 
          I.IntercorrenciaDS as description, 
          I.IntercorrenciaID as id, 
          COUNT(DISTINCT O.OCORRENCIAID) AS count
        FROM Intercorrencias I
        LEFT JOIN HISTORICO_DECISAO_GESTORA HDG ON HDG.INTERCORRENCIAID = I.IntercorrenciaID
        LEFT JOIN Ocorrencia O ON O.OcorrenciaID = HDG.OcorrenciaID 
        WHERE ${filter}
        GROUP BY I.IntercorrenciaDS, I.IntercorrenciaID
        ORDER BY I.IntercorrenciaDS   
    `;
    }),
});
