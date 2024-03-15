import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { db } from "@/server/db";
import { endOfDay, startOfDay } from "date-fns";
import { formSchemaRelatorioHospital } from "@/validators";

export const hospitalManagerRouter = createTRPCRouter({
  getEspecialidades: protectedProcedure.query(() =>
    db.especialidades.findMany(),
  ),

  getEquipamentos: protectedProcedure.query(() => db.equipamentos.findMany()),

  addEspecialidade: protectedProcedure
    .input(z.object({ descricao: z.string().min(1) }))
    .mutation(({ input }) =>
      db.especialidades.create({
        data: {
          descricao: input.descricao,
        },
      }),
    ),

  addEquipamento: protectedProcedure
    .input(z.object({ descricao: z.string().min(1) }))
    .mutation(({ input }) =>
      db.equipamentos.create({
        data: {
          descricao: input.descricao,
        },
      }),
    ),

  obterRelatorios: protectedProcedure.input(z.date()).query(({ input }) =>
    db.unidadeRelatorio.findMany({
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
    .query(({ input }) =>
      db.unidadeRelatorio.findUnique({
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

  obterRelatoriosAgrupadosPorHospitais: protectedProcedure
    .input(z.date())
    .query(({ input }) =>
      db.unidadesDestino.findMany({
        where: {
          Relatorios: {
            some: {
              createdAt: {
                gte: startOfDay(input),
                lt: endOfDay(input),
              },
            },
          },
        },
        orderBy: {
          UnidadeDS: "asc",
        },
        select: {
          UnidadeDS: true,
          UnidadeCOD: true,
          Relatorios: {
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
            orderBy: {
              createdAt: "asc",
            },
            where: {
              createdAt: {
                gte: startOfDay(input),
                lt: endOfDay(input),
              },
            },
          },
        },
      }),
    ),

  obterUltimoRegistroDeEspecialidadesDoHospital: protectedProcedure
    .input(z.object({ unidadeId: z.number() }))
    .mutation(({ input }) =>
      db.unidadeRelatorio.findFirst({
        where: { unidadeId: input.unidadeId },
        select: {
          UnidadeRelatorioEspecialidades: {
            include: {
              especialidade: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      }),
    ),

  obterUltimoRegistroDeEquipamentosDoHospital: protectedProcedure
    .input(z.object({ unidadeId: z.number() }))
    .mutation(({ input }) =>
      db.unidadeRelatorio.findFirst({
        where: { unidadeId: input.unidadeId },
        select: {
          UnidadeRelatorioEquipamentos: {
            include: {
              equipamento: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      }),
    ),

  criarRelatorio: protectedProcedure
    .input(formSchemaRelatorioHospital)
    .mutation(async ({ input, ctx }) => {
      const dataAtual = new Date();
      const dataEditada = input.createdAt.setHours(
        dataAtual.getHours(),
        dataAtual.getMinutes(),
        dataAtual.getSeconds(),
        dataAtual.getMilliseconds(),
      );
      const createdAt = new Date(dataEditada);

      return db.unidadeRelatorio.create({
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
          createdAt,
          updatedAt: createdAt,
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
      });
    }),

  atualizarRelatorio: protectedProcedure
    .input(formSchemaRelatorioHospital)
    .mutation(({ input, ctx }) =>
      db.$transaction([
        //ATUALIZANDO O RELATORIO
        db.unidadeRelatorio.update({
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
          db.unidadeRelatorioEquipamentos.upsert({
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

        //REMOVENDO EQUIPAMENTOS
        db.unidadeRelatorioEquipamentos.deleteMany({
          where: {
            relatorioId: input.relatorioId,
            equipamentoId: {
              notIn: input.equipamentos.map((eqp) => eqp.itemId),
            },
          },
        }),

        //ATUALIZANDO CADA ESPECIALIDADE
        ...input.especialidades.map((esp) =>
          db.unidadeRelatorioEspecialidades.upsert({
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

        //REMOVENDO ESPECIALIDADES
        db.unidadeRelatorioEspecialidades.deleteMany({
          where: {
            relatorioId: input.relatorioId,
            especialidadeId: {
              notIn: input.especialidades.map((esp) => esp.itemId),
            },
          },
        }),
      ]),
    ),

  deleteRelatorio: protectedProcedure
    .input(z.object({ relatorioId: z.number() }))
    .mutation(({ input }) =>
      db.unidadeRelatorio.delete({
        where: {
          id: input.relatorioId,
        },
      }),
    ),
});
