import { Turno } from "@/constants/turnos";
import { DateRange } from "@/hooks/useGlobalDateFilterStore";
import { Prisma } from "@prisma/client";
import { differenceInDays, format } from "date-fns";

// !!!!!!!!!! NÃO MECHA A NAO SER QUE SAIBA O QUE ESTA FAZENDO

/**
 * Obtem a query de filtro para os horarios dos turnos nos intervalos de dias selecionados
 * @param dateRange intervalo de datas
 * @param turn intervalo de turnos
 * @returns
 */
export const getTurnFilterQuery = (dateRange: DateRange, turn: Turno) => {
  const selecionouIntevalorDeUmDia =
    differenceInDays(dateRange.to, dateRange.from) === 1; //true
  if (selecionouIntevalorDeUmDia) {
    return getTurnFilterUmdia(dateRange, turn);
  }
  return getTurnFilterMaisDeUmDia(dateRange, turn);
};

export const getTurnFilterMaisDeUmDia = (dateRange: DateRange, turn: Turno) => {
  const turnoComViradaDeDia = turn.numericFrom >= turn.numericTo;
  const from = format(dateRange.from, `yyyy-MM-dd ${turn.from}`);
  const to = turnoComViradaDeDia
    ? format(dateRange.to, `yyyy-MM-dd ${turn.to}`)
    : format(dateRange.to, `yyyy-MM-dd 00:00:00`);
  const operador = turnoComViradaDeDia ? Prisma.sql`OR` : Prisma.sql`AND`;
  return Prisma.sql`
            O.DtHr BETWEEN ${from} AND ${to} 
            AND (
              CAST(O.DtHr AS TIME) >= ${turn.from}
              ${operador} CAST(O.DtHr AS TIME) < ${turn.to}
            )
          `;
};

export const getTurnFilterUmdia = (dateRange: DateRange, turn: Turno) => {
  const turnoComViradaDeDia = turn.numericFrom >= turn.numericTo;
  const from = format(dateRange.from, `yyyy-MM-dd ${turn.from}`);
  const to = turnoComViradaDeDia
    ? format(dateRange.to, `yyyy-MM-dd ${turn.to}`)
    : format(dateRange.from, `yyyy-MM-dd ${turn.to}`);
  return Prisma.sql`O.DtHr BETWEEN ${from} AND ${to}`;
};
