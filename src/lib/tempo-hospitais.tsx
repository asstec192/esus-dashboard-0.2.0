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
        AVG(media) AS tempo
    FROM (
        SELECT
            UD.UnidadeCOD AS UnidadeDestinoID,
            AVG(
                DATEDIFF(
                    MINUTE,
                    OM.ChegadaDestinoDT,
                    OM.RetornoDestinoDT
                )
            ) AS media
        FROM UnidadesDestino UD
        LEFT JOIN HISTORICO_DECISAO_GESTORA HDG ON UD.UnidadeCOD = HDG.DESTINOID
        LEFT JOIN OcorrenciaMovimentacao OM ON HDG.OCORRENCIAID = OM.OcorrenciaID
        LEFT JOIN Ocorrencia O ON O.OcorrenciaID = HDG.OCORRENCIAID
        WHERE
            OM.ChegadaDestinoDT IS NOT NULL
            AND OM.RetornoDestinoDT IS NOT NULL
            AND O.DtHr BETWEEN ${from} AND ${to} ${turnRangeQuery}
        GROUP BY
            UD.UnidadeCOD
    ) AS Subconsulta`;

  const mediaIndividual = await prisma.$queryRaw<Individual[]>`
      SELECT
          UD.UnidadeCOD AS id,
        UD.UnidadeDS AS nome,
          COUNT(DISTINCT OM.OcorrenciaID) AS totalOcorrencias,
          AVG(
              DATEDIFF(
                  MINUTE,
                  OM.ChegadaDestinoDT,
                  OM.RetornoDestinoDT
              )
          ) AS tempo
      FROM UnidadesDestino UD
      LEFT JOIN HISTORICO_DECISAO_GESTORA HDG ON UD.UnidadeCOD = HDG.DESTINOID
      LEFT JOIN OcorrenciaMovimentacao OM ON HDG.OCORRENCIAID = OM.OcorrenciaID
      LEFT JOIN Ocorrencia O ON O.OcorrenciaID = HDG.OCORRENCIAID
      WHERE OM.ChegadaDestinoDT IS NOT NULL
          AND OM.RetornoDestinoDT IS NOT NULL
          AND O.DtHr BETWEEN ${from} AND ${to} ${turnRangeQuery}
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
