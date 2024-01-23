import { PrismaClient } from "@prisma/client";

import { env } from "@/env.mjs";
import { getColorByRisk } from "@/utils/getColorByRisk";
import { isWithinHour } from "@/utils/isWithinTurn";
import { addHours } from "date-fns";

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

        //coluna computada para o turno da ocorrencia, baseada no turno dos TARMS
        turnoTarm: {
          needs: { DtHr: true },
          compute(ocorrencia) {
            if (!ocorrencia.DtHr) return null;
            if (isWithinHour(addHours(ocorrencia.DtHr, 3), 1, 7)) return "T0";
            if (isWithinHour(addHours(ocorrencia.DtHr, 3), 7, 13)) return "T1";
            if (isWithinHour(addHours(ocorrencia.DtHr, 3), 13, 19)) return "T2";
            return "T3";
          },
        },

        //coluna computada para o turno da ocorrencias baseada nos turnos de veiculos
        turnoVeiculo: {
          needs: { DtHr: true },
          compute(ocorrencia) {
            if (!ocorrencia.DtHr) return null;
            if (isWithinHour(addHours(ocorrencia.DtHr, 3), 7, 19)) return "V0";
            return "V1";
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
            if (veiculo.VeiculoDS?.includes("USA")) return "USA";
            return null;
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
