import { createTRPCRouter, protectedProcedure } from "../trpc";
import { db } from "@/server/db";
import bcrypt from "bcrypt";
import { TRPCError } from "@trpc/server";
import { UserRole } from "@/types/UserRole";
import {
  formSchemaCadastroDeUsuario,
  formSchemaChangeOtherUserPassword,
  formSchemaChangeOwnPassword,
} from "@/constants/zod-schemas";
import { z } from "zod";
import { getColorByRisk } from "@/utils/getColorByRisk";

export const usersRouter = createTRPCRouter({
  create: protectedProcedure
    .input(formSchemaCadastroDeUsuario)
    .mutation(async ({ input }) => {
      const esusUser = await db.operadoresDados.findFirst({
        where: { OperadorApelido: input.username },
      });

      if (!esusUser) {
        throw new TRPCError({
          code: "PRECONDITION_FAILED",
          message: "O usuário informado não existe na plataforma e-SUS SAMU!",
        });
      }

      const dashBoardUser = await db.usuarioDashboard.findUnique({
        where: {
          operadorID: esusUser.OperadorID,
        },
      });

      if (!!dashBoardUser) {
        throw new TRPCError({
          code: "PRECONDITION_FAILED",
          message: "Usuário já cadastrado.",
        });
      }

      return await db.usuarioDashboard.create({
        data: {
          operadorID: esusUser.OperadorID,
          role: Number(input.role),
          senha: bcrypt.hashSync(input.password, 10),
        },
      });
    }),

  getAll: protectedProcedure.query(({ ctx }) =>
    db.usuarioDashboard.findMany({
      include: {
        perfil: true,
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
    }),
  ),

  changeOwnPassword: protectedProcedure
    .input(formSchemaChangeOwnPassword)
    .mutation(async ({ ctx, input }) => {
      const loggedUser = await db.usuarioDashboard.findUnique({
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

      await db.usuarioDashboard.update({
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

  changeOtherUserPassword: protectedProcedure
    .input(formSchemaChangeOtherUserPassword)
    .mutation(async ({ ctx, input }) => {
      if (ctx.session.user.role !== UserRole.admin)
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Você não permissão para realizar esta ação!",
        });

      const user = await db.usuarioDashboard.findUnique({
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
      await db.usuarioDashboard.update({
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

  getOcorrencias: protectedProcedure
    .input(z.object({ esusId: z.string() }))
    .query(async ({ input }) => {
      const data = await db.$queryRaw<OcorrenciaRaw[]>`
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
            AND oa.OperadorID = ${input.esusId}
          )
        ORDER BY
          o.OcorrenciaID DESC
        `;

      // Fazendo o parse apenas dos campos veiculos e vitimas que são JSON
      return data.map((ocorrencia) => ({
        id: ocorrencia.id.toString(),
        data: ocorrencia.data,
        bairro: ocorrencia.bairro || "",
        risco: ocorrencia.risco,
        riscoColorClass: getColorByRisk(ocorrencia.risco),
        operador: ocorrencia.operador || "",
        motivo: ocorrencia.motivo?.replace(/\*/g, "") || "NÃO PREENCHIDO",
        veiculos: ocorrencia.veiculos ? JSON.parse(ocorrencia.veiculos) : [],
        pacientes: ocorrencia.vitimas ? JSON.parse(ocorrencia.vitimas) : [],
      })) as Ocorrencia[];
    }),
});
