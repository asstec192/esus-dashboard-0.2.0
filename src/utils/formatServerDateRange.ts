import { tzOffset } from "@/constants/timezone-offset";
import type { DateRange } from "@/hooks/useGlobalDateFilterStore";
import { subHours } from "date-fns";

/**
 * Um helper para obter os ranges de datas com fuso horário correto,
 * as datas retornadas devem ser usadas apenas nas queries do prisma,
 * pois as datas armazenadas no SQL Server estao em fuso horário local
 * porém o node está interpretando-as como UTC
 */
export const formatServerDateRange = (dateRange: DateRange) => {
  const from = subHours(dateRange.from, tzOffset);
  const to = subHours(dateRange.to, tzOffset);
  return { from, to } as DateRange;
};
