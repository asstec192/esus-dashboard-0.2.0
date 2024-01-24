import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { formatServerDateRange } from "@/utils/formatServerDateRange";
import { db } from "../../db";
import { dateRangeSchema } from "@/constants/zod-schemas";
import { range } from "lodash";

export const pacientesRouter = createTRPCRouter({
  countByAgeRange: protectedProcedure
    .input(dateRangeSchema)
    .query(async ({ input }) => {
      const { from, to } = formatServerDateRange(input);
      const counts = await db.$queryRaw<{ ageRange: string; count: number }[]>`
      SELECT
        CASE
          WHEN Idade >= 0 AND Idade < 13 THEN '<13'
          WHEN Idade >= 13 AND Idade < 19 THEN '13-18'
          WHEN Idade >= 19 AND Idade < 30 THEN '19-29'
          WHEN Idade >= 30 AND Idade < 40 THEN '30-39'
          WHEN Idade >= 40 AND Idade < 50 THEN '40-49'
          WHEN Idade >= 50 AND Idade < 60 THEN '50-59'
          WHEN Idade >= 60  THEN '>59'
          -- Adicione outras faixas de idade conforme necessário
          ELSE 'Não informado'
          END AS ageRange,
          COUNT(*) AS count
      FROM
        Vitimas V
      JOIN Ocorrencia O ON O.OcorrenciaID = V.OcorrenciaID
      WHERE O.DtHr BETWEEN ${from} AND ${to} 
        AND O.RISCOCOD NOT IN (0, 90)
      GROUP BY
        CASE
          WHEN Idade >= 0 AND Idade < 13 THEN '<13'
          WHEN Idade >= 13 AND Idade < 19 THEN '13-18'
          WHEN Idade >= 19 AND Idade < 30 THEN '19-29'
          WHEN Idade >= 30 AND Idade < 40 THEN '30-39'
          WHEN Idade >= 40 AND Idade < 50 THEN '40-49'
          WHEN Idade >= 50 AND Idade < 60 THEN '50-59'
          WHEN Idade >= 60  THEN '>59'
          -- Adicione outras faixas de idade conforme necessário
          ELSE 'Não informado'
        END`;

      // Define a ordem desejada das faixas etárias
      const ageRangeOrder = [
        "<13",
        "13-18",
        "19-29",
        "30-39",
        "40-49",
        "50-59",
        ">59",
        "Não informado",
      ];

      // Ordena o array de resultados de acordo com a ordem desejada
      return counts.sort(
        (a, b) =>
          ageRangeOrder.indexOf(a.ageRange) - ageRangeOrder.indexOf(b.ageRange),
      );
    }),

  countByGender: protectedProcedure
    .input(dateRangeSchema)
    .query(async ({ input }) => {
      const { from, to } = formatServerDateRange(input);
      return await db.$queryRaw<{ sexo: string; count: number }[]>`
      SELECT 
        CASE 
          WHEN V.Sexo IS NULL THEN 'Não informado'
          WHEN V.Sexo = '1' THEN 'Masculino'
          WHEN V.Sexo = '2' THEN 'Feminino'
        END AS sexo,
        COUNT(*) AS count
      FROM Vitimas V
      JOIN Ocorrencia O ON O.OcorrenciaID = V.OcorrenciaID
      WHERE O.DtHr BETWEEN ${from} AND ${to} 
        AND o.RISCOCOD NOT IN (0, 90)
      GROUP BY V.Sexo`;
    }),

  countByWeekDay: protectedProcedure
    .input(dateRangeSchema)
    .query(async ({ input }) => {
      const { from, to } = formatServerDateRange(input);
      const data = await db.$queryRaw<
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
