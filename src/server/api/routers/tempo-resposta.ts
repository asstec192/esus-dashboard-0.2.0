import { startOfDay, subHours } from "date-fns";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { db } from "@/server/db";

export const tempoRespostaRouter = createTRPCRouter({
  tarm: protectedProcedure.query(async () => {
    // inicio do dia menos fuso horario
    const date = subHours(startOfDay(new Date()), 3);

    const tempoTarm = await db.$queryRaw<
      { operador: string; countOcorrencia: number; tempo: number }[]
    >`
        SELECT
            TempoPorOcorrencia.operador,
            COUNT(TempoPorOcorrencia.operador) as countOcorrencias,
            AVG(DATEDIFF(MINUTE,TempoPorOcorrencia.data_inicial, TempoPorOcorrencia.data_final)) tempo
        FROM
        (
            SELECT 
            O.OcorrenciaID,
            OP.OperadorNM as operador,
            O.DtHr as data_inicial,
            Min(PO.OrigemDTHR) as data_final
            FROM Ocorrencia O 
            JOIN PosicaoOcorrencias PO On PO.OcorrenciaID = O.OcorrenciaID 
            JOIN OperadoresDados OP ON OP.OperadorID = PO.OperadorID 
            WHERE O.DtHr > ${date} AND OP.ProfisionalTP = 'TARM'
            GROUP BY 
            O.OcorrenciaID,
            O.DtHr,
            OP.OperadorNM 
        ) AS TempoPorOcorrencia
        GROUP BY TempoPorOcorrencia.operador
        ORDER BY TempoPorOcorrencia.operador`;

    return tempoTarm;
  }),

  medico: protectedProcedure.query(async () => {
    const date = subHours(startOfDay(new Date()), 3);

    const tempoMedico = await db.$queryRaw<
      { operador: string; countOcorrencia: number; tempo: number }[]
    >`
        SELECT
            TempoPorOcorrencia.operador,
            COUNT(TempoPorOcorrencia.operador) countOcorrencia,
            AVG(DATEDIFF(MINUTE, TempoPorOcorrencia.data_inicial, TempoPorOcorrencia.data_final)) tempo
        FROM
        (
            SELECT 
            SV.OcorrenciaID,
            OP.OperadorNM as operador,
            Min(PO.OrigemDTHR) as data_inicial,
            SV.RegistroDT as data_final
            FROM FORMEQUIPE_SolicitacaoVeiculo SV
            JOIN PosicaoOcorrencias PO On PO.OcorrenciaID = SV.OcorrenciaID 
            JOIN OperadoresDados OP ON OP.OperadorID = SV.OperadorID
            JOIN Ocorrencia O ON O.OcorrenciaID = SV.OcorrenciaID
            WHERE O.DtHr >= ${date} AND
                SV.VeiculoSEQ = 1 AND OP.ProfisionalTP = 'MEDICO'
            GROUP BY 
                SV.OcorrenciaID,
                SV.RegistroDT,
                OP.OperadorNM 
        ) as TempoPorOcorrencia
        GROUP BY TempoPorOcorrencia.operador
        ORDER BY TempoPorOcorrencia.operador`;

    return tempoMedico;
  }),

  movimentacoes: protectedProcedure.query(async () => {
    const date = subHours(new Date().setHours(0, 0, 0, 0), 3);

    const [{ QTYQUS, QUSQUY, QUYQUU }]: [
      { QTYQUS: number; QUSQUY: number; QUYQUU: number },
    ] = await db.$queryRaw`
      SELECT 
        AVG(DATEDIFF(minute, EnvioEquipeDT, ChegadaLocalDT)) AS QTYQUS,
        AVG(DATEDIFF(minute, ChegadaLocalDT, SaidaLocalDT)) AS QUSQUY,
        AVG(DATEDIFF(minute, SaidaLocalDT, ChegadaDestinoDT)) AS QUYQUU
      FROM OcorrenciaMovimentacao OM
      JOIN Ocorrencia O ON O.OcorrenciaID = OM.OcorrenciaID
      WHERE O.DtHr >= ${date}
      `;

    return [
      { label: "Chegada ao local", value: QTYQUS },
      { label: "Atendimento no local", value: QUSQUY },
      { label: "Chegada ao destino", value: QUYQUU },
    ];
  }),
});
