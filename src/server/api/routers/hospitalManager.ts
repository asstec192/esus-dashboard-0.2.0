import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { prisma } from "@/server/db";
import { FormSchemaGerenciadorHospital } from "@/hooks/useRelatorioUnidadeForm";
import { endOfDay, startOfDay } from "date-fns";

export const hospitalManagerRouter = createTRPCRouter({
  getEspecialidades: protectedProcedure.query(() =>
    prisma.especialidades.findMany(),
  ),

  getEquipamentos: protectedProcedure.query(() =>
    prisma.equipamentos.findMany(),
  ),

  addEspecialidade: protectedProcedure
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

  obterRelatorios: protectedProcedure.input(z.date()).query(({ input }) =>
    prisma.unidadeRelatorio.findMany({
      include: {
        unidade: {
          select: { UnidadeDS: true, UnidadeCOD: true },
        },
        UnidadeRelatorioEquipamentos: {
          include: { equipamento: true },
        },
        UnidadeRelatorioEspecialidades: {
          include: { especialidade: true },
        },
        criadoPor: {
          select: {
            operador: { select: { OperadorNM: true } },
          },
        },
        editadoPor: {
          select: {
            operador: { select: { OperadorNM: true } },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      where: {
        createdAt: {
          gte: startOfDay(input),
          lt: endOfDay(input),
        },
      },
    }),
  ),

  obterRelatorio: protectedProcedure
    .input(z.object({ relatorioId: z.number() }))
    .mutation(({ input }) =>
      prisma.unidadeRelatorio.findUnique({
        where: { id: input.relatorioId },
        include: {
          UnidadeRelatorioEquipamentos: {
            include: { equipamento: true },
          },
          UnidadeRelatorioEspecialidades: {
            include: { especialidade: true },
          },
          criadoPor: {
            select: {
              operador: { select: { OperadorNM: true } },
            },
          },
          editadoPor: {
            select: {
              operador: { select: { OperadorNM: true } },
            },
          },
        },
      }),
    ),

  criarRelatorio: protectedProcedure
    .input(FormSchemaGerenciadorHospital)
    .mutation(({ input, ctx }) =>
      prisma.unidadeRelatorio.create({
        data: {
          chefeEquipe: input.chefeEquipe,
          contato: input.foneContato,
          horaContato: input.horaContato,
          nomeContato: input.pessoaContactada,
          observacao: input.obervacao,
          criadoPorId: Number(ctx.session.user.id),
          editadoPorId: Number(ctx.session.user.id),
          unidadeId: input.hospitalId,
          turno: input.turno,
          UnidadeRelatorioEquipamentos: {
            createMany: {
              data: input.equipamentos.map((eqp) => ({
                equipamentoId: eqp.itemId,
                quantidade: Number(eqp.itemCount),
              })),
            },
          },
          UnidadeRelatorioEspecialidades: {
            createMany: {
              data: input.especialidades.map((esp) => ({
                especialidadeId: esp.itemId,
                quantidade: Number(esp.itemCount),
              })),
            },
          },
        },
      }),
    ),

  atualizarRelatorio: protectedProcedure
    .input(FormSchemaGerenciadorHospital)
    .mutation(({ input, ctx }) =>
      prisma.$transaction([
        //ATUALIZANDO O RELATORIO
        prisma.unidadeRelatorio.update({
          data: {
            chefeEquipe: input.chefeEquipe,
            contato: input.foneContato,
            horaContato: input.horaContato,
            nomeContato: input.pessoaContactada,
            observacao: input.obervacao,
            editadoPorId: Number(ctx.session.user.id),
            turno: input.turno,
          },
          where: {
            id: input.relatorioId,
          },
        }),

        //ATUALIZANDO CADA EQUIPAMENTO
        ...input.equipamentos.map((eqp) =>
          prisma.unidadeRelatorioEquipamentos.upsert({
            create: {
              equipamentoId: eqp.itemId,
              quantidade: Number(eqp.itemCount),
              relatorioId: input.relatorioId,
            },
            update: {
              quantidade: Number(eqp.itemCount),
            },
            where: {
              relatorioId_equipamentoId: {
                equipamentoId: eqp.itemId,
                relatorioId: input.relatorioId,
              },
            },
          }),
        ),

        //ATUALIZANDO CADA ESPECIALIDADE
        ...input.especialidades.map((esp) =>
          prisma.unidadeRelatorioEspecialidades.upsert({
            create: {
              especialidadeId: esp.itemId,
              quantidade: Number(esp.itemCount),
              relatorioId: input.relatorioId,
            },
            update: {
              quantidade: Number(esp.itemCount),
            },
            where: {
              relatorioId_especialidadeId: {
                especialidadeId: esp.itemId,
                relatorioId: input.relatorioId,
              },
            },
          }),
        ),
      ]),
    ),
});
