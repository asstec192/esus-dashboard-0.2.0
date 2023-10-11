import * as z from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { ocorrenciasPorRisco } from "@/lib/ocorrencias-por-risco";
import { ocorrenciasEmAndamento } from "@/lib/ocorrencias-tempo-real";
import { ligacoesPorTipo } from "@/lib/ligacoes-por-tipo";
import { ocorrencias } from "@/lib/ocorrencias";
import { dateRange } from "./patients";
import { ocorrenciasPorHorarioDeDeslocamento } from "@/lib/ocorrencias-por-horario-deslocamento";
import { ocorrenciasPorTipoDeVeiculo } from "@/lib/ocorrencias-por-tipo-veiculo";

export const incidentsRouter = createTRPCRouter({
  getAll: publicProcedure
    .input(z.object({ from: z.date(), to: z.date() }))
    .query(async ({ input }) => {
      return await ocorrencias(input);
    }),
  getTotalIncidentsByRisk: publicProcedure.query(() => ocorrenciasPorRisco()),
  getIncidentsInProgress: publicProcedure.query(() => ocorrenciasEmAndamento()),
  getTotalIncidentsByCallType: publicProcedure.query(() => ligacoesPorTipo()),
  getTotalIncidentsByHour: publicProcedure
    .input(dateRange)
    .query(({ input }) => ocorrenciasPorHorarioDeDeslocamento(input)),
  getTotalIncidentsByVehicleType: publicProcedure
    .input(dateRange)
    .query(({ input }) => ocorrenciasPorTipoDeVeiculo(input)),
});
