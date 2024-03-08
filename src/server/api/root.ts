import { exampleRouter } from "@/server/api/routers/example";
import { createTRPCRouter } from "@/server/api/trpc";
import { pacientesRouter } from "./routers/pacientes";
import { ocorrenciaRouter } from "./routers/ocorrencias";
import { usersRouter } from "./routers/users";
import { veiculosRouter } from "./routers/veiculos";
import { intercorrenciaRouter } from "./routers/intercorrencias";
import { destinosRouter } from "./routers/destinos";
import { hospitalManagerRouter } from "./routers/gerenciamento-rede";
import { roleRouter } from "./routers/roles";
import { tempoRespostaRouter } from "./routers/tempo-resposta";
import { ligacoesRouter } from "./routers/ligacoes";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  //   example: exampleRouter,
  pacientes: pacientesRouter,
  ocorrencias: ocorrenciaRouter,
  users: usersRouter,
  veiculos: veiculosRouter,
  destinos: destinosRouter,
  intercorrencia: intercorrenciaRouter,
  hospitalManager: hospitalManagerRouter,
  roles: roleRouter,
  tempoResposta: tempoRespostaRouter,
  ligacoes: ligacoesRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
