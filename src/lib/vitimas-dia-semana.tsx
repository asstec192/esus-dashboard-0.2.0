import { DateRange } from "react-day-picker";
import { prisma } from "../server/db";
import { subHours } from "date-fns";

type OriginalWeekDayCount = {
  weekDay: number;
  count: number;
};

export type WeekDayCount = {
  weekDay?: string;
  count: number;
};

export const vitimasPorDiaDaSemana = async (dateRange: DateRange) => {
  const from = subHours(dateRange.from!, 3);
  const to = subHours(dateRange.to!, 3);
  const data = await prisma.$queryRaw<OriginalWeekDayCount[]>`
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

  const formatedData: WeekDayCount[] = data.map((item) => ({
    weekDay: weekDays[item.weekDay],
    count: item.count,
  }));

  return formatedData;
};

const weekDays: Record<number, string> = {
  1: "Dom",
  2: "Seg",
  3: "Ter",
  4: "Qua",
  5: "Qui",
  6: "Sex",
  7: "Sab",
};
