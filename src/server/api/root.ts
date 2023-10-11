import { exampleRouter } from "@/server/api/routers/example";
import { createTRPCRouter } from "@/server/api/trpc";
import { patientsRouter } from "./routers/patients";
import { incidentsRouter } from "./routers/incidents";
import { responseTimeRouter } from "./routers/reponse-times";
import { usersRouter } from "./routers/users";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  example: exampleRouter,
  patients: patientsRouter,
  incidents: incidentsRouter,
  responseTimes: responseTimeRouter,
  users: usersRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
