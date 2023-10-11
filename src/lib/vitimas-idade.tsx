import { DateRange } from "react-day-picker";
import { prisma } from "../server/db";
import { subHours } from "date-fns";

export type AgeCount = {
  ageRange: string;
  count: number;
};

export const vitimasPorIdade = async (dateRange: DateRange) => {
  const from = subHours(dateRange.from!, 3);
  const to = subHours(dateRange.to!, 3);

  const counts = await prisma.$queryRaw<AgeCount[]>`
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
    END;`;

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
  const sortedCounts = counts.sort(
    (a, b) =>
      ageRangeOrder.indexOf(a.ageRange) - ageRangeOrder.indexOf(b.ageRange),
  );

  return sortedCounts;
};
