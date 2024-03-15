import { PrismaClient } from "@prisma/client";

import { env } from "@/env.mjs";
import { getColorByRisk } from "@/utils/getColorByRisk";

const prismaClientSingleton = () => {
  return new PrismaClient({
    log:
      env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  }).$extends({
    //Extensao para obter valores computados.
    //Para saber mais sobre valores computados do prisma acesse: https://www.prisma.io/docs/orm/prisma-client/queries/computed-fields
    result: {
      cLASSIFICACAO_RISCO: {
        riscoColorClass: {
          needs: { RISCOCOD: true },
          compute: (risco) => getColorByRisk(risco.RISCOCOD),
        },
      },

      ocorrencia: {
        //coluna computada para cor do risco
        riscoColorClass: {
          needs: { RISCOCOD: true },
          compute: (risco) => getColorByRisk(risco.RISCOCOD),
        },
      },

      vitimas: {
        // Decobri acidentalmente um hack,
        // pasando o mesmo nome da coluna original porem em case diferente, neste caso "sexo" e "Sexo",
        // permitira selecionar o valor computado em funcoes de agregacao como o groupBy
        // o tipo nao sera inferido mas o valor de "sexo" estará no resultado junto com o valor do "Sexo"
        // veja o exemplo de uso em src/server/api/routers/pacientes.ts
        sexo: {
          needs: { Sexo: true },
          compute: (vitima) =>
            vitima.Sexo === 1
              ? "Masculino"
              : vitima.Sexo === 2
                ? "Feminino"
                : "Não informado",
        },
        tipoIdade: {
          needs: { IdadeTP: true },
          compute: (vitima) =>
            vitima.IdadeTP === 1
              ? "DIA(s)"
              : vitima.IdadeTP === 2
                ? "MES(es)"
                : "ANO(s)",
        },
        faixaEtaria: {
          needs: { Idade: true, IdadeTP: true },
          compute: (vitima) => {
            const idadeTP = vitima.IdadeTP;
            const idade = vitima.Idade;
            if (!idade || !idadeTP) return "Não informado";
            const idadeEmAnos = idadeTP === 3;

            return !idadeEmAnos
              ? "<1"
              : idade <= 12
                ? "1-12"
                : idade <= 18
                  ? "13-18"
                  : idade <= 29
                    ? "19-29"
                    : idade <= 39
                      ? "30-39"
                      : idade <= 49
                        ? "40-49"
                        : idade <= 59
                          ? "50-59"
                          : ">59";
          },
        },
      },

      veiculos: {
        tipo: {
          needs: { VeiculoDS: true },
          compute(veiculo) {
            if (
              veiculo.VeiculoDS?.includes("USB") ||
              veiculo.VeiculoDS?.includes("M-")
            )
              return "USB";
            if (veiculo.VeiculoDS?.includes("MOT")) return "MOT";
            if (veiculo.VeiculoDS?.includes("BIK")) return "BIK";
            if (veiculo.VeiculoDS?.includes("USI")) return "USI";
            if (veiculo.VeiculoDS?.includes("USA MED")) return "REM";
            if (veiculo.VeiculoDS?.includes("USA")) return "USA";
            return null;
          },
        },
      },

      dashboardLogSituacaoFrota: {
        percentualUSB: {
          needs: { USB_ocupadas: true, USB_total: true },
          compute: (log) => {
            let result = 0;
            result = Math.ceil(
              ((log.USB_ocupadas ?? 0) / (log.USB_total ?? 0)) * 100,
            );
            return isNaN(result) ? 0 : !isFinite(result) ? 100 : result;
          },
        },
        percentualMOT: {
          needs: { MOT_ocupadas: true, MOT_total: true },
          compute: (log) => {
            let result = 0;
            result = Math.ceil(
              ((log.MOT_ocupadas ?? 0) / (log.MOT_total ?? 0)) * 100,
            );
            return isNaN(result) ? 0 : !isFinite(result) ? 100 : result;
          },
        },
        percentualBIK: {
          needs: { BIK_ocupadas: true, BIK_total: true },
          compute: (log) => {
            let result = 0;
            result = Math.ceil(
              ((log.BIK_ocupadas ?? 0) / (log.BIK_total ?? 0)) * 100,
            );
            return isNaN(result) ? 0 : !isFinite(result) ? 100 : result;
          },
        },
        percentualREM: {
          needs: { REM_ocupadas: true, REM_total: true },
          compute: (log) => {
            let result = 0;
            result = Math.ceil(
              ((log.REM_ocupadas ?? 0) / (log.REM_total ?? 0)) * 100,
            );
            return isNaN(result) ? 0 : !isFinite(result) ? 100 : result;
          },
        },
        percentualUSA: {
          needs: { USA_ocupadas: true, USA_total: true },
          compute: (log) => {
            let result = 0;
            result = Math.ceil(
              ((log.USA_ocupadas ?? 0) / (log.USA_total ?? 0)) * 100,
            );
            return isNaN(result) ? 0 : !isFinite(result) ? 100 : result;
          },
        },
        percentualUSI: {
          needs: { USI_ocupadas: true, USI_total: true },
          compute: (log) => {
            let result = 0;
            result = Math.ceil(
              ((log.USI_ocupadas ?? 0) / (log.USI_total ?? 0)) * 100,
            );
            return isNaN(result) ? 0 : !isFinite(result) ? 100 : result;
          },
        },
      },
    },
  });
};

const globalForPrisma = globalThis as unknown as {
  prisma: ReturnType<typeof prismaClientSingleton> | undefined;
};

export const db = globalForPrisma.prisma ?? prismaClientSingleton();

if (env.NODE_ENV !== "production") globalForPrisma.prisma = db;
