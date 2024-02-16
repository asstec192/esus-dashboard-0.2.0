import { db } from "@/server/db";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import * as z from "zod";
import { formatServerDateRange } from "@/utils/formatServerDateRange";
import { getTurnFilterQuery } from "@/utils/getTurnQuery";
import { addHours } from "date-fns";
import { dateRangeSchema, turnoSchema } from "@/constants/zod-schemas";
import { isWithinHour } from "@/utils/isWithinTurn";

export const veiculosRouter = createTRPCRouter({
  /**
   * Obtém todas as ocorrências relacioanadas ao veículo, recebe como input um date range
   */
  getOcorrencias: protectedProcedure
    .input(
      z.object({
        veiculoId: z.number(),
        dateRange: dateRangeSchema,
        turn: turnoSchema,
      }),
    )
    .query(async ({ input }) => {
      const { from, to } = formatServerDateRange(input.dateRange);
      //obtem o veiculo com suas respectivas ocorrencias
      const veiculo = await db.veiculos.findUnique({
        where: { VeiculoID: input.veiculoId },
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
                  riscoColorClass: true,
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
  getTempoResposta: protectedProcedure
    .input(z.object({ dateRange: dateRangeSchema, turn: turnoSchema }))
    .query(async ({ input }) => {
      const filter = getTurnFilterQuery(
        "OM.EnvioEquipeDT",
        input.dateRange,
        input.turn,
      );
      const rawVeiculos = await db.$queryRaw<
        {
          id: number;
          nome: string | null;
          QTYQUS: number | null;
          QUSQUY: number | null;
          QUYQUU: number | null;
          totalOcorrencias: number;
          pacientes: string;
        }[]
      >`
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

      return rawVeiculos.map((veiculo) => ({
        ...veiculo,
        pacientes: JSON.parse(veiculo.pacientes) as {
          ocorrenciaId: bigint;
          nome: string | null;
        }[],
      }));
    }),

  /**Obtem a proproção de veiculos ocupados/total */
  situacaoDaFrota: protectedProcedure.query(async () => {
    const veiculosOcupados = await db.veiculos.findMany({
      select: {
        tipo: true,
        Status: true,
      },
      where: {
        RegAtivo: {
          equals: "1",
        },
        Status: "O",
      },
    });

    const totalVeiculos = await db.unidadeRelatorioEquipamentos.findMany({
      select: {
        quantidade: true,
        equipamentoId: true,
      },
      where: {
        equipamentoId: {
          in: [11, 12, 13, 14, 15, 16],
        },
        relatorio: {
          unidadeId: 208,
        },
      },
    });

    const data = [
      {
        veiculo: "USB",
        totalOcupado: veiculosOcupados.filter((v) => v.tipo === "USB").length,
        total:
          totalVeiculos.find((v) => v.equipamentoId === 11)?.quantidade ?? 0,
      },
      {
        veiculo: "USA",
        totalOcupado: veiculosOcupados.filter((v) => v.tipo === "USA").length,
        total:
          totalVeiculos.find((v) => v.equipamentoId === 12)?.quantidade ?? 0,
      },
      {
        veiculo: "USI",
        totalOcupado: veiculosOcupados.filter((v) => v.tipo === "USI").length,
        total:
          totalVeiculos.find((v) => v.equipamentoId === 13)?.quantidade ?? 0,
      },
      {
        veiculo: "MOT",
        totalOcupado: veiculosOcupados.filter((v) => v.tipo === "MOT").length,
        total:
          totalVeiculos.find((v) => v.equipamentoId === 14)?.quantidade ?? 0,
      },
      {
        veiculo: "BIK",
        totalOcupado: veiculosOcupados.filter((v) => v.tipo === "BIK").length,
        total:
          totalVeiculos.find((v) => v.equipamentoId === 15)?.quantidade ?? 0,
      },
      {
        veiculo: "REM",
        totalOcupado: veiculosOcupados.filter((v) => v.tipo === "REM").length,
        total:
          totalVeiculos.find((v) => v.equipamentoId === 16)?.quantidade ?? 0,
      },
    ];

    return data.map((v) => ({
      veiculo: v.veiculo,
      totalOcupado: v.totalOcupado,
      totalLivre: v.total - v.totalOcupado,
    }));
  }),

  situacaoSolicitacoes: protectedProcedure.query(async () => {
    const count = await db.fORMEQUIPE_SolicitacaoVeiculo.groupBy({
      by: ["VeiculoTP"],
      _count: {
        VeiculoTP: true,
      },
      where: {
        StatusEnvio: {
          in: ["0", "4"],
        },
        VeiculoTP: {
          notIn: ["avi"],
        },
      },
    });

    const map = {
      USA: "usa",
      MOT: "mot",
      HEL: "hel",
      VTI: "vti",
      BIK: "lan",
      USB: "usb",
      USI: "vir",
    } as const;

    const data = [
      {
        veiculo: "USB",
        totalPendente:
          count.find((c) => c.VeiculoTP === map.USB)?._count.VeiculoTP ?? 0,
      },
      {
        veiculo: "USA",
        totalPendente:
          count.find((c) => c.VeiculoTP === map.USA)?._count.VeiculoTP ?? 0,
      },
      {
        veiculo: "USI",
        totalPendente:
          count.find((c) => c.VeiculoTP === map.USI)?._count.VeiculoTP ?? 0,
      },
      {
        veiculo: "MOT",
        totalPendente:
          count.find((c) => c.VeiculoTP === map.MOT)?._count.VeiculoTP ?? 0,
      },
      {
        veiculo: "BIK",
        totalPendente:
          count.find((c) => c.VeiculoTP === map.BIK)?._count.VeiculoTP ?? 0,
      },
      {
        veiculo: "REM",
        totalPendente:
          count.find((c) => c.VeiculoTP === map.VTI)?._count.VeiculoTP ?? 0,
      },
      {
        veiculo: "HEL",
        totalPendente:
          count.find((c) => c.VeiculoTP === map.HEL)?._count.VeiculoTP ?? 0,
      },
    ];

    return data;
  }),
});
