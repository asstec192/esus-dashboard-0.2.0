import { startOfDay, subHours } from "date-fns";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { db } from "@/server/db";
import { tzOffset } from "@/constants/timezone-offset";

// TODAS AS DATAS ESTAO OK

export const tempoRespostaRouter = createTRPCRouter({
  tarm: protectedProcedure.query(async () => {
    const date = subHours(startOfDay(new Date()), tzOffset);

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
    const date = subHours(startOfDay(new Date()), tzOffset);

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
    const date = subHours(startOfDay(new Date()), tzOffset);

    const [tempos]: [
      {
        saidaDaBase: number;
        chegadaAoLocal: number;
        atendimentoNoLocal: number;
        chegadaAoDestino: number;
        retornoDoDestino: number;
        chegadaBase: number;
      },
    ] = await db.$queryRaw`
      SELECT 
        AVG(DATEDIFF(minute, EnvioEquipeDT, SaidaBaseDT)) AS saidaDaBase,
        AVG(DATEDIFF(minute, SaidaBaseDT, ChegadaLocalDT)) AS chegadaAoLocal,
        AVG(DATEDIFF(minute, ChegadaLocalDT, SaidaLocalDT)) AS atendimentoNoLocal, 
        AVG(DATEDIFF(minute, SaidaLocalDT, ChegadaDestinoDT)) AS chegadaAoDestino,
        AVG(DATEDIFF(minute, ChegadaDestinoDT, RetornoDestinoDT)) AS retornoDoDestino, 
        AVG(DATEDIFF(minute, RetornoDestinoDT, ChegadaBaseDT)) AS chegadaBase 
      FROM OcorrenciaMovimentacao OM
      JOIN Ocorrencia O ON O.OcorrenciaID = OM.OcorrenciaID
      WHERE OM.EnvioEquipeDT >= ${date}
      `;

    return [
      { label: "Saída da base", value: tempos.saidaDaBase },
      { label: "Chegada ao local", value: tempos.chegadaAoLocal },
      { label: "Atendimento no local", value: tempos.atendimentoNoLocal },
      { label: "Chegada ao destino", value: tempos.chegadaAoDestino },
      { label: "Retorno do destino", value: tempos.retornoDoDestino },
      { label: "Chegada à base", value: tempos.chegadaBase },
    ] as const;
  }),
});
