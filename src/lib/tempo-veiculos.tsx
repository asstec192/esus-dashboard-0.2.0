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
  id: number;
  nome: string;
  QTYQUS?: number;
  QUSQUY?: number;
  QUYQUU?: number;
  contagemOcorrencias: number;
}

/**
 * Faz uma consulta ao banco de dados de forma assincrona para obter o tempo resposta dos veiculos
 * @param date A data em YYYY-MM usada para filtrar a busca
 * @returns Um objeto contendo o tempo resposta medio geral e o tempo resposta medio de cada veiculo
 */
export async function tempoVeiculos(dateRange: DateRange, turn: Turn) {
  const from = subHours(dateRange.from!.setHours(1, 0, 0, 0), 3);
  const to = subHours(dateRange.to!.setHours(1, 0, 0, 0), 3);
  const turnRangeQuery = getTurnQuery(turn);
  const mediaGeral = await prisma.$queryRaw<Media[]>`
    SELECT
        AVG(DATEDIFF(minute, OcorrenciaMovimentacao.EnvioEquipeDT, OcorrenciaMovimentacao.ChegadaLocalDT)) AS QTYQUS,
        AVG(DATEDIFF(minute, OcorrenciaMovimentacao.SaidaLocalDT, OcorrenciaMovimentacao.ChegadaDestinoDT)) AS QUSQUY,
        AVG(DATEDIFF(minute, OcorrenciaMovimentacao.ChegadaDestinoDT, OcorrenciaMovimentacao.RetornoDestinoDT)) AS QUYQUU
    FROM
        OcorrenciaMovimentacao 
    WHERE OcorrenciaMovimentacao.EnvioEquipeDT BETWEEN ${from} AND ${to} ${turnRangeQuery}`;

  const mediaIndividual = await prisma.$queryRaw<Individual[]>`
    SELECT
        V.VeiculoID AS id,
        V.VeiculoDS AS nome,
        (SELECT COUNT(*) 
          FROM OcorrenciaMovimentacao 
          WHERE OcorrenciaMovimentacao.VeiculoID = V.VeiculoID 
          AND OcorrenciaMovimentacao.EnvioEquipeDT BETWEEN ${from} 
          AND ${to} ${turnRangeQuery}
        ) AS contagemOcorrencias,
        AVG(DATEDIFF(minute, OcorrenciaMovimentacao.EnvioEquipeDT, OcorrenciaMovimentacao.ChegadaLocalDT)) AS QTYQUS,
        AVG(DATEDIFF(minute, OcorrenciaMovimentacao.SaidaLocalDT, OcorrenciaMovimentacao.ChegadaDestinoDT)) AS QUSQUY,
        AVG(DATEDIFF(minute, OcorrenciaMovimentacao.ChegadaDestinoDT, OcorrenciaMovimentacao.RetornoDestinoDT)) AS QUYQUU
    FROM
        OcorrenciaMovimentacao 
        JOIN Veiculos V ON OcorrenciaMovimentacao.VeiculoID = V.VeiculoID
    WHERE OcorrenciaMovimentacao.EnvioEquipeDT BETWEEN ${from} AND ${to} ${turnRangeQuery}
    GROUP BY
        V.VeiculoID, V.VeiculoDS`;

  return {
    media: mediaGeral[0],
    individual: mediaIndividual,
  };
}
