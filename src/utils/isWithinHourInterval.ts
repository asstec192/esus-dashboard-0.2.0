import {
  addHours,
  isWithinInterval,
  startOfDay,
  isBefore,
  isAfter,
} from "date-fns";

/**
 * Verifica se uma data está entre um intervalo de horas estabelecidas
 * @param date Data a ser verificada
 * @param start Hora incial
 * @param end Hora final
 * @returns
 */
export const isWithinHourInterval = (
  date: Date,
  start: number,
  end: number,
) => {
  const isEndHourInNextDay = end <= start;
  const startDate = addHours(startOfDay(date), start);
  const endDate = addHours(startOfDay(date), end);
  if (isEndHourInNextDay) {
    return isBefore(date, endDate) || isAfter(date, startDate);
  }
  return isWithinInterval(date, { start: startDate, end: endDate });
};
