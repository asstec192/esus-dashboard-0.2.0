import { Prisma } from "@prisma/client";

export type DashboardUser = Prisma.UsuarioDashboardGetPayload<{
  include: {
    perfil: true,
    operador: {
      select: {
        OperadorNM: true,
        OperadorApelido: true
      }
    }
  }
}>
