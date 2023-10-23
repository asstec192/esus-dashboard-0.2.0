import * as z from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { ocorrenciasPorRisco } from "@/lib/ocorrencias-por-risco";
import { ocorrenciasEmAndamento } from "@/lib/ocorrencias-tempo-real";
import { ligacoesPorTipo } from "@/lib/ligacoes-por-tipo";
import { ocorrencias } from "@/lib/ocorrencias";
import { ocorrenciasPorHorarioDeDeslocamento } from "@/lib/ocorrencias-por-horario-deslocamento";
import { ocorrenciasPorTipoDeVeiculo } from "@/lib/ocorrencias-por-tipo-veiculo";
import { prisma } from "@/server/db";
import { dateRangeInput } from "@/hooks/useGlobalDateFilterStore";
import { estatisticasDiarias } from "@/lib/estatisticas-diarias";

export const incidentsRouter = createTRPCRouter({
  getOne: protectedProcedure
    .input(z.object({ incidentId: z.number() }))
    .query(({ input }) =>
      prisma.ocorrencia.findUnique({
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
          FORMEQUIPE_SolicitacaoVeiculo: {
            select: {
              Operador: {
                select: {
                  OperadorNM: true,
                },
              },
            },
            where: {
              VeiculoSEQ: 1,
            },
            take: 1,
          },
          OcorrenciaMovimentacao: {
            include: {
              Veiculo: {
                select: {
                  VeiculoDS: true,
                },
              },
            },
          },
          Vitimas: {
            select: {
              VitimaNM: true,
              VitimaId: true,
              Sexo: true,
              Idade: true,
              IdadeTP_Vitimas_IdadeTPToIdadeTP: {
                select: {
                  IdadeTPDS: true,
                },
              },
              OCORRENCIA_AVALIACAO_INICIAL: {
                select: {
                  DTHR: true,
                  AVALICAO: true,
                  Operador: {
                    select: {
                      OperadorNM: true,
                    },
                  },
                },
              },
              HistoricoDecisaoGestora: {
                take: 1,
                select: {
                  Destino: {
                    select: {
                      UnidadeDS: true,
                    },
                  },
                },
                orderBy: {
                  DTHR_DECISAO_GESTORAID: "desc",
                },
              },
            },
          },
        },
        where: {
          OcorrenciaID: input.incidentId,
        },
      }),
    ),

  getAll: publicProcedure.input(dateRangeInput).query(async ({ input }) => {
    return await ocorrencias(input);
  }),
  getTotalIncidentsByRisk: publicProcedure.query(() => ocorrenciasPorRisco()),
  getIncidentsInProgress: publicProcedure.query(() => ocorrenciasEmAndamento()),
  getTotalIncidentsByCallType: publicProcedure.query(() => ligacoesPorTipo()),
  getTotalIncidentsByHour: publicProcedure
    .input(dateRangeInput)
    .query(({ input }) => ocorrenciasPorHorarioDeDeslocamento(input)),
  getTotalIncidentsByVehicleType: publicProcedure
    .input(dateRangeInput)
    .query(({ input }) => ocorrenciasPorTipoDeVeiculo(input)),
  getDailyInfo: protectedProcedure.query(() => estatisticasDiarias()),
});
