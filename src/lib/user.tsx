import bcrypt from "bcrypt";
import { prisma } from "../server/db";
import { UserRole } from "@/types/UserRole";

export const createDashboardUser = async (
  esusUserID: number,
  password: string,
  role: UserRole,
) => {
  const hashedPassword = bcrypt.hashSync(password, 10);
  const user = await prisma.usuarioDashboard.create({
    data: {
      operadorID: esusUserID,
      senha: hashedPassword,
      role: role,
    },
    include: {
      operador: {
        select: {
          OperadorNM: true,
          OperadorApelido: true,
        },
      },
    },
  });
  return user;
};

export const findDashboardUser = async (esusUserID: number) => {
  const user = await prisma.usuarioDashboard.findUnique({
    where: {
      operadorID: esusUserID,
    },
    include: {
      operador: {
        select: {
          OperadorNM: true,
          OperadorApelido: true,
        },
      },
    },
  });
  return user;
};

export const findEsusUserByCodeName = async (username: string) => {
  const user = await prisma.operadoresDados.findUnique({
    select: {
      OperadorApelido: true,
      OperadorID: true,
      OperadorNM: true,
      ProfisionalTP: true,
    },
    where: {
      OperadorApelido: username,
    },
  });
  return user;
};
