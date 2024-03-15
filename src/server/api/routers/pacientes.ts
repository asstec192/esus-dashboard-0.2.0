import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { formatServerDateRange } from "@/utils/formatServerDateRange";
import { SchemaDateRange } from "@/validators";
import { range } from "lodash";
import { z } from "zod";
import type { Sexo } from "@/types/Sexo";

export const pacientesRouter = createTRPCRouter({
  countByAgeRange: protectedProcedure
    .input(
      z.object({
        dateRange: SchemaDateRange,
        somenteComEnvioDeVeiculo: z.boolean(),
      }),
    )
    .query(async ({ input, ctx }) => {
      const { from, to } = formatServerDateRange(input.dateRange);

      const vitimas = await ctx.db.vitimas.findMany({
        where: {
          Ocorrencia: {
            DtHr: {
              gte: from,
              lt: to,
            },
            RISCOCOD: { notIn: [0, 90] },
            ...(input.somenteComEnvioDeVeiculo && {
              OcorrenciaMovimentacao: { some: {} },
            }),
          },
        },
        select: {
          faixaEtaria: true,
        },
      });

      const counts = [
        {
          faixa: "< 1",
          count: vitimas.filter((v) => v.faixaEtaria === "<1").length ?? 0,
        },
        {
          faixa: "1-12",
          count: vitimas.filter((v) => v.faixaEtaria === "1-12").length ?? 0,
        },
        {
          faixa: "13-18",
          count: vitimas.filter((v) => v.faixaEtaria === "13-18").length ?? 0,
        },
        {
          faixa: "19-29",
          count: vitimas.filter((v) => v.faixaEtaria === "19-29").length ?? 0,
        },
        {
          faixa: "30-39",
          count: vitimas.filter((v) => v.faixaEtaria === "30-39").length ?? 0,
        },
        {
          faixa: "40-49",
          count: vitimas.filter((v) => v.faixaEtaria === "40-49").length ?? 0,
        },
        {
          faixa: "50-59",
          count: vitimas.filter((v) => v.faixaEtaria === "50-59").length ?? 0,
        },
        {
          faixa: ">59",
          count: vitimas.filter((v) => v.faixaEtaria === ">59").length ?? 0,
        },
        {
          faixa: "Não informado",
          count:
            vitimas.filter((v) => v.faixaEtaria === "Não informado").length ??
            0,
        },
      ];

      return counts;
    }),

  countByGender: protectedProcedure
    .input(
      z.object({
        dateRange: SchemaDateRange,
        somenteComEnvioDeVeiculo: z.boolean(),
      }),
    )
    .query(async ({ input, ctx }) => {
      const { from, to } = formatServerDateRange(input.dateRange);

      const contagemPorGenero = await ctx.db.vitimas.groupBy({
        by: ["Sexo"], // por algum motivo selecionar a coluna "Sexo" tambem ira selecionar o valor computado "sexo"
        _count: {
          _all: true,
        },
        where: {
          Ocorrencia: {
            DtHr: {
              gte: from,
              lt: to,
            },
            ...(input.somenteComEnvioDeVeiculo
              ? {
                  OcorrenciaMovimentacao: {
                    some: {}, // apenas verifica se houve envio de veiculos
                  },
                }
              : {
                  RISCOCOD: {
                    notIn: [0, 90],
                  },
                }),
          },
        },
      });

      return contagemPorGenero.map((item) => ({
        //@ts-expect-error a propriedade sexo exis
        sexo: item.sexo as Sexo,
        count: item._count._all,
      }));
    }),

  countByWeekDay: protectedProcedure
    .input(SchemaDateRange)
    .query(async ({ input, ctx }) => {
      const { from, to } = formatServerDateRange(input);

      const data = await ctx.db.$queryRaw<
        {
          weekDay: number;
          count: number;
        }[]
      >`
        SELECT
          DATEPART(WEEKDAY, o.DtHr) AS weekDay,
          COUNT(*) AS count
        FROM
          Vitimas V
        INNER JOIN
          Ocorrencia O ON v.OcorrenciaID = o.OcorrenciaID
        WHERE O.DtHr BETWEEN ${from} AND ${to} 
          AND O.RISCOCOD NOT IN (0, 90)
        GROUP BY
          DATEPART(WEEKDAY, o.DtHr)
        ORDER BY
          DATEPART(WEEKDAY, o.DtHr);`;

      // Mesclar o array base com os resultados da consulta
      const mergedResult = allDaysOfWeek.map((day) => {
        const resultItem = data.find((item) => item.weekDay === day);
        return {
          weekDay: weekDays[day],
          count: resultItem ? resultItem.count : 0,
        };
      });

      return mergedResult;
    }),
});

// Isso cria um array de 1 a 7 (representando os dias da semana)
const allDaysOfWeek = range(1, 8);

const weekDays: Record<number, string> = {
  1: "Dom",
  2: "Seg",
  3: "Ter",
  4: "Qua",
  5: "Qui",
  6: "Sex",
  7: "Sab",
};
