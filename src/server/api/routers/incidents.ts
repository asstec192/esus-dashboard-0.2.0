import * as z from "zod";
import { subHours } from "date-fns";
import { db } from "@/server/db";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { formatServerDateRange } from "@/utils/formatServerDateRange";
import { dateRangeSchema } from "@/constants/zod-schemas";

export const incidentsRouter = createTRPCRouter({
  getOne: protectedProcedure
    .input(z.object({ incidentId: z.number() }))
    .mutation(({ input }) =>
      db.ocorrencia.findUnique({
        select: {
          OcorrenciaID: true,
          Bairro: true,
          DtHr: true,
          OcorrenciaFinalDT: true,
          RISCOCOD: true,
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

  getAll: protectedProcedure.input(dateRangeSchema).query(async ({ input }) => {
    const { from, to } = formatServerDateRange(input);
    const data = await db.$queryRaw<[]>`
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
    const date = subHours(new Date().setHours(0, 0, 0, 0), 3);
    const data = await db.$queryRaw<[]>`
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

  getTotalIncidentsByRisk: protectedProcedure.query(async () => {
    const date = subHours(new Date().setHours(0, 0, 0, 0), 10000);
    return await db.$queryRaw<
      {
        risco: string;
        total: number;
      }[]
    >`
      SELECT 
        RISCODS as risco, 
        COUNT(*) AS total
      FROM Ocorrencia O
      JOIN CLASSIFICACAO_RISCO ON O.RISCOCOD = CLASSIFICACAO_RISCO.RISCOCOD
      WHERE (O.RISCOCOD BETWEEN 1 AND 4)
      AND  O.DtHr >= ${date}
      GROUP BY RISCODS
    `;
  }),

  getTotalIncidentsByCallType: protectedProcedure.query(async () => {
    const date = subHours(new Date().setHours(0, 0, 0, 0), 10000);
    return await db.$queryRaw<{ tipo: string; total: number }[]>`
      SELECT 
        LigacaoTPDS as tipo, 
        COUNT(*) AS total
      FROM Ocorrencia O
      LEFT JOIN LigacaoTP ON O.LigacaoTPID = LigacaoTP.LigacaoTPID
      WHERE O.DtHr >= ${date}
      GROUP BY LigacaoTPDS
      ORDER BY total ASC;
    `;
  }),

  getTotalIncidentsByHour: protectedProcedure
    .input(dateRangeSchema)
    .query(async ({ input }) => {
      const { from, to } = formatServerDateRange(input);
      return await db.$queryRaw<{ intervalo: string; contagem: number }[]>`
        SELECT 
          intervalo,
          COUNT(*) AS contagem
        FROM (
          SELECT 
              OM.*,
              CAST(OM.EnvioEquipeDT AS TIME) AS Horario
          FROM OcorrenciaMovimentacao OM
          JOIN Ocorrencia O ON O.OcorrenciaID = OM.OcorrenciaID
          WHERE O.DtHr BETWEEN ${from} AND ${to} 
        ) AS T
        CROSS APPLY (
          SELECT 
              CASE 
                  WHEN Horario >= '07:00:00' AND Horario < '10:00:00' THEN '07:00-10:00'
                  WHEN Horario >= '10:00:00' AND Horario < '13:00:00' THEN '10:00-13:00'
                  WHEN Horario >= '13:00:00' AND Horario < '16:00:00' THEN '13:00-16:00'
                  WHEN Horario >= '16:00:00' AND Horario < '19:00:00' THEN '16:00-19:00'
                  WHEN Horario >= '19:00:00' AND Horario < '22:00:00' THEN '19:00-22:00'
                  WHEN Horario >= '22:00:00' OR Horario < '01:00:00' THEN '22:00-01:00'
                  WHEN Horario >= '01:00:00' AND Horario < '04:00:00' THEN '01:00-04:00'
                  WHEN Horario >= '04:00:00' AND Horario < '07:00:00' THEN '04:00-07:00'
              END AS intervalo
        ) AS SubQuery
        GROUP BY intervalo
        ORDER BY 
          CASE 
              WHEN intervalo = '07:00-10:00' THEN 1
              WHEN intervalo = '10:00-13:00' THEN 2
              WHEN intervalo = '13:00-16:00' THEN 3
              WHEN intervalo = '16:00-19:00' THEN 4
              WHEN intervalo = '19:00-22:00' THEN 5
              WHEN intervalo = '22:00-01:00' THEN 6
              WHEN intervalo = '01:00-04:00' THEN 7
              WHEN intervalo = '04:00-07:00' THEN 8
          END`;
    }),

  getTotalIncidentsByVehicleType: protectedProcedure
    .input(dateRangeSchema)
    .query(async ({ input }) => {
      const { from, to } = formatServerDateRange(input);
      return await db.$queryRaw<
        {
          tipo: "USB" | "M-0" | "M-1" | "MOT" | "BIK" | "USI" | "USA";
          contagem: number;
        }[]
      >`
        SELECT
          SUBSTRING(V.VeiculoDS, 1, 3) AS tipo,
          COUNT(*) AS contagem
        FROM OcorrenciaMovimentacao OM
        JOIN Veiculos V ON V.VeiculoID = OM.VeiculoID
        JOIN Ocorrencia O ON O.OcorrenciaID = OM.OcorrenciaID
        WHERE O.DtHr BETWEEN ${from} AND ${to} 
        GROUP BY SUBSTRING(V.VeiculoDS, 1, 3)`;
    }),

  getDailyInfo: protectedProcedure.query(async () => {
    const date = subHours(new Date().setHours(0, 0, 0, 0), 3);

    const [{ totalLigacoes }]: [{ totalLigacoes: number }] = await db.$queryRaw`
      SELECT COUNT(*) AS totalLigacoes                 
      FROM TEMPO_RESPOSTA
      WHERE DT_INICIO >= ${date}
      `;

    const [{ tempoGeral }] = await db.$queryRaw<[{ tempoGeral: number }]>`
      SELECT AVG(DATEDIFF(minute, DT_INICIO, DT_FIM)) AS tempoGeral
      FROM TEMPO_RESPOSTA
      WHERE DT_INICIO >= ${date}
      `;

    const [{ QTYQUS, QUSQUY, QUYQUU }]: [
      { QTYQUS: number; QUSQUY: number; QUYQUU: number },
    ] = await db.$queryRaw`
      SELECT 
        AVG(DATEDIFF(minute, EnvioEquipeDT, ChegadaLocalDT)) AS QTYQUS,
        AVG(DATEDIFF(minute, SaidaLocalDT, ChegadaDestinoDT)) AS QUSQUY,
        AVG(DATEDIFF(minute, ChegadaDestinoDT, RetornoDestinoDT)) AS QUYQUU
      FROM OcorrenciaMovimentacao OM
      JOIN Ocorrencia O ON O.OcorrenciaID = OM.OcorrenciaID
      WHERE O.DtHr >= ${date}
      `;

    return {
      tempoGeral,
      QTYQUS,
      QUSQUY,
      QUYQUU,
      totalLigacoes,
    };
  }),
});
