import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { vitimasPorIdade } from "@/lib/vitimas-idade";
import { vitimasPorSexo } from "@/lib/vitimas-sexo";
import { vitimasPorDiaDaSemana } from "@/lib/vitimas-dia-semana";

export const dateRange = z.object({ from: z.date(), to: z.date() });

export const patientsRouter = createTRPCRouter({
  getPatientsByAge: publicProcedure.input(dateRange).query(({ input }) => {
    return vitimasPorIdade(input);
  }),
  getPatientsByGender: publicProcedure
    .input(dateRange)
    .query(({ input }) => vitimasPorSexo(input)),
  getTotalPatientsByWeekDay: publicProcedure.input(dateRange).query(({input})=> vitimasPorDiaDaSemana(input))
});
