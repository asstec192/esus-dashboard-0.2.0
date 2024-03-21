import type { DateRange } from "@/hooks/useGlobalDateFilterStore";
import { addHours, isWithinInterval, startOfDay } from "date-fns";

/**
 * Verifica se uma data está entre um intervalo de turnos dentro de um range de datas selecionadas
 * @param date Data a ser verificada
 * @param dateRange O intervalo de datas selecionado
 * @param start Hora incial
 * @param end Hora final
 * @returns
 */
export const isWithinTurn = (
  date: Date,
  dateRange: DateRange,
  start: number,
  end: number,
) => {
  const temViradaDeDia = start >= end;
  const from = addHours(startOfDay(dateRange.from), start);

  const to = temViradaDeDia
    ? addHours(startOfDay(dateRange.to), end)
    : startOfDay(dateRange.to);
  return (
    isWithinInterval(date, { start: from, end: to }) &&
    isWithinHour(date, start, end)
  );
};

/**
 * Verifica se uma data está entre um intervalo de horas estabelecidas
 * @param date Data a ser verificada
 * @param start Hora incial
 * @param end Hora final
 * @returns
 */
export function isWithinHour(date: Date, start: number, end: number) {
  const horarioSegundos =
    date.getSeconds() + date.getMinutes() * 60 + date.getHours() * 3600;
  const inicioSegundos = start * 3600;
  const fimSegundos = end * 3600;
  const temViradaDeDia = inicioSegundos >= fimSegundos;
  if (temViradaDeDia) {
    return horarioSegundos >= inicioSegundos || horarioSegundos < fimSegundos;
  } else {
    return horarioSegundos >= inicioSegundos && horarioSegundos < fimSegundos;
  }
}
