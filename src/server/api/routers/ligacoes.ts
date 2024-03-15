import { startOfDay, subHours } from "date-fns";

import { db } from "@/server/db";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const ligacoesRouter = createTRPCRouter({
  liveCount: protectedProcedure.query(async () => {
    const date = subHours(startOfDay(new Date()), 3);

    const [{ totalLigacoes }]: [{ totalLigacoes: number }] = await db.$queryRaw`
          SELECT COUNT(*) AS totalLigacoes                 
          FROM TEMPO_RESPOSTA
          WHERE DT_INICIO >= ${date}
          `;

    return totalLigacoes;
  }),
});
