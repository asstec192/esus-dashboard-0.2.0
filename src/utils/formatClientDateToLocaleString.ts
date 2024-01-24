import { addHours } from "date-fns";

/**
 * Formata a data do client corrigindo o fuso horário para refletir o horário correto
 * @param date
 * @returns
 */
export function formatClientDateToLocaleString(date?: Date | null) {
  if (!date) return "";
  const timeZoneOffset = date.getTimezoneOffset() / 60;
  const _date = addHours(date, timeZoneOffset);
  return _date.toLocaleString();
}
