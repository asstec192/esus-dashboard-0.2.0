import * as z from "zod";
import { subHours } from "date-fns";
import { db } from "@/server/db";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { formatServerDateRange } from "@/utils/formatServerDateRange";
import { dateRangeSchema } from "@/constants/zod-schemas";
import { getColorByRisk } from "@/utils/getColorByRisk";

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

  getAll: protectedProcedure.input(dateRangeSchema).query(async ({ input }) => {
    const { from, to } = formatServerDateRange(input);

    const rawData = await db.$queryRaw<OcorrenciaRaw[]>`
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
        o.LigacaoTPID IN (9, 11, 15, 20) AND o.DtHr BETWEEN ${from} AND ${to}
      ORDER BY
        o.OcorrenciaID DESC`;

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

  getAllInProgress: protectedProcedure.query(async () => {
    // tirando 3 horas para ficar com fuso compativel
    const date = subHours(new Date().setHours(0, 0, 0, 0), 3);
    const data = await db.$queryRaw<OcorrenciaRaw[]>`
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

    const ocorrencias: Omit<Ocorrencia, "data" | "pacientes">[] = data.map(
      (ocorrencia) => ({
        id: ocorrencia.id.toString(),
        bairro: ocorrencia.bairro ?? "",
        risco: ocorrencia.risco,
        riscoColorClass: getColorByRisk(ocorrencia.risco),
        operador: ocorrencia.operador ?? "",
        motivo: ocorrencia.motivo?.replace(/\*/g, "") || "NÃO PREENCHIDO",
        veiculos: ocorrencia.veiculos ? JSON.parse(ocorrencia.veiculos) : [],
      }),
    );

    return ocorrencias;
  }),

  countByRisco: protectedProcedure.query(async () => {
    const date = subHours(new Date().setHours(0, 0, 0, 0), 3);

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
                  gte: date,
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

  countByTipoLigacao: protectedProcedure.query(async () => {
    //inicio do dia
    const date = subHours(new Date().setHours(0, 0, 0, 0), 3);

    //obtendos os dados crus da contagem de ocorrencias por ligacao
    const rawData = await db.ligacaoTP.findMany({
      select: {
        LigacaoTPDS: true,
        _count: {
          select: {
            Ocorrencia: {
              where: {
                DtHr: { gte: date },
              },
            },
          },
        },
      },
    });

    //trata os dados
    const ligacoes = rawData
      .filter((l) => l._count.Ocorrencia > 0) //filtra somente as ligacoes com mais de 0 ocorrencias
      .map((l) => ({
        //remapea o array para nova estrutura
        label: l.LigacaoTPDS,
        count: l._count.Ocorrencia,
      }))
      .sort((a, b) => a.count - b.count); //poe em ordem crescente de contagem

    //resposta para o client
    return ligacoes;
  }),

  countByHoraDeEnvioDoVeiculo: protectedProcedure
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

  countByTipoDeVeiculo: protectedProcedure
    .input(dateRangeSchema)
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

    const tempoMedico = await db.$queryRaw<{ MediaGeral: number }[]>`
      SELECT
          AVG(DATEDIFF(MINUTE, TempoPorOcorrencia.EnvioOcorrenciaDT, TempoPorOcorrencia.SolicitacaoVeiculoDT)) MediaGeral
      FROM
          (SELECT 
              SV.OcorrenciaID,
              OP.OperadorNM,
              Min(PO.OrigemDTHR) as EnvioOcorrenciaDT,
              SV.RegistroDT as SolicitacaoVeiculoDT
          FROM FORMEQUIPE_SolicitacaoVeiculo SV
          JOIN PosicaoOcorrencias PO On PO.OcorrenciaID = SV.OcorrenciaID 
          JOIN OperadoresDados OP ON OP.OperadorID = SV.OperadorID
          JOIN Ocorrencia O ON O.OcorrenciaID = SV.OcorrenciaID
          WHERE O.DtHr >= ${date} AND
              SV.VeiculoSEQ = 1
          GROUP BY 
              SV.OcorrenciaID,
              SV.RegistroDT,
              OP.OperadorNM 
          ) as TempoPorOcorrencia
      `;
    const estatisticas = [
      { label: "Ligações", value: totalLigacoes.toString() },
      { label: "Tempo Geral", value: `${tempoGeral ?? ""} min` },
      {
        label: "Tempo Médico",
        value: `${tempoMedico[0]?.MediaGeral ?? ""} min`,
      },
      { label: "Chegada ao local", value: `${QTYQUS ?? ""} min` },
      { label: "Atendimento no local", value: `${QUSQUY ?? ""} min` },
      { label: "Chegada ao destino", value: `${QUYQUU ?? ""} min` },
    ];

    return estatisticas;
  }),
});
