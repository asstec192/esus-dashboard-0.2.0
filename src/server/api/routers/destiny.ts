import { prisma } from "@/server/db";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import * as z from "zod";
import { format, subHours } from "date-fns";

const input = z.object({
  destinyId: z.number(),
  from: z.date(),
  to: z.date(),
});

export const destinyRouter = createTRPCRouter({
  getIncidents: protectedProcedure.input(input).query(async ({ input }) => {
    const from = new Date(format(input.from, "yyyy-MM-dd 01:00:00.000"));
    const to = new Date(format(input.to, "yyyy-MM-dd 01:00:00.000"));
    return await prisma.ocorrencia.findMany({
      select: {
        OcorrenciaID: true,
        Bairro: true,
        DtHr: true,
        RISCOCOD: true,
        Motivo: {
          select: {
            MotivoDS: true,
          },
        },
      },
      where: {
        DtHr: {
          gte: subHours(from, 3),
          lt: subHours(to, 3),
        },
        HISTORICO_DECISAO_GESTORA: {
          some: {
            DESTINOID: input.destinyId,
          },
        },
        LigacaoTPID: {
          in: [9, 11, 15, 20],
        },
      },
      orderBy: {
        OcorrenciaID: "desc",
      },
    });
  }),
});
