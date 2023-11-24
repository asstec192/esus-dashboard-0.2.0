import { createTRPCRouter, protectedProcedure } from "../trpc";
import { prisma } from "@/server/db";
import bcrypt from "bcrypt";
import { TRPCError } from "@trpc/server";
import { UserRole } from "@/types/UserRole";
import { changePasswordFormSchema } from "@/hooks/useChangePasswordForm";
import { userPasswordChangeByAdminFormSchema } from "@/hooks/useChangeUserPasswordForm";

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
    const data = await prisma.$queryRaw<[]>`
        SELECT 
          o.OcorrenciaID as id,
          o.DtHr as data,
          o.Bairro as bairro,
          o.RISCOCOD as risco,
          m.MotivoDS AS motivo,
          (
            SELECT TOP 1 od.OperadorNM as nome_operador
            FROM FORMEQUIPE_SolicitacaoVeiculo sv
            JOIN OperadoresDados od ON sv.OperadorID = od.OperadorID
            WHERE sv.OcorrenciaID = o.OcorrenciaID AND sv.VeiculoSEQ = 1
          ) AS operador,
          (
            SELECT v.VitimaNM as nome, v.Sexo as sexo, v.Idade as idade, i.IdadeTPDS as idadeTipo
            FROM Vitimas v
            JOIN IdadeTP i ON i.IdadeTP = v.IdadeTP
            WHERE o.OcorrenciaID = v.OcorrenciaID
            FOR JSON PATH
          ) AS vitimas,
          (
            SELECT om.EnvioEquipeDT, om.ChegadaBaseDT, om.ChegadaDestinoDT,
                  om.ChegadaLocalDT, om.SaidaBaseDT, om.RetornoDestinoDT,
                  om.SaidaLocalDT, ve.VeiculoDS as nome
            FROM OcorrenciaMovimentacao om
            JOIN Veiculos ve ON om.VeiculoID = ve.VeiculoID
            WHERE o.OcorrenciaID = om.OcorrenciaID
            ORDER BY om.EnvioEquipeDT ASC
            FOR JSON PATH
          ) AS veiculos
        FROM Ocorrencia o
        LEFT JOIN Motivo m ON o.MotivoID = m.MotivoID
        LEFT JOIN LigacaoTP lt ON lt.LigacaoTPID = o.LigacaoTPID
        WHERE 
          o.LigacaoTPID IN (9, 11, 15, 20)   
          AND EXISTS (
            SELECT 1
            FROM OCORRENCIA_AVALIACAO_INICIAL oa
            WHERE oa.OcorrenciaID = o.OcorrenciaID
            AND oa.OperadorID = ${esusId}
          )
        ORDER BY
          o.OcorrenciaID DESC
        `;

    // Fazendo o parse apenas dos campos veiculos e vitimas que são JSON
    return data.map((ocorrencia?: any) => ({
      id: ocorrencia.id.toString(),
      data: ocorrencia.data,
      bairro: ocorrencia.bairro || "",
      risco: ocorrencia.risco,
      desfecho: ocorrencia.desfecho,
      operador: ocorrencia.operador || "",
      motivo: ocorrencia.motivo?.replace(/\*/g, "") || "NÃO PREENCHIDO",
      veiculos: ocorrencia.veiculos ? JSON.parse(ocorrencia.veiculos) : [],
      pacientes: ocorrencia.vitimas ? JSON.parse(ocorrencia.vitimas) : [],
    })) as Ocorrencia[];
  }),
});
