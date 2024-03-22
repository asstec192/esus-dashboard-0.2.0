import { addHours, endOfDay, startOfDay, subHours } from "date-fns";
import * as z from "zod";

import { db } from "@/server/db";
import { formatServerDateRange } from "@/utils/formatServerDateRange";
import { isWithinHour } from "@/utils/isWithinTurn";
import { obterFiltroComBaseNoTurno } from "@/utils/obterFiltroComBaseNoTurno";
import { SchemaDateRange, SchemaTurno } from "@/validators";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const veiculosRouter = createTRPCRouter({
  /** Obtém todas as ocorrências relacioanadas ao veículo */
  getOcorrencias: protectedProcedure
    .input(
      z.object({
        veiculoId: z.number(),
        dateRange: SchemaDateRange,
        turn: SchemaTurno,
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
        ).map((mov) => mov.Ocorrencia) ?? [];

      //resposta final com o nome do veiculo e suas ocorrencias filtradas
      return {
        nome: veiculo?.VeiculoDS,
        ocorrencias,
      };
    }),

  /**Obtém a contagem de ocorrencias e pacientes atendidos por cada veiculo */
  countAtendimentos: protectedProcedure
    .input(SchemaDateRange)
    .query(async ({ ctx, input }) => {
      const { from, to } = formatServerDateRange(input);

      type Atendimento = {
        id: number;
        nome: string;
        totalOcorrencias: number;
        totalPacientes: number;
      };

      const atendimentos: Atendimento[] = await ctx.db.$queryRaw`
        SELECT
            V.VeiculoID AS id,
            V.VeiculoDS AS nome,
            COUNT(DISTINCT OM.OcorrenciaID) AS totalOcorrencias,
            COUNT(DISTINCT P.VitimaId) AS totalPacientes
        FROM Veiculos V
        JOIN OcorrenciaMovimentacao OM ON V.VeiculoID = OM.VeiculoID
        JOIN Vitimas P ON P.OcorrenciaID = OM.OcorrenciaID
        WHERE OM.EnvioEquipeDT BETWEEN ${from} AND ${to}
        GROUP BY V.VeiculoID, V.VeiculoDS
        ORDER BY V.VeiculoDS
      `;

      return atendimentos;
    }),

  /** Obtém o relatório de tempo resposta de todos os veículos, recebe como input um date range e um turno */
  getTempoResposta: protectedProcedure
    .input(z.object({ dateRange: SchemaDateRange, turn: SchemaTurno }))
    .query(async ({ input }) => {
      const filter = obterFiltroComBaseNoTurno({
        sourceDateFilter: "OM.EnvioEquipeDT",
        dateRange: input.dateRange,
        turno: input.turn,
      });

      type RelatorioVeiculo = {
        id: number;
        nome: string | null;
        QTYQUS: number | null;
        QUSQUY: number | null;
        QUYQUU: number | null;
        totalOcorrencias: number;
        pacientes: string;
      };

      const rawVeiculos: RelatorioVeiculo[] = await db.$queryRaw`
        SELECT
            V.VeiculoID AS id,
            V.VeiculoDS AS nome,
            AVG(DATEDIFF(minute, EnvioEquipeDT, ChegadaLocalDT)) AS QTYQUS,
            AVG(DATEDIFF(minute, ChegadaLocalDT, SaidaLocalDT)) AS QUSQUY,
            AVG(DATEDIFF(minute, SaidaLocalDT, ChegadaDestinoDT)) AS QUYQUU,
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
        FROM Veiculos V
        LEFT JOIN OcorrenciaMovimentacao OM ON V.VeiculoID = OM.VeiculoID
        WHERE ${filter}
        GROUP BY V.VeiculoID, V.VeiculoDS
        ORDER BY V.VeiculoDS`;

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
    // obtem todos os veiculos com status ocupado
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

    // Obtem a proporção de veiculos ocupados/disponiveis agrupada por tipo de veiculo
    const relatorio = await db.unidadeRelatorio.findFirst({
      select: {
        UnidadeRelatorioEquipamentos: {
          select: {
            equipamentoId: true,
            quantidade: true,
          },
          where: {
            equipamentoId: {
              in: [11, 12, 13, 14, 15, 16], // equipamentos referentes aos veículos
            },
          },
        },
      },
      where: {
        unidadeId: 208, // unidade referente ao SAMU
      },
      orderBy: {
        id: "desc",
      },
    });

    const veiculos = relatorio?.UnidadeRelatorioEquipamentos;

    const data = [
      {
        veiculo: "USB",
        totalOcupado: veiculosOcupados.filter((v) => v.tipo === "USB").length,
        total: veiculos?.find((v) => v.equipamentoId === 11)?.quantidade ?? 0,
      },
      {
        veiculo: "USA",
        totalOcupado: veiculosOcupados.filter((v) => v.tipo === "USA").length,
        total: veiculos?.find((v) => v.equipamentoId === 12)?.quantidade ?? 0,
      },
      {
        veiculo: "USI",
        totalOcupado: veiculosOcupados.filter((v) => v.tipo === "USI").length,
        total: veiculos?.find((v) => v.equipamentoId === 13)?.quantidade ?? 0,
      },
      {
        veiculo: "MOT",
        totalOcupado: veiculosOcupados.filter((v) => v.tipo === "MOT").length,
        total: veiculos?.find((v) => v.equipamentoId === 14)?.quantidade ?? 0,
      },
      {
        veiculo: "BIK",
        totalOcupado: veiculosOcupados.filter((v) => v.tipo === "BIK").length,
        total: veiculos?.find((v) => v.equipamentoId === 15)?.quantidade ?? 0,
      },
      {
        veiculo: "REM",
        totalOcupado: veiculosOcupados.filter((v) => v.tipo === "REM").length,
        total: veiculos?.find((v) => v.equipamentoId === 16)?.quantidade ?? 0,
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
      REM: "vti",
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
          count.find((c) => c.VeiculoTP === map.REM)?._count.VeiculoTP ?? 0,
      },
      {
        veiculo: "HEL",
        totalPendente:
          count.find((c) => c.VeiculoTP === map.HEL)?._count.VeiculoTP ?? 0,
      },
    ];

    return data;
  }),

  logSituacaoDaFrota: protectedProcedure
    .input(z.object({ date: z.date() }))
    .query(({ input }) =>
      db.dashboardLogSituacaoFrota.findMany({
        where: {
          createdAt: {
            gte: subHours(startOfDay(input.date), 3),
            lte: subHours(endOfDay(input.date), 3),
          },
        },
      }),
    ),

  /** Obtém o percentual de solicitações de veículos pendentes ao longo do tempo*/
  logSolicitacoesPendentes: protectedProcedure
    .input(z.object({ date: z.date() }))
    .query(async ({ input }) => {
      const solicitacoes = await db.dashboardLogSolicitacoesPendentes.findMany({
        where: {
          createdAt: {
            gte: subHours(startOfDay(input.date), 3),
            lte: subHours(endOfDay(input.date), 3),
          },
        },
      });

      const veiculos = await db.dashboardLogSituacaoFrota.findMany({
        where: {
          createdAt: {
            gte: subHours(startOfDay(input.date), 3),
            lte: subHours(endOfDay(input.date), 3),
          },
        },
      });

      function calculatePercentage(a: number, b: number) {
        const percentage = Math.ceil((a / b) * 100);
        if (isNaN(percentage)) return 0;
        if (!isFinite(percentage)) return 100;
        return percentage;
      }

      const mergedData = solicitacoes.map((solicitacao, i) => ({
        USB_pendentes: solicitacao.USB,
        USB_disponiveis: veiculos[i]?.USB_total,
        USB_percentual: calculatePercentage(
          solicitacao.USB,
          veiculos[i]?.USB_total ?? 0,
        ),
        USA_pendentes: solicitacao.USA,
        USA_disponiveis: veiculos[i]?.USA_total,
        USA_percentual: calculatePercentage(
          solicitacao.USA,
          veiculos[i]?.USA_total ?? 0,
        ),
        USI_pendentes: solicitacao.USI,
        USI_disponiveis: veiculos[i]?.USI_total,
        USI_percentual: calculatePercentage(
          solicitacao.USI,
          veiculos[i]?.USI_total ?? 0,
        ),
        MOT_pendentes: solicitacao.MOT,
        MOT_disponiveis: veiculos[i]?.MOT_total,
        MOT_percentual: calculatePercentage(
          solicitacao.MOT,
          veiculos[i]?.MOT_total ?? 0,
        ),
        BIK_pendentes: solicitacao.BIK,
        BIK_disponiveis: veiculos[i]?.BIK_total,
        BIK_percentual: calculatePercentage(
          solicitacao.BIK,
          veiculos[i]?.BIK_total ?? 0,
        ),
        REM_pendentes: solicitacao.REM,
        REM_disponiveis: veiculos[i]?.REM_total,
        REM_percentual: calculatePercentage(
          solicitacao.REM,
          veiculos[i]?.REM_total ?? 0,
        ),
        createdAt: solicitacao.createdAt,
      }));

      return mergedData;
    }),
});
