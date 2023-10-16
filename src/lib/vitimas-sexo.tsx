import { DateRange } from "react-day-picker";
import { prisma } from "../server/db";
import { subHours } from "date-fns";

export type GenderCount = {
  sexo: string;
  count: number;
};

export const vitimasPorSexo = async (dateRange: DateRange) => {
  const from = subHours(new Date(dateRange.from!.setHours(1, 0, 0, 0)), 3);
  const to = subHours(new Date(dateRange.to!.setHours(1, 0, 0, 0)), 3);

  const data = await prisma.$queryRaw<GenderCount[]>`
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
    GROUP BY V.Sexo;
  `;
  return data;
};
