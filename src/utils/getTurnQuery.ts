import { type Turn } from "@/hooks/useGlobalDateFilterStore";
import { Prisma } from "@prisma/client";

export const getTurnQuery = (turn: Turn) => {
  const ehTurno3 = turn.from === "19:00:00";
  const todosTurnos = turn.from === turn.to;
  const turnQuery = todosTurnos
    ? Prisma.empty
    : ehTurno3
    ? Prisma.sql`
    AND (CAST(OcorrenciaMovimentacao.EnvioEquipeDT AS TIME) >= ${turn.from}
    OR CAST(OcorrenciaMovimentacao.EnvioEquipeDT AS TIME) < ${turn.to})`
    : Prisma.sql`
        AND (CAST(OcorrenciaMovimentacao.EnvioEquipeDT AS TIME) >= ${turn.from}
        AND CAST(OcorrenciaMovimentacao.EnvioEquipeDT AS TIME) < ${turn.to})`;
  return turnQuery;
};
