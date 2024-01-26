import { DateRange } from "@/hooks/useGlobalDateFilterStore";

export const formatServerDateRange = (dateRange: DateRange) => {
  const timeZoneOffset = dateRange.from.getTimezoneOffset() / 60; //converte pra horas
  const from = new Date(dateRange.from.setHours(-timeZoneOffset, 0, 0, 0));
  const to = new Date(dateRange.to.setHours(-timeZoneOffset, 0, 0, 0));
  return { from, to } as DateRange;
};
