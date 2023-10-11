import { prisma } from "../server/db"
import { subHours } from "date-fns"

export interface RiskTypeCount {
  risco: string
  total: number
}

export const ocorrenciasPorRisco = async () => {
  const date = subHours(new Date(), 3)
  const data: RiskTypeCount[] = await prisma.$queryRaw`
    SELECT 
      RISCODS as risco, 
      COUNT(*) AS total
    FROM Ocorrencia O
    JOIN CLASSIFICACAO_RISCO ON O.RISCOCOD = CLASSIFICACAO_RISCO.RISCOCOD
    WHERE (O.RISCOCOD BETWEEN 1 AND 4)
    AND  O.DtHr >= ${date}
    GROUP BY RISCODS
  `
  return data
}
