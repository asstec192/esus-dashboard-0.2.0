import { Turno } from "@/constants/turnos";
import { DateRange } from "@/hooks/useGlobalDateFilterStore";
import { Prisma } from "@prisma/client";
import { differenceInDays, format } from "date-fns";

// !!!!!!!!!! NÃO MEXA A NAO SER QUE SAIBA O QUE ESTA FAZENDO

// Constantes
const DATE_FORMAT = "yyyy-MM-dd";
const TIME_FORMAT = ":00:00";
type SourceTable = "O.DtHr" | "OM.EnvioEquipeDT";

/**
 * Obtem a query de filtro para os horarios dos turnos nos intervalos de dias selecionados
 * @param dateRange intervalo de datas
 * @param turn intervalo de turnos
 * @returns
 */
export const getTurnFilterQuery = (
  source: SourceTable,
  dateRange: DateRange,
  turn: Turno,
) => {
  const selecionouIntevalorDeUmDia =
    differenceInDays(dateRange.to, dateRange.from) === 1;

  if (selecionouIntevalorDeUmDia) {
    return getTurnFilterUmdia(source, dateRange, turn);
  }

  return getTurnFilterMaisDeUmDia(source, dateRange, turn);
};

/** Obtem o Where da query quando o usuario seleciona um periodo de mais de um dia */
const getTurnFilterMaisDeUmDia = (
  source: SourceTable,
  dateRange: DateRange,
  turn: Turno,
) => {
  const turnoComViradaDeDia = turn.from >= turn.to;

  //datas inicial e final
  const from = format(dateRange.from, `${DATE_FORMAT} ${turn.from}:00:00`);
  const to = turnoComViradaDeDia
    ? format(dateRange.to, `${DATE_FORMAT} ${turn.to}:00:00`)
    : format(dateRange.to, `${DATE_FORMAT} 00:00:00`);

  //horario inicial e final
  const turnFrom = `${turn.from}:00:00`;
  const turnTo = `${turn.to}:00:00`;

  const _source =
    source === "O.DtHr" ? Prisma.sql`O.DtHr` : Prisma.sql`OM.EnvioEquipeDT`;
  const operador = turnoComViradaDeDia ? Prisma.sql`OR` : Prisma.sql`AND`;

  return Prisma.sql`
    ${_source} BETWEEN ${from} AND ${to} 
    AND (
      CAST(${_source} AS TIME) >= ${turnFrom}
      ${operador} CAST(${_source} AS TIME) < ${turnTo}
    )
  `;
};

/** Obtem o Where da query quando o usuário seleciona um período de um dia */
const getTurnFilterUmdia = (
  source: SourceTable,
  dateRange: DateRange,
  turn: Turno,
) => {
  const turnoComViradaDeDia = turn.from >= turn.to;

  const from = format(dateRange.from, `${DATE_FORMAT} ${turn.from}:00:00`);

  const to = turnoComViradaDeDia
    ? format(dateRange.to, `${DATE_FORMAT} ${turn.to}:00:00`)
    : format(dateRange.from, `${DATE_FORMAT} ${turn.to}:00:00`);

  const _source =
    source === "O.DtHr" ? Prisma.sql`O.DtHr` : Prisma.sql`OM.EnvioEquipeDT`;

  return Prisma.sql`${_source} BETWEEN ${from} AND ${to}`;
};
