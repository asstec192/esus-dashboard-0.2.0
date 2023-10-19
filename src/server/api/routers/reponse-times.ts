import * as z from "zod";

import { estatisticasDiarias } from "@/lib/estatisticas-diarias";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { tempoHospitais } from "@/lib/tempo-hospitais";
import { tempoVeiculos } from "@/lib/tempo-veiculos";

const input = z.object({
  from: z.date(),
  to: z.date(),
  turn: z.object({
    from: z.string(),
    to: z.string(),
    numericFrom: z.number(),
    numericTo: z.number(),
  }),
});

export const responseTimeRouter = createTRPCRouter({
  getAll: publicProcedure.query(() => estatisticasDiarias()),
  getResponseTimeByDesiny: publicProcedure
    .input(input)
    .query(({ input }) =>
      tempoHospitais({ from: input.from, to: input.to }, input.turn),
    ),
  getResponseTimeByVehicle: publicProcedure
    .input(input)
    .query(({ input }) =>
      tempoVeiculos({ from: input.from, to: input.to }, input.turn),
    ),
});
