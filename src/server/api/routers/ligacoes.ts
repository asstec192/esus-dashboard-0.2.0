import { subHours } from "date-fns";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { db } from "@/server/db";

export const ligacoesRouter = createTRPCRouter({
  liveCount: protectedProcedure.query(async () => {
    const date = subHours(new Date().setHours(0, 0, 0, 0), 3);

    const [{ totalLigacoes }]: [{ totalLigacoes: number }] = await db.$queryRaw`
          SELECT COUNT(*) AS totalLigacoes                 
          FROM TEMPO_RESPOSTA
          WHERE DT_INICIO >= ${date}
          `;

    return totalLigacoes;
  }),
});
