import { db } from "@/server/db";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import * as z from "zod";
import { getTurnFilterQuery } from "@/utils/getTurnQuery";
import { formatServerDateRange } from "@/utils/formatServerDateRange";
import { addHours } from "date-fns";
import { SchemaDateRange, SchemaTurno } from "@/validators";
import { isWithinHour } from "@/utils/isWithinTurn";

export const intercorrenciaRouter = createTRPCRouter({
  getOcorrencias: protectedProcedure
    .input(
      z.object({
        intercorrenciaId: z.number(),
        dateRange: SchemaDateRange,
        turn: SchemaTurno,
      }),
    )
    .query(async ({ input }) => {
      const { from, to } = formatServerDateRange(input.dateRange);

      //busca as ocorrencias relacionadas
      const ocorrencias = await db.ocorrencia.findMany({
        select: {
          OcorrenciaID: true,
          Bairro: true,
          DtHr: true,
          riscoColorClass: true,
          Motivo: {
            select: {
              MotivoDS: true,
            },
          },
        },
        where: {
          DtHr: {
            gte:
              input.turn.category === "veiculo"
                ? addHours(from, 7)
                : addHours(from, 1), //primeiro turno inicia as 1h. 7h caso seja se veiculos
            lt:
              input.turn.category === "veiculo"
                ? addHours(to, 7)
                : addHours(to, 1), //ultimo turno encerra as 1h. 7h caso seja se veiculos
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

      //responde com as ocorrencias filtradas pelo turno selecionado
      return (
        ocorrencias.filter(
          (o) =>
            o.DtHr &&
            isWithinHour(addHours(o.DtHr, 3), input.turn.from, input.turn.to),
        ) || []
      );
    }),

  countOcorrencias: protectedProcedure
    .input(z.object({ dateRange: SchemaDateRange, turn: SchemaTurno }))
    .query(async ({ input }) => {
      const filter = getTurnFilterQuery("O.DtHr", input.dateRange, input.turn);

      return await db.$queryRaw<
        { description: string; id: number; count: number }[]
      >`
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
