import { db } from "@/server/db";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import * as z from "zod";
import { formatServerDateRange } from "@/utils/formatServerDateRange";
import { getTurnFilterQuery } from "@/utils/getTurnQuery";
import { addHours } from "date-fns";
import { turnosVeiculos } from "@/constants/turnos";
import { dateRangeSchema, turnoSchema } from "@/constants/zod-schemas";

export const destinationRouter = createTRPCRouter({
  /**Obtém a lista de todas as unidades de destino */
  getAll: protectedProcedure.query(() =>
    db.unidadesDestino.findMany({
      select: {
        UnidadeCOD: true,
        UnidadeDS: true,
      },
    }),
  ),

  /** Obtém todos as ocorrências relacionadas à unidade de destino. Recebe como input um date range */
  getIncidents: protectedProcedure
    .input(
      z.object({
        destinationId: z.number(),
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
    .input(z.object({ dateRange: dateRangeSchema, turn: turnoSchema }))
    .query(async ({ input }) => {
      const filter = getTurnFilterQuery(input.dateRange, input.turn);
      return await db.$queryRaw<TempoRespostaDestino[]>`
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
