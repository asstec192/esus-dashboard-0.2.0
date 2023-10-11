import { prisma } from "@/server/db";
import { Prisma } from "@prisma/client";
import { subDays } from "date-fns";

export async function ocorrenciasTeste() {
  return await prisma.ocorrencia.findMany({
    // CONSULTA PRINCIPAL
    select: {
      OcorrenciaID: true,
      DtHr: true,
      Bairro: true,
      RISCOCOD: true,
      Motivo: {
        select: {
          MotivoDS: true,
        },
      },
      //SUB-CONSULTA DO MEDICO REGULADOR
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
      //SUB-CONSULTA DE PACIENTES
      Vitimas: {
        select: {
          VitimaId: true,
          VitimaNM: true,
          Sexo: true,
          Idade: true,
          IdadeTP_Vitimas_IdadeTPToIdadeTP: {
            select: {
              IdadeTPDS: true,
            },
          },
          OCORRENCIA_AVALIACAO_INICIAL: {
            select: {
              AVALICAO: true,
              DTHR: true,
              Operador: {
                select: {
                  OperadorNM: true,
                },
              },
            },
            orderBy: {
              DTHR: "desc",
            },
          },
        },
      },
      //SUB-CONSULTA DE VEICULOS
      OcorrenciaMovimentacao: {
        select: {
          SaidaBaseDT: true,
          ChegadaBaseDT: true,
          ChegadaDestinoDT: true,
          ChegadaLocalDT: true,
          EnvioEquipeDT: true,
          SaidaLocalDT: true,
          RetornoDestinoDT: true,
          Veiculo: {
            select: {
              VeiculoDS: true,
            },
          },
        },
        orderBy: {
          EnvioEquipeDT: "asc",
        },
      },
    },
    // FILTRO DA CONSULTA PRINCIPAL
    where: {
      RISCOCOD: {
        notIn: [0, 90],
      },
      DtHr: {
        gte: subDays(new Date(), 60),
      },
      OcorrenciaFinalDT: null,
      OcorrenciaMovimentacao: {
        every: {
          RetornoDestinoDT: null,
          Veiculo: {
            Status: "O",
          },
        },
      },
    },
    orderBy: {
      DtHr: "desc",
    },
  });
}

export type OcorrenciaEmAndamento = Prisma.PromiseReturnType<
  typeof ocorrenciasTeste
>[0];
