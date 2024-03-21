import { addHours } from "date-fns";
import * as z from "zod";

import { db } from "@/server/db";
import { formatServerDateRange } from "@/utils/formatServerDateRange";
import { isWithinHour } from "@/utils/isWithinTurn";
import { obterFiltroComBaseNoTurno } from "@/utils/obterFiltroComBaseNoTurno";
import { SchemaDateRange, SchemaTurno } from "@/validators";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const destinosRouter = createTRPCRouter({
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
  getOcorrencias: protectedProcedure
    .input(
      z.object({
        destinoId: z.number(),
        dateRange: SchemaDateRange,
        turn: SchemaTurno,
      }),
    )
    .query(async ({ input }) => {
      const { from, to } = formatServerDateRange(input.dateRange);

      //busca as ocorrencias
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
              DESTINOID: input.destinoId,
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

      //filtra as ocorrencias pelo turno selecionado
      return (
        ocorrencias.filter(
          (o) =>
            o.DtHr &&
            isWithinHour(addHours(o.DtHr, 3), input.turn.from, input.turn.to),
        ) || []
      );
    }),

  /**Obtém o relatório de tempo resposta da unidade de destino. Recebe como input um date range e um turno */
  getTempoResposta: protectedProcedure
    .input(z.object({ dateRange: SchemaDateRange, turn: SchemaTurno }))
    .query(async ({ input }) => {
      const filter = obterFiltroComBaseNoTurno({
        sourceDateFilter: "O.DtHr",
        dateRange: input.dateRange,
        turno: input.turn,
      });

      type Destino = {
        id: string;
        nome: string | null;
        totalOcorrencias: number;
        tempo: number;
      };

      return await db.$queryRaw<Destino[]>`
        SELECT
            UD.UnidadeCOD AS id,
            UD.UnidadeDS AS nome,
            COUNT(DISTINCT OM.OcorrenciaID) AS totalOcorrencias,
            AVG(DATEDIFF(MINUTE, OM.ChegadaDestinoDT, OM.RetornoDestinoDT)) AS tempo
        FROM UnidadesDestino UD
        INNER JOIN HISTORICO_DECISAO_GESTORA HDG ON UD.UnidadeCOD = HDG.DESTINOID
        LEFT JOIN OcorrenciaMovimentacao OM ON HDG.OCORRENCIAID = OM.OcorrenciaID
        LEFT JOIN Ocorrencia O ON O.OcorrenciaID = HDG.OCORRENCIAID
        WHERE ${filter}
        GROUP BY UD.UnidadeCOD, UD.UnidadeDS
        ORDER BY tempo ASC`;
    }),
});
