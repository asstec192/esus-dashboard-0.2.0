import { prisma } from "../server/db";
import { DateRange } from "react-day-picker";
import { getTurnQuery } from "@/utils/getTurnQuery";
import { Turn } from "@/hooks/useGlobalDateFilterStore";
import { format } from "date-fns";

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
  totalOcorrencias: number;
}

export async function tempoVeiculos(dateRange: DateRange, turn: Turn) {
  const from = format(dateRange.from!, "yyyy-MM-dd 1:00:00"); //equivale a 1h da madrugada
  const to = format(dateRange.to!, "yyyy-MM-dd 1:00:00");
  console.log(from, to);
  const turnRangeQuery = getTurnQuery(turn);
  const mediaGeral = await prisma.$queryRaw<Media[]>`
    SELECT
        AVG(DATEDIFF(minute, OM.EnvioEquipeDT, OM.ChegadaLocalDT)) AS QTYQUS,
        AVG(DATEDIFF(minute, OM.SaidaLocalDT, OM.ChegadaDestinoDT)) AS QUSQUY,
        AVG(DATEDIFF(minute, OM.ChegadaDestinoDT, OM.RetornoDestinoDT)) AS QUYQUU
    FROM OcorrenciaMovimentacao OM 
    LEFT JOIN Ocorrencia O ON O.OcorrenciaID = OM.OcorrenciaID
    WHERE O.DtHr BETWEEN ${from} AND ${to} ${turnRangeQuery}`;

  const mediaIndividual = await prisma.$queryRaw<Individual[]>`
    SELECT
        V.VeiculoID AS id,
        V.VeiculoDS AS nome,
        AVG(DATEDIFF(MINUTE, OM.EnvioEquipeDT, OM.ChegadaLocalDT)) AS QTYQUS,
        AVG(DATEDIFF(MINUTE, OM.SaidaLocalDT, OM.ChegadaDestinoDT)) AS  QUSQUY,
        AVG(DATEDIFF(MINUTE, OM.ChegadaDestinoDT, OM.RetornoDestinoDT)) AS QUYQUU,
      COUNT(OM.OcorrenciaID) AS totalOcorrencias
    FROM Veiculos V 
    LEFT JOIN OcorrenciaMovimentacao OM ON V.VeiculoID = OM.VeiculoID
    LEFT JOIN Ocorrencia O ON O.OcorrenciaID = OM.OcorrenciaID
    WHERE O.DtHr BETWEEN ${from} AND ${to} ${turnRangeQuery}
    GROUP BY
        V.VeiculoID, V.VeiculoDS`;

  return {
    media: mediaGeral[0],
    individual: mediaIndividual,
  };
}
