import { prisma } from "../server/db";

import { DateRange } from "react-day-picker";
import { getTurnQuery } from "@/utils/getTurnQuery";
import { subHours } from "date-fns";
import { Turn } from "@/hooks/useGlobalDateFilterStore";

interface Media {
  tempo: number;
}

interface Individual {
  id: string;
  nome: string;
  tempo: number;
  totalOcorrencias: number;
}

export interface TempoHospitais {
  media?: Media;
  individual: Individual[];
}

export async function tempoHospitais(dateRange: DateRange, turn: Turn) {
  const from = subHours(dateRange.from!.setHours(1, 0, 0, 0), 3);
  const to = subHours(dateRange.to!.setHours(1, 0, 0, 0), 3);
  const turnRangeQuery = getTurnQuery(turn);

  const mediaGeral = await prisma.$queryRaw<Media[]>`
     SELECT 
        AVG(DATEDIFF(minute, OcorrenciaMovimentacao.ChegadaDestinoDT, OcorrenciaMovimentacao.RetornoDestinoDT)) AS tempo
      FROM HISTORICO_DECISAO_GESTORA AS HDG
      INNER JOIN OcorrenciaMovimentacao ON OcorrenciaMovimentacao.OcorrenciaID = HDG.OCORRENCIAID
      LEFT JOIN UnidadesDestino AS UD ON HDG.DESTINOID = UD.UnidadeCOD
      INNER JOIN Ocorrencia O ON O.OcorrenciaID = HDG.OCORRENCIAID
      WHERE OcorrenciaMovimentacao.EnvioEquipeDT BETWEEN ${from} AND ${to} ${turnRangeQuery}
  `;

  const mediaIndividual = await prisma.$queryRaw<Individual[]>`
      SELECT
          UD.UnidadeCOD AS id,
        UD.UnidadeDS AS nome,
          COUNT(OcorrenciaMovimentacao.OcorrenciaID) AS totalOcorrencias,
          AVG(
              DATEDIFF(
                  MINUTE,
                  OcorrenciaMovimentacao.ChegadaDestinoDT,
                  OcorrenciaMovimentacao.RetornoDestinoDT
              )
          ) AS tempo
      FROM UnidadesDestino UD
      LEFT JOIN HISTORICO_DECISAO_GESTORA HDG ON UD.UnidadeCOD = HDG.DESTINOID
      LEFT JOIN OcorrenciaMovimentacao ON HDG.OCORRENCIAID = OcorrenciaMovimentacao.OcorrenciaID
      WHERE OcorrenciaMovimentacao.ChegadaDestinoDT IS NOT NULL
          AND OcorrenciaMovimentacao.RetornoDestinoDT IS NOT NULL
          AND OcorrenciaMovimentacao.EnvioEquipeDT BETWEEN ${from} AND ${to} ${turnRangeQuery}
      GROUP BY
          UD.UnidadeCOD,
        UD.UnidadeDS
      ORDER BY
          tempo ASC`;

  return {
    media: mediaGeral[0],
    individual: mediaIndividual,
  };
}
