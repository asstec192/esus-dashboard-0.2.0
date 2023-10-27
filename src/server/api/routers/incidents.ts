import * as z from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { ocorrenciasPorRisco } from "@/lib/ocorrencias-por-risco";
import { ligacoesPorTipo } from "@/lib/ligacoes-por-tipo";
import { ocorrenciasPorHorarioDeDeslocamento } from "@/lib/ocorrencias-por-horario-deslocamento";
import { ocorrenciasPorTipoDeVeiculo } from "@/lib/ocorrencias-por-tipo-veiculo";
import { prisma } from "@/server/db";
import { dateRangeInput } from "@/hooks/useGlobalDateFilterStore";
import { estatisticasDiarias } from "@/lib/estatisticas-diarias";
import { formatServerDateRange } from "@/utils/formatServerDateRange";
import { subHours } from "date-fns";

export const incidentsRouter = createTRPCRouter({
  getOne: protectedProcedure
    .input(z.object({ incidentId: z.number() }))
    .query(({ input }) =>
      prisma.ocorrencia.findUnique({
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
                },
              },
            },
          },
          Vitimas: {
            select: {
              VitimaNM: true,
              VitimaId: true,
              Sexo: true,
              Idade: true,
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
                take: 1,
                select: {
                  Destino: {
                    select: {
                      UnidadeDS: true,
                    },
                  },
                },
                orderBy: {
                  DTHR_DECISAO_GESTORAID: "desc",
                },
              },
            },
          },
        },
        where: {
          OcorrenciaID: input.incidentId,
        },
      }),
    ),
  getAll: protectedProcedure.input(dateRangeInput).query(async ({ input }) => {
    const { from, to } = formatServerDateRange(input);
    const data = await prisma.$queryRaw<[]>`
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
                om.SaidaLocalDT, ve.VeiculoDS as nome
          FROM OcorrenciaMovimentacao om
          JOIN Veiculos ve ON om.VeiculoID = ve.VeiculoID
          WHERE o.OcorrenciaID = om.OcorrenciaID
          ORDER BY om.EnvioEquipeDT ASC
          FOR JSON PATH
        ) AS veiculos
      FROM Ocorrencia o
      LEFT JOIN Motivo m ON o.MotivoID = m.MotivoID
      LEFT JOIN LigacaoTP lt ON lt.LigacaoTPID = o.LigacaoTPID
      WHERE 
        o.LigacaoTPID IN (9, 11, 15, 20) AND o.DtHr BETWEEN ${from} AND  ${to}
      ORDER BY
        o.OcorrenciaID DESC`;

    return data.map((ocorrencia?: any) => ({
      id: ocorrencia.id.toString(),
      data: ocorrencia.data,
      bairro: ocorrencia.bairro || "",
      risco: ocorrencia.risco,
      desfecho: ocorrencia.desfecho,
      operador: ocorrencia.operador || "",
      motivo: ocorrencia.motivo?.replace(/\*/g, "") || "NÃO PREENCHIDO",
      veiculos: ocorrencia.veiculos ? JSON.parse(ocorrencia.veiculos) : [],
      pacientes: ocorrencia.vitimas ? JSON.parse(ocorrencia.vitimas) : [],
    })) as Ocorrencia[];
  }),
  getAllInProgress: protectedProcedure.query(async () => {
    //tirando 3 horas para ficar com fuso compativel
    const date = subHours(new Date().setHours(1, 0, 0, 0), 3);
    const data = await prisma.$queryRaw<[]>`
    SELECT
      DISTINCT
      o.DtHr,
      o.OcorrenciaID as id,
      o.Bairro as bairro,
      o.RISCOCOD as risco,
      m.MotivoDS AS motivo,
       -- Seleciona o operador que enviou o primeiro veículo (VeiculoSEQ = 1) para cada ocorrência
      (
        SELECT TOP 1 od.OperadorNM as nome_operador
        FROM FORMEQUIPE_SolicitacaoVeiculo sv
        JOIN OperadoresDados od ON sv.OperadorID = od.OperadorID
        WHERE sv.OcorrenciaID = o.OcorrenciaID AND sv.VeiculoSEQ = 1
      ) AS operador,
      --Seleciona os veiculos movimentados de cada ocorrencia
      (
        SELECT om.EnvioEquipeDT, om.ChegadaBaseDT, om.ChegadaDestinoDT,
              om.ChegadaLocalDT, om.SaidaBaseDT, om.RetornoDestinoDT,
              om.SaidaLocalDT, ve.VeiculoDS as nome
        FROM OcorrenciaMovimentacao om
        JOIN Veiculos ve ON om.VeiculoID = ve.VeiculoID
        WHERE o.OcorrenciaID = om.OcorrenciaID
        ORDER BY  om.EnvioEquipeDT ASC
        FOR JSON PATH
      ) AS veiculos
    FROM
      Ocorrencia o
    LEFT JOIN Motivo m ON o.MotivoID = m.MotivoID
	  JOIN OcorrenciaMovimentacao om ON o.OcorrenciaID = om.OcorrenciaID
	  JOIN Veiculos v ON om.VeiculoID = v.VeiculoID
    WHERE
      o.RISCOCOD NOT IN (0, 90)
      AND o.DtHr >= ${date}
      AND v.status = 'O'
      AND o.OcorrenciaFinalDT IS NULL
      AND om.RetornoDestinoDT IS NULL
    ORDER BY
      o.DtHr DESC
    `;
    //@ts-ignore Fazendo o parse apenas dos campos veiculos e vitimas que são JSON
    return data.map((ocorrencia: any) => ({
      id: ocorrencia.id.toString(),
      bairro: ocorrencia.bairro,
      risco: ocorrencia.risco,
      operador: ocorrencia.operador,
      motivo: ocorrencia.motivo?.replace(/\*/g, "") || "NÃO PREENCHIDO",
      veiculos: ocorrencia.veiculos ? JSON.parse(ocorrencia.veiculos) : [],
    })) as OcorrenciaEmAndamento[];
  }),
  getTotalIncidentsByRisk: publicProcedure.query(() => ocorrenciasPorRisco()),
  getTotalIncidentsByCallType: publicProcedure.query(() => ligacoesPorTipo()),
  getTotalIncidentsByHour: publicProcedure
    .input(dateRangeInput)
    .query(({ input }) => ocorrenciasPorHorarioDeDeslocamento(input)),
  getTotalIncidentsByVehicleType: publicProcedure
    .input(dateRangeInput)
    .query(({ input }) => ocorrenciasPorTipoDeVeiculo(input)),
  getDailyInfo: protectedProcedure.query(() => estatisticasDiarias()),
});
