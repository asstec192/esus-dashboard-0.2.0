import { DateRange } from "@/hooks/useGlobalDateFilterStore";
import { subHours } from "date-fns";

export const formatServerDateRange = (dateRange: DateRange) => {
  const timeZoneOffset = dateRange.from.getTimezoneOffset() / 60; //converte pra horas
  const from = subHours(dateRange.from, timeZoneOffset);
  const to = subHours(dateRange.to, timeZoneOffset);
  return { from, to } as DateRange;
};
