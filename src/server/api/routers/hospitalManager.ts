import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { prisma } from "@/server/db";
import { FormSchemaGerenciadorHospital } from "@/hooks/useHospitalManagerForm";

export const hospitalManagerRouter = createTRPCRouter({
  getSpecialties: protectedProcedure.query(() =>
    prisma.especialidades.findMany(),
  ),

  getEquipamentos: protectedProcedure.query(() =>
    prisma.equipamentos.findMany(),
  ),

  addSpecialte: protectedProcedure
    .input(z.object({ descricao: z.string().min(1) }))
    .mutation(({ input }) =>
      prisma.especialidades.create({
        data: {
          descricao: input.descricao,
        },
      }),
    ),

  addEquipamento: protectedProcedure
    .input(z.object({ descricao: z.string().min(1) }))
    .mutation(({ input }) =>
      prisma.equipamentos.create({
        data: input,
      }),
    ),

  obterRelatorioHospitalar: protectedProcedure
    .input(z.object({ hospitalId: z.number() }))
    .query(({ input }) =>
      prisma.$transaction([
        prisma.unidadeEquipamentos.findMany({
          where: { unidadeId: input.hospitalId },
          include: {
            equipamento: true,
          },
        }),
        prisma.unidadeEspecialidades.findMany({
          where: { unidadeId: input.hospitalId },
          include: {
            especialidade: true,
          },
        }),
        prisma.unidadeRelatorio.findUnique({
          where: { unidadeId: input.hospitalId },
          include: {
            criadoPor: {
              select: {
                operador: { select: { OperadorNM: true } },
              },
            },
            revisadoPor: {
              select: {
                operador: { select: { OperadorNM: true } },
              },
            },
          },
        }),
      ]),
    ),

  criarOuAtualizarRelatorio: protectedProcedure
    .input(FormSchemaGerenciadorHospital)
    .mutation(({ input, ctx }) =>
      prisma.$transaction([
        //CRIA O RELATORIO
        prisma.unidadeRelatorio.upsert({
          create: {
            chefeEquipe: input.chefeEquipe,
            contato: input.foneContato,
            horaContato: input.horaContato,
            nomeContato: input.pessoaContactada,
            observacao: input.obervacao,
            criadoPorId: Number(ctx.session.user.id),
            revisadoPorId: Number(ctx.session.user.id),
            unidadeId: input.hospitalId,
          },
          update: {
            chefeEquipe: input.chefeEquipe,
            contato: input.foneContato,
            horaContato: input.horaContato,
            nomeContato: input.pessoaContactada,
            observacao: input.obervacao,
            revisadoPorId: Number(ctx.session.user.id),
          },
          where: {
            unidadeId: input.hospitalId,
          },
        }),

        //DELETA AS ESPECIALIDADES QUE ESTAO NO BANCO, MAS NAO NO FORM
        prisma.unidadeEspecialidades.deleteMany({
          where: {
            unidadeId: input.hospitalId,
            especialidadeId: {
              notIn: input.especialidades.map((esp) => esp.itemId),
            },
          },
        }),

        //DELETA OS EQUIPAMENTOS QUE ESTAO NO BANCO, MAS NAO NO FORM
        prisma.unidadeEquipamentos.deleteMany({
          where: {
            unidadeId: input.hospitalId,
            equipamentoId: {
              notIn: input.equipamentos.map((eqp) => eqp.itemId),
            },
          },
        }),

        // CRIA OU ATUALIZA AS ESPECIALIDADES, DEPENDENDO SE JA EXISTEM OU NAO
        ...input.especialidades.map((esp) =>
          prisma.unidadeEspecialidades.upsert({
            create: {
              especialidadeId: esp.itemId,
              quantidade: Number(esp.itemCount),
              unidadeId: input.hospitalId,
            },
            update: {
              quantidade: Number(esp.itemCount),
            },
            where: {
              unidadeId_especialidadeId: {
                especialidadeId: esp.itemId,
                unidadeId: input.hospitalId,
              },
            },
          }),
        ),

        // CRIA OU ATUALIZA OS EQUIPAMENTOS, DEPENDENDO SE JA EXISTEM OU NAO
        ...input.equipamentos.map((eqp) =>
          prisma.unidadeEquipamentos.upsert({
            create: {
              equipamentoId: eqp.itemId,
              quantidade: Number(eqp.itemCount),
              unidadeId: input.hospitalId,
            },
            update: {
              quantidade: Number(eqp.itemCount),
            },
            where: {
              unidadeId_equipamentoId: {
                equipamentoId: eqp.itemId,
                unidadeId: input.hospitalId,
              },
            },
          }),
        ),
      ]),
    ),
});
