import { db } from "@/server/db";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import * as z from "zod";
import { formatServerDateRange } from "@/utils/formatServerDateRange";
import { getTurnFilterQuery } from "@/utils/getTurnQuery";
import { addHours } from "date-fns";
import { dateRangeSchema, turnoSchema } from "@/constants/zod-schemas";
import { isWithinHour } from "@/utils/isWithinTurn";

export const vehicleRouter = createTRPCRouter({
  /**
   * Obtém todas as ocorrências relacioanadas ao veículo, recebe como input um date range
   */
  getIncidents: protectedProcedure
    .input(
      z.object({
        vehicleId: z.number(),
        dateRange: dateRangeSchema,
        turn: turnoSchema,
      }),
    )
    .query(async ({ input }) => {
      const { from, to } = formatServerDateRange(input.dateRange);

      //obtem o veiculo com suas respectivas ocorrencias
      const veiculo = await db.veiculos.findUnique({
        where: { VeiculoID: input.vehicleId },
        select: {
          VeiculoDS: true,
          OcorrenciaMovimentacao: {
            distinct: ["OcorrenciaID"],
            select: {
              EnvioEquipeDT: true,
              Ocorrencia: {
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
              },
            },
            where: {
              EnvioEquipeDT: {
                gte:
                  input.turn.category === "veiculo"
                    ? addHours(from, 7)
                    : addHours(from, 1), //primeiro turno inicia as 1h. 7h caso seja se veiculos
                lt:
                  input.turn.category === "veiculo"
                    ? addHours(to, 7)
                    : addHours(to, 1), //ultimo turno encerra as 1h. 7h caso seja se veiculos
              },
            },
            orderBy: { OcorrenciaID: "desc" },
          },
        },
      });

      //obtendo as ocorrencias filtradas pelo turno
      const ocorrencias =
        veiculo?.OcorrenciaMovimentacao.filter(
          (movimentacao) =>
            movimentacao.EnvioEquipeDT &&
            isWithinHour(
              addHours(movimentacao.EnvioEquipeDT, 3),
              input.turn.from,
              input.turn.to,
            ),
        ).map((mov) => mov.Ocorrencia) || [];

      //resposta final com o nome do veiculo e suas ocorrencias filtradas
      return {
        nome: veiculo?.VeiculoDS,
        ocorrencias,
      };
    }),

  /**
   * Obtém o relatório de tempo resposta de todos os veículos, recebe como input um date range e um turno
   */
  getReport: protectedProcedure
    .input(z.object({ dateRange: dateRangeSchema, turn: turnoSchema }))
    .query(async ({ input }) => {
      const filter = getTurnFilterQuery(
        "OM.EnvioEquipeDT",
        input.dateRange,
        input.turn,
      );

      const veiculos = await db.$queryRaw<RelatorioVeiculo[]>`
        SELECT
            V.VeiculoID AS id,
            V.VeiculoDS AS nome,
            AVG(DATEDIFF(MINUTE, OM.EnvioEquipeDT, OM.ChegadaLocalDT)) AS QTYQUS,
            AVG(DATEDIFF(MINUTE, OM.SaidaLocalDT, OM.ChegadaDestinoDT)) AS  QUSQUY,
            AVG(DATEDIFF(MINUTE, OM.ChegadaDestinoDT, OM.RetornoDestinoDT)) AS QUYQUU,
            COUNT(DISTINCT OM.OcorrenciaID) AS totalOcorrencias,
            (
                SELECT
                    O.OcorrenciaID as ocorrenciaId,
                    P.VitimaNM AS nome
                FROM OcorrenciaMovimentacao OM
                LEFT JOIN Ocorrencia O ON O.OcorrenciaID = OM.OcorrenciaID
                LEFT JOIN Vitimas P ON P.OcorrenciaID = OM.OcorrenciaID
                WHERE V.VeiculoID = OM.VeiculoID AND ${filter}
                FOR JSON PATH
            ) AS pacientes
        FROM
            Veiculos V
        LEFT JOIN
            OcorrenciaMovimentacao OM ON V.VeiculoID = OM.VeiculoID
        WHERE ${filter}
        GROUP BY
            V.VeiculoID, V.VeiculoDS
        ORDER BY
            V.VeiculoDS`;

      return veiculos.map((veiculo) => ({
        ...veiculo,
        pacientes: JSON.parse(veiculo.pacientes) as PacientesVeiculo[],
      }));
    }),
});
