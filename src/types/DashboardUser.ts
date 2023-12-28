import { Prisma } from "@prisma/client";

/* export type DashboardUser = {
  operador: {
    OperadorNM: string | null;
    OperadorApelido: string | null;
  } | null;
} & {
  id: number;
  operadorID: number;
  senha: string;
  role: number;
  createdAt: Date;
  updatedAt: Date;
}; */

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
