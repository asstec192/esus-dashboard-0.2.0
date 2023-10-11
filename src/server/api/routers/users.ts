import { createTRPCRouter, protectedProcedure } from "../trpc";
import { prisma } from "@/server/db";
import bcrypt from "bcrypt";
import { TRPCError } from "@trpc/server";
import { UserRole } from "@/types/UserRole";
import { changePasswordFormSchema } from "@/hooks/useChangePasswordForm";
import { userPasswordChangeByAdminFormSchema } from "@/hooks/useChangeUserPasswordForm";
import { ocorrenciasPorUsuario } from "@/lib/ocorrencias-por-usuario";

export const usersRouter = createTRPCRouter({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    return await prisma.usuarioDashboard.findMany({
      include: {
        operador: {
          select: {
            OperadorNM: true,
            OperadorApelido: true,
          },
        },
      },
      where: {
        NOT: {
          id: parseInt(ctx.session.user.id),
        },
      },
    });
  }),

  changePassword: protectedProcedure
    .input(changePasswordFormSchema)
    .mutation(async ({ ctx, input }) => {
      const loggedUser = await prisma.usuarioDashboard.findUnique({
        select: {
          id: true,
          senha: true,
        },
        where: {
          id: parseInt(ctx.session.user.id),
        },
      });
      if (!loggedUser)
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Usuário não está logado ou não existe!",
        });
      const validPassword = bcrypt.compareSync(
        input.password,
        loggedUser.senha,
      );
      if (!validPassword)
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Senha atual incorreta!",
        });
      const newPassword = bcrypt.hashSync(input.newPassword, 10);
      await prisma.usuarioDashboard.update({
        data: {
          senha: newPassword,
          updatedAt: new Date(),
        },
        where: {
          id: loggedUser.id,
        },
      });
      return "Senha alterada com sucesso";
    }),

  changePasswordByAdmin: protectedProcedure
    .input(userPasswordChangeByAdminFormSchema)
    .mutation(async ({ ctx, input }) => {
      if (ctx.session.user.role !== UserRole.admin)
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Você não permissão para realizar esta ação!",
        });

      const user = await prisma.usuarioDashboard.findUnique({
        select: {
          id: true,
          senha: true,
        },
        where: {
          id: input.selectedUserId,
        },
      });

      if (!user)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Usuário inexistente!",
        });

      const newPassword = bcrypt.hashSync(input.newPassword, 10);
      await prisma.usuarioDashboard.update({
        data: {
          senha: newPassword,
          updatedAt: new Date(),
        },
        where: {
          id: input.selectedUserId,
        },
      });
      return "Senha alterada com sucesso";
    }),

  getIncidents: protectedProcedure.query(async ({ ctx }) => {
    const esusId = ctx.session.user.esusId;
    return await ocorrenciasPorUsuario(esusId);
  }),
});
