import { prisma } from "../server/db";
import { subHours } from "date-fns";

export type StatusDiario = {
  tempoGeral: number;
  QTYQUS: number;
  QUSQUY: number;
  QUYQUU: number;
  totalLigacoes: number;
};

export const estatisticasDiarias = async () => {
  const tempDate = new Date().setHours(1, 0, 0, 0);
  const date = new Date(tempDate);

  const [{ totalLigacoes }]: any = await prisma.$queryRaw`
    SELECT COUNT(*) AS totalLigacoes                 
    FROM TEMPO_RESPOSTA
    WHERE DT_INICIO >= ${date}
    `;

  const [{ tempoGeral }]: any = await prisma.$queryRaw`
    SELECT AVG(DATEDIFF(minute, DT_INICIO, DT_FIM)) AS tempoGeral
    FROM TEMPO_RESPOSTA
    WHERE DT_INICIO >= ${date}
    `;

  const [{ QTYQUS, QUSQUY, QUYQUU }]: any = await prisma.$queryRaw`
    SELECT 
      AVG(DATEDIFF(minute, EnvioEquipeDT, ChegadaLocalDT)) AS QTYQUS,
      AVG(DATEDIFF(minute, SaidaLocalDT, ChegadaDestinoDT)) AS QUSQUY,
      AVG(DATEDIFF(minute, ChegadaDestinoDT, RetornoDestinoDT)) AS QUYQUU
    FROM OcorrenciaMovimentacao
    WHERE EnvioEquipeDT >= ${date}
    `;

  return {
    tempoGeral,
    QTYQUS,
    QUSQUY,
    QUYQUU,
    totalLigacoes,
  };
};
