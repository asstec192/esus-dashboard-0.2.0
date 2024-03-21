import { Prisma } from "@prisma/client";
import * as z from "zod";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { db } from "@/server/db";
import { formatServerDateRange } from "@/utils/formatServerDateRange";
import { getColorByRisk } from "@/utils/getColorByRisk";
import { SchemaDateRange } from "@/validators";

export const ocorrenciaRouter = createTRPCRouter({
  getOne: protectedProcedure
    .input(z.object({ incidentId: z.number() }))
    .mutation(({ input }) =>
      db.ocorrencia.findUnique({
        select: {
          OcorrenciaID: true,
          Bairro: true,
          DtHr: true,
          OcorrenciaFinalDT: true,
          riscoColorClass: true,
          QueixaDS: true,
          Logradouro: true,
          Logradouro_: { select: { Abreviatura: true } },
          Numero: true,
          ReferenciaDS: true,
          Municipio: { select: { Municipio: true } },
          CLASSIFICACAO_RISCO: { select: { RISCODS: true } },
          Motivo: { select: { MotivoDS: true } },
          Tipo: { select: { TipoDS: true } },
          Origem: { select: { OrigemOcoDS: true } },
          Solicitante: {
            select: {
              SolicitanteNM: true,
              TelefoneDDD: true,
              TelefoneNM: true,
            },
          },
          Ligacao: { select: { LigacaoTPDS: true } },
          FORMEQUIPE_SolicitacaoVeiculo: {
            select: {
              Operador: {
                select: {
                  OperadorNM: true,
                },
              },
            },
            where: {
              VeiculoSEQ: 1,
            },
            take: 1,
          },
          OcorrenciaMovimentacao: {
            include: {
              Veiculo: {
                select: {
                  VeiculoDS: true,
                  HISTORICO_CONDUTA: {
                    select: {
                      DTHR_CONDUTA: true,
                      OBS_MEDICO: true,
                      vitima: { select: { VitimaNM: true } },
                    },
                    where: { OCORRENCIAID: input.incidentId },
                    orderBy: { DTHR_CONDUTA: "asc" },
                  },
                },
              },
            },
          },
          Vitimas: {
            select: {
              VitimaNM: true,
              VitimaId: true,
              Idade: true,
              Sexo_: { select: { SEXO: true } },
              Classificacao: { select: { ClassifVitimaDS: true } },
              IdadeTP_Vitimas_IdadeTPToIdadeTP: {
                select: {
                  IdadeTPDS: true,
                },
              },
              OCORRENCIA_AVALIACAO_INICIAL: {
                select: {
                  DTHR: true,
                  AVALICAO: true,
                  Operador: {
                    select: {
                      OperadorNM: true,
                    },
                  },
                },
              },
              HistoricoDecisaoGestora: {
                select: {
                  DECISAOID: true,
                  OperadorDecisao: { select: { OperadorNM: true } },
                  OperadorDestino: { select: { OperadorNM: true } },
                  OperadorIntercorrencia: { select: { OperadorNM: true } },
                  Decisao: { select: { TransporteDS: true } },
                  Destino: { select: { UnidadeDS: true } },
                  Intercorrencia: { select: { IntercorrenciaDS: true } },
                  DTHR_DECISAO_GESTORAID: true,
                  DTHR_DESTINOID: true,
                  DTHR_INTERCORRENCIAID: true,
                  OBSERVACAO: true,
                },
                where: { STATUS: "F" },
                orderBy: {
                  DTHR_DECISAO_GESTORAID: "desc",
                },
              },
            },
          },
          PosicaoOcorrencias: {
            select: {
              OpOrigem: { select: { OperadorNM: true } },
              OpDestino: { select: { OperadorNM: true } },
              DestinoDTHR: true,
            },
            orderBy: { DestinoDTHR: "asc" },
          },
        },
        where: {
          OcorrenciaID: input.incidentId,
        },
      }),
    ),

  getAll: protectedProcedure
    .input(z.object({ dateRange: SchemaDateRange, emAtendimento: z.boolean() }))
    .query(async ({ input }) => {
      const { from, to } = formatServerDateRange(input.dateRange);
      const filters = input.emAtendimento
        ? Prisma.sql`
          WHERE O.OcorrenciaID IN 
            (
            SELECT DISTINCT OM.OcorrenciaID as ocorrenciaID
            FROM Veiculos V
            JOIN MovimentacoesNumeradas OM ON V.VeiculoID = OM.VeiculoID
            WHERE V.Status = 'O' AND OM.rn = 1
          )`
        : Prisma.sql`WHERE o.LigacaoTPID IN (9, 11, 15, 20) AND o.DtHr BETWEEN ${from} AND ${to}`;

      const CTE = input.emAtendimento
        ? Prisma.sql`
          WITH MovimentacoesNumeradas AS (
          SELECT *, ROW_NUMBER() OVER (PARTITION BY VeiculoID ORDER BY EnvioEquipeDT DESC) AS rn
          FROM OcorrenciaMovimentacao
        )`
        : Prisma.empty;

      const rawData = await db.$queryRaw<OcorrenciaRaw[]>`
        ${CTE}
        SELECT 
          o.OcorrenciaID as id,
          o.DtHr as data,
          o.Bairro as bairro,
          o.RISCOCOD as risco,
          m.MotivoDS AS motivo,
          (
            SELECT TOP 1 od.OperadorNM as nome_operador
            FROM FORMEQUIPE_SolicitacaoVeiculo sv
            JOIN OperadoresDados od ON sv.OperadorID = od.OperadorID
            WHERE sv.OcorrenciaID = o.OcorrenciaID AND sv.VeiculoSEQ = 1
          ) AS operador,
          (
            SELECT v.VitimaNM as nome, v.Sexo as sexo, v.Idade as idade, i.IdadeTPDS as idadeTipo
            FROM Vitimas v
            JOIN IdadeTP i ON i.IdadeTP = v.IdadeTP
            WHERE o.OcorrenciaID = v.OcorrenciaID
            FOR JSON PATH
          ) AS vitimas,
          (
            SELECT om.EnvioEquipeDT, om.ChegadaBaseDT, om.ChegadaDestinoDT,
                  om.ChegadaLocalDT, om.SaidaBaseDT, om.RetornoDestinoDT,
                  om.SaidaLocalDT, ve.VeiculoDS as nome, ve.Status as status
            FROM OcorrenciaMovimentacao om
            JOIN Veiculos ve ON om.VeiculoID = ve.VeiculoID
            WHERE o.OcorrenciaID = om.OcorrenciaID
            ORDER BY om.EnvioEquipeDT ASC
            FOR JSON PATH
          ) AS veiculos
        FROM Ocorrencia o
        LEFT JOIN Motivo m ON o.MotivoID = m.MotivoID
        LEFT JOIN LigacaoTP lt ON lt.LigacaoTPID = o.LigacaoTPID
        ${filters}
        ORDER BY o.OcorrenciaID DESC`;

      const ocorrencias: Ocorrencia[] = rawData.map((ocorrencia) => ({
        id: ocorrencia.id.toString(),
        data: ocorrencia.data,
        bairro: ocorrencia.bairro ?? "",
        risco: ocorrencia.risco,
        riscoColorClass: getColorByRisk(ocorrencia.risco),
        operador: ocorrencia.operador ?? "",
        motivo: ocorrencia.motivo?.replace(/\*/g, "") || "NÃO PREENCHIDO",
        veiculos: ocorrencia.veiculos ? JSON.parse(ocorrencia.veiculos) : [],
        pacientes: ocorrencia.vitimas ? JSON.parse(ocorrencia.vitimas) : [],
      }));

      return ocorrencias;
    }),

  tipos: protectedProcedure.query(() =>
    db.tipo.findMany({
      select: {
        TipoID: true,
        TipoDS: true,
      },
    }),
  ),

  countByRisco: protectedProcedure
    .input(SchemaDateRange)
    .query(async ({ input }) => {
      const { from, to } = formatServerDateRange(input);

      //obtendo dados brutos dos riscos com contagens de ocorrencias
      const rawData = await db.cLASSIFICACAO_RISCO.findMany({
        select: {
          RISCODS: true,
          riscoColorClass: true,
          _count: {
            select: {
              Ocorrencia: {
                where: {
                  //somente ocorrencias apos a data
                  DtHr: {
                    gte: from,
                    lt: to,
                  },
                },
              },
            },
          },
        },
        //somente riscos de 1 a 4
        where: {
          RISCOCOD: { in: [1, 2, 3, 4] },
        },
        orderBy: { RISCOCOD: "asc" },
      });

      //tratando os dados
      const riscoCount = rawData.map((r) => ({
        label: r.RISCODS,
        colorClass: r.riscoColorClass,
        count: r._count.Ocorrencia,
      }));

      //reposta para o client
      return riscoCount;
    }),

  // Contagem de ocorrencias por tipo de ocorrencia
  countByTipo: protectedProcedure
    .input(
      z.object({
        dateRange: SchemaDateRange,
        somenteComEnvioDeVeiculo: z.boolean(),
      }),
    )
    .query(async ({ input, ctx }) => {
      const { from, to } = formatServerDateRange(input.dateRange);

      const tipos = await ctx.db.tipo.findMany({
        select: {
          TipoDS: true,
          TipoID: true,
          _count: {
            select: {
              Ocorrencia: {
                where: {
                  DtHr: {
                    gte: from,
                    lt: to,
                  },
                  ...(input.somenteComEnvioDeVeiculo && {
                    OcorrenciaMovimentacao: { some: {} },
                  }),
                },
              },
            },
          },
        },
      });

      return tipos
        .map((tipo) => ({
          tipoId: tipo.TipoID,
          tipo: tipo.TipoDS?.replace(/\*/g, "") ?? "", // remove asteriscos
          count: tipo._count.Ocorrencia,
        }))
        .sort((a, b) =>
          a.count === b.count
            ? a.tipo.localeCompare(b.tipo)
            : a.count - b.count,
        );
    }),

  countByMotivo: protectedProcedure
    .input(
      z.object({
        dateRange: SchemaDateRange,
        somenteComEnvioDeVeiculo: z.boolean(),
      }),
    )
    .query(async ({ input }) => {
      const { from, to } = formatServerDateRange(input.dateRange);

      const count = await db.motivo.findMany({
        select: {
          TipoID: true,
          MotivoDS: true,
          _count: {
            select: {
              Ocorrencia: {
                where: {
                  DtHr: {
                    gte: from,
                    lt: to,
                  },
                  ...(input.somenteComEnvioDeVeiculo && {
                    OcorrenciaMovimentacao: { some: {} },
                  }),
                },
              },
            },
          },
        },
      });

      return count
        .map((item) => ({
          motivo: item.MotivoDS?.replace(/\*/g, "") ?? "",
          count: item._count.Ocorrencia,
          tipoId: item.TipoID,
        }))
        .filter((item) => item.count > 0)
        .sort((a, b) =>
          a.count === b.count
            ? a.motivo.localeCompare(b.motivo)
            : a.count - b.count,
        );
    }),

  countByTipoLigacao: protectedProcedure
    .input(SchemaDateRange)
    .query(async ({ input }) => {
      const { from, to } = formatServerDateRange(input);

      const rawData = await db.ligacaoTP.findMany({
        select: {
          LigacaoTPDS: true,
          _count: {
            select: {
              Ocorrencia: {
                where: {
                  DtHr: { gte: from, lt: to },
                },
              },
            },
          },
        },
      });

      const ligacoes = rawData
        .filter((l) => l._count.Ocorrencia > 0)
        .map((l) => ({
          ligacao: l.LigacaoTPDS ?? "",
          count: l._count.Ocorrencia,
        }))
        .sort((a, b) =>
          a.count === b.count
            ? a.ligacao.localeCompare(b.ligacao)
            : a.count - b.count,
        );

      return ligacoes;
    }),

  countByHoraDeEnvioDoVeiculo: protectedProcedure
    .input(SchemaDateRange)
    .query(async ({ input }) => {
      const { from, to } = formatServerDateRange(input);

      const contagemPorIntervalo = await db.$queryRaw<
        { intervalo: string; count: number }[]
      >`
          WITH Intervalos AS (
            SELECT 
                CASE 
                    WHEN DATEPART(HOUR, EnvioEquipeDT) >= 1 AND DATEPART(HOUR, EnvioEquipeDT) < 4 THEN '01:00-04:00'
                    WHEN DATEPART(HOUR, EnvioEquipeDT) >= 4 AND DATEPART(HOUR, EnvioEquipeDT) < 7 THEN '04:00-07:00'
                    WHEN DATEPART(HOUR, EnvioEquipeDT) >= 7 AND DATEPART(HOUR, EnvioEquipeDT) < 10 THEN '07:00-10:00'
                    WHEN DATEPART(HOUR, EnvioEquipeDT) >= 10 AND DATEPART(HOUR, EnvioEquipeDT) < 13 THEN '10:00-13:00'
                    WHEN DATEPART(HOUR, EnvioEquipeDT) >= 13 AND DATEPART(HOUR, EnvioEquipeDT) < 16 THEN '13:00-16:00'
                    WHEN DATEPART(HOUR, EnvioEquipeDT) >= 16 AND DATEPART(HOUR, EnvioEquipeDT) < 19 THEN '16:00-19:00'
                    WHEN DATEPART(HOUR, EnvioEquipeDT) >= 19 AND DATEPART(HOUR, EnvioEquipeDT) < 22 THEN '19:00-22:00'
                    WHEN DATEPART(HOUR, EnvioEquipeDT) >= 22 OR DATEPART(HOUR, EnvioEquipeDT) < 1 THEN '22:00-01:00'
                END AS intervalo
            FROM OcorrenciaMovimentacao
            WHERE EnvioEquipeDT BETWEEN ${from} AND ${to} 
        )

        SELECT 
            Intervalos.intervalo,
            COUNT(*) AS count
        FROM Intervalos
        GROUP BY Intervalos.intervalo
        ORDER BY Intervalos.intervalo`;

      const intervalos: Record<string, number> = {
        "01:00-04:00": 0,
        "04:00-07:00": 0,
        "07:00-10:00": 0,
        "10:00-13:00": 0,
        "13:00-16:00": 0,
        "16:00-19:00": 0,
        "19:00-22:00": 0,
        "22:00-01:00": 0,
      };

      // garantindo que todos os intervalos apareçam mesmo com contagem 0
      contagemPorIntervalo.forEach((item) => {
        intervalos[item.intervalo] = item.count;
      });

      const resultadoFinal = Object.keys(intervalos).map((intervalo) => {
        return { intervalo, count: intervalos[intervalo] };
      });

      return resultadoFinal;
    }),

  countByTipoDeVeiculo: protectedProcedure
    .input(SchemaDateRange)
    .query(async ({ input }) => {
      const { from, to } = formatServerDateRange(input);

      //obtem a contagem para cada veiculo unico
      const veiculos = await db.veiculos.findMany({
        select: {
          tipo: true,
          _count: {
            select: {
              OcorrenciaMovimentacao: {
                where: {
                  Ocorrencia: {
                    DtHr: {
                      gte: from,
                      lt: to,
                    },
                  },
                },
              },
            },
          },
        },
      });

      //tratamento para obter a contagem para cada "tipo" de veiculo
      const tiposDeVeiculos = veiculos.reduce(
        (acc, veiculo) => {
          const tipo = veiculo.tipo;
          const count = veiculo._count.OcorrenciaMovimentacao;

          // Verifica se o tipo de veiculo ja existe no "acc"
          const existingType = acc.find((item) => item.tipo === tipo);

          if (existingType) {
            existingType.count += count; //se existir soma as contagens
          } else {
            acc.push({ tipo, count }); // se nao adiciona o objeto ao "acc"
          }

          return acc;
        },
        [] as { tipo: (typeof veiculos)[0]["tipo"]; count: number }[],
      );

      // resposta final ao client
      return tiposDeVeiculos.filter((v) => v.tipo !== null);
    }),
});
