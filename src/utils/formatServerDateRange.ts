import { DateRange } from "@/hooks/useGlobalDateFilterStore";
import { format, subHours } from "date-fns";

export const formatServerDateRange = (dateRange: DateRange) => {
  const from = subHours(
    new Date(format(dateRange.from, "yyyy-MM-dd 00:00:00.000")),
    3, //subtrai 3 horas por conta do fuso horario
  );
  const to = subHours(
    new Date(format(dateRange.to, "yyyy-MM-dd 00:00:00.000")),
    3,
  );
  return { from, to } as DateRange;
};

