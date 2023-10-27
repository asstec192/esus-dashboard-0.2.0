import { prisma } from "../server/db";
import { subHours } from "date-fns";

export interface CallTypeCount {
  tipo: string;
  total: number;
}

export const ligacoesPorTipo = async () => {
  const date = subHours(new Date().setHours(1, 0, 0, 0), 3);
  const data: CallTypeCount[] = await prisma.$queryRaw`
    SELECT 
	    LigacaoTPDS as tipo, 
      COUNT(*) AS total
    FROM Ocorrencia O
    LEFT JOIN LigacaoTP ON O.LigacaoTPID = LigacaoTP.LigacaoTPID
    WHERE O.DtHr >= ${date}
    GROUP BY LigacaoTPDS;
  `;
  return data;
};
