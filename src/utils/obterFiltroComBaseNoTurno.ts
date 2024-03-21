import type { z } from "zod";
import { Prisma } from "@prisma/client";
import { differenceInDays, format } from "date-fns";

import type { DateRange } from "@/hooks/useGlobalDateFilterStore";
import type { SchemaTurno } from "@/validators";

// !!!!!!!!!! NÃO MEXA A NAO SER QUE SAIBA O QUE ESTA FAZENDO
type Filters = {
  sourceDateFilter: "O.DtHr" | "OM.EnvioEquipeDT";
  dateRange: DateRange;
  turno: z.infer<typeof SchemaTurno>;
};

const DATE_FORMAT = "yyyy-MM-dd";

/**
 * Obtem a query de filtro com base nos horarios dos turnos de regulação e nos intervalos de dias selecionados
 */
export const obterFiltroComBaseNoTurno = ({
  dateRange,
  sourceDateFilter,
  turno,
}: Filters) => {
  const selecionouIntevalorDeUmDia =
    differenceInDays(dateRange.to, dateRange.from) <= 1;

  if (selecionouIntevalorDeUmDia) {
    return obterFiltroEmPeriodosDeAteUmDia({
      sourceDateFilter,
      dateRange,
      turno,
    });
  }

  return obterFiltroEmPeriodosMaioresQueUmDia({
    sourceDateFilter,
    dateRange,
    turno,
  });
};

const obterFiltroEmPeriodosMaioresQueUmDia = ({
  sourceDateFilter,
  dateRange,
  turno,
}: Filters) => {
  const turnoComViradaDeDia = turno.from >= turno.to;

  //datas inicial e final
  const from = format(dateRange.from, `${DATE_FORMAT} ${turno.from}:00:00`);
  const to = turnoComViradaDeDia
    ? format(dateRange.to, `${DATE_FORMAT} ${turno.to}:00:00`)
    : format(dateRange.to, `${DATE_FORMAT} 00:00:00`);

  console.log("interno", { dateRange }, { from, to });

  //horario inicial e final
  const turnFrom = `${turno.from}:00:00`;
  const turnTo = `${turno.to}:00:00`;

  const _source =
    sourceDateFilter === "O.DtHr"
      ? Prisma.sql`O.DtHr`
      : Prisma.sql`OM.EnvioEquipeDT`;

  const operador = turnoComViradaDeDia ? Prisma.sql`OR` : Prisma.sql`AND`;

  return Prisma.sql`
    ${_source} BETWEEN ${from} AND ${to} 
    AND (
      CAST(${_source} AS TIME) >= ${turnFrom}
      ${operador} CAST(${_source} AS TIME) < ${turnTo}
    )
  `;
};

const obterFiltroEmPeriodosDeAteUmDia = ({
  sourceDateFilter,
  dateRange,
  turno,
}: Filters) => {
  const turnoComViradaDeDia = turno.from >= turno.to;

  const from = format(dateRange.from, `${DATE_FORMAT} ${turno.from}:00:00`);

  const to = turnoComViradaDeDia
    ? format(dateRange.to, `${DATE_FORMAT} ${turno.to}:00:00`)
    : format(dateRange.from, `${DATE_FORMAT} ${turno.to}:00:00`);

  const _source =
    sourceDateFilter === "O.DtHr"
      ? Prisma.sql`O.DtHr`
      : Prisma.sql`OM.EnvioEquipeDT`;

  return Prisma.sql`${_source} BETWEEN ${from} AND ${to}`;
};
