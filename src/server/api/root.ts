import { exampleRouter } from "@/server/api/routers/example";
import { createTRPCRouter } from "@/server/api/trpc";
import { patientsRouter } from "./routers/patients";
import { ocorrenciaRouter } from "./routers/ocorrencias";
import { usersRouter } from "./routers/users";
import { vehicleRouter } from "./routers/vehicles";
import { intercorrenciaRouter } from "./routers/intercorrencias";
import { destinationRouter } from "./routers/destinations";
import { hospitalManagerRouter } from "./routers/hospitalManager";
import { roleRouter } from "./routers/roles";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  //   example: exampleRouter,
  patients: patientsRouter,
  ocorrencias: ocorrenciaRouter,
  users: usersRouter,
  vehicles: vehicleRouter,
  destinations: destinationRouter,
  intercorrencia: intercorrenciaRouter,
  hospitalManager: hospitalManagerRouter,
  roles: roleRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
