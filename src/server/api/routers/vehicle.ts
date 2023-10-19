import { prisma } from "@/server/db";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import * as z from "zod";
import { differenceInMinutes, format, subHours } from "date-fns";

const input = z.object({
  vehicleId: z.number(),
  from: z.date(),
  to: z.date(),
});

export const vehicleRouter = createTRPCRouter({
  //---------OBTEM TODAS AS OCORRENCIAS ATENDIDAS PELO VEICULO--------//
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
        OcorrenciaMovimentacao: {
          some: {
            VeiculoID: input.vehicleId,
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
