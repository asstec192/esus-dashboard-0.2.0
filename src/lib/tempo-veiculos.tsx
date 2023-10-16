import { prisma } from "../server/db";
import { DateRange } from "react-day-picker";
import { getTurnQuery } from "@/utils/getTurnQuery";
import { Turn } from "@/hooks/useGlobalDateFilterStore";
import { subHours } from "date-fns";

export interface TempoVeiculos {
  media?: Media;
  individual: Individual[];
}

interface Media {
  QTYQUS: number;
  QUSQUY: number;
  QUYQUU: number;
}

interface Individual {
  nome: string;
  QTYQUS?: number;
  QUSQUY?: number;
  QUYQUU?: number;
}

/**
 * Faz uma consulta ao banco de dados de forma assincrona para obter o tempo resposta dos veiculos
 * @param date A data em YYYY-MM usada para filtrar a busca
 * @returns Um objeto contendo o tempo resposta medio geral e o tempo resposta medio de cada veiculo
 */
export async function tempoVeiculos(dateRange: DateRange, turn: Turn) {
  const from = subHours(new Date(dateRange.from!.setHours(1, 0, 0, 0)), 3);
  const to = subHours(new Date(dateRange.to!.setHours(1, 0, 0, 0)), 3);
  const turnRangeQuery = getTurnQuery(turn);
  console.log(turn);
  const mediaGeral = await prisma.$queryRaw<Media[]>`
    SELECT
        AVG(DATEDIFF(minute, OM.EnvioEquipeDT, OM.ChegadaLocalDT)) AS QTYQUS,
        AVG(DATEDIFF(minute, OM.SaidaLocalDT, OM.ChegadaDestinoDT)) AS QUSQUY,
        AVG(DATEDIFF(minute, OM.ChegadaDestinoDT, OM.RetornoDestinoDT)) AS QUYQUU
    FROM
        OcorrenciaMovimentacao OM
    WHERE OM.EnvioEquipeDT BETWEEN ${from} AND ${to} ${turnRangeQuery}`;

  const mediaIndividual = await prisma.$queryRaw<Individual[]>`
     SELECT
          V.VeiculoDS AS nome,
          AVG(DATEDIFF(minute, OM.EnvioEquipeDT, OM.ChegadaLocalDT)) AS QTYQUS,
          AVG(DATEDIFF(minute, OM.SaidaLocalDT, OM.ChegadaDestinoDT)) AS QUSQUY,
          AVG(DATEDIFF(minute, OM.ChegadaDestinoDT, OM.RetornoDestinoDT)) AS QUYQUU
      FROM
          OcorrenciaMovimentacao OM
          JOIN Veiculos V ON OM.VeiculoID = V.VeiculoID
      WHERE OM.EnvioEquipeDT BETWEEN ${from} AND ${to} ${turnRangeQuery}  
      GROUP BY
          V.VeiculoDS`;

  return {
    media: mediaGeral[0],
    individual: mediaIndividual,
  };
}
