import { DateRange } from "react-day-picker"
import { prisma } from "../server/db"
import { subHours } from "date-fns"

export type VehicleTypeCount = {
  tipo: string
  contagem: number
}

export const ocorrenciasPorTipoDeVeiculo = async (dateRange: DateRange) => {
  const from = subHours(dateRange.from!, 3);
  const to = subHours(dateRange.to!, 3);

  const data = await prisma.$queryRaw<VehicleTypeCount[]>`
    SELECT
      SUBSTRING(V.VeiculoDS, 1, 3) AS tipo,
      COUNT(*) AS contagem
    FROM OcorrenciaMovimentacao OM
    JOIN Veiculos V ON V.VeiculoID = OM.VeiculoID
    WHERE OM.EnvioEquipeDT BETWEEN ${from} AND ${to} 
    GROUP BY SUBSTRING(V.VeiculoDS, 1, 3)`
  return data
}
