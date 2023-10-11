import { DateRange } from "react-day-picker";
import { prisma } from "../server/db";
import { formatDate } from "@/utils/formatDate";
import { subHours } from "date-fns";

export interface ContagemOcorrenciasHorarioDeslocamento {
  intervalo: string;
  contagem: number;
}

export const ocorrenciasPorHorarioDeDeslocamento = async (
  dateRange: DateRange,
) => {
  const from = subHours(dateRange.from!, 3);
  const to = subHours(dateRange.to!, 3);

  const data = await prisma.$queryRaw<ContagemOcorrenciasHorarioDeslocamento[]>`
    SELECT 
      intervalo,
      COUNT(*) AS contagem
    FROM (
      SELECT 
          OM.*,
          CAST(OM.EnvioEquipeDT AS TIME) AS Horario
      FROM OcorrenciaMovimentacao OM
      WHERE OM.EnvioEquipeDT BETWEEN ${from} AND ${to} 
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
      END;`;
  return data;
};
