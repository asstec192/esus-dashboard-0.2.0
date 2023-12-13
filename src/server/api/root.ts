import { exampleRouter } from "@/server/api/routers/example";
import { createTRPCRouter } from "@/server/api/trpc";
import { patientsRouter } from "./routers/patients";
import { incidentsRouter } from "./routers/incidents";
import { usersRouter } from "./routers/users";
import { vehicleRouter } from "./routers/vehicles";
import { intercorrenciaRouter } from "./routers/intercorrencias";
import { destinationRouter } from "./routers/destinations";
import { hospitalManagerRouter } from "./routers/hospitalManager";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  example: exampleRouter,
  patients: patientsRouter,
  incidents: incidentsRouter,
  users: usersRouter,
  vehicles: vehicleRouter,
  destinations: destinationRouter,
  intercorrencia: intercorrenciaRouter,
  hospitalManager: hospitalManagerRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
