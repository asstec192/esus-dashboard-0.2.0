import { db } from "@/server/db";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const roleRouter = createTRPCRouter({
  getAll: protectedProcedure.query(() => db.perfisDashboard.findMany()),
});
