import { prisma } from "../server/db";

import { DateRange } from "react-day-picker";
import { getTurnQuery } from "@/utils/getTurnQuery";
import { subHours } from "date-fns";
import { Turn } from "@/hooks/useGlobalDateFilterStore";

interface Media {
  tempo: number;
}

interface Individual {
  nome: string;
  tempo: number;
}

export interface TempoHospitais {
  media?: Media;
  individual: Individual[];
}

export async function tempoHospitais(dateRange: DateRange, turn: Turn) {
  const from = subHours(dateRange.from!, 3);
  const to = subHours(dateRange.to!, 3);
  const turnRangeQuery = getTurnQuery(turn);

  const mediaGeral = await prisma.$queryRaw<Media[]>`
     SELECT 
        AVG(DATEDIFF(minute, OM.ChegadaDestinoDT, OM.RetornoDestinoDT)) AS tempo
      FROM HISTORICO_DECISAO_GESTORA AS HDG
      INNER JOIN OcorrenciaMovimentacao AS OM ON OM.OcorrenciaID = HDG.OCORRENCIAID
      LEFT JOIN UnidadesDestino AS UD ON HDG.DESTINOID = UD.UnidadeCOD
      INNER JOIN Ocorrencia O ON O.OcorrenciaID = HDG.OCORRENCIAID
      WHERE OM.EnvioEquipeDT BETWEEN ${from} AND ${to} ${turnRangeQuery}
  `;

  const mediaIndividual = await prisma.$queryRaw<Individual[]>`
      SELECT 
        UD.UnidadeDS AS nome,
        AVG(DATEDIFF(minute, OM.ChegadaDestinoDT, OM.RetornoDestinoDT)) AS tempo
      FROM HISTORICO_DECISAO_GESTORA AS HDG
      INNER JOIN OcorrenciaMovimentacao AS OM ON OM.OcorrenciaID = HDG.OCORRENCIAID
      LEFT JOIN UnidadesDestino AS UD ON HDG.DESTINOID = UD.UnidadeCOD
      INNER JOIN Ocorrencia O ON O.OcorrenciaID = HDG.OCORRENCIAID
      WHERE OM.EnvioEquipeDT BETWEEN ${from} AND ${to} ${turnRangeQuery}
      GROUP BY UD.UnidadeDS, HDG.DESTINOID;
  `;

  return {
    media: mediaGeral[0],
    individual: mediaIndividual,
  };
}
