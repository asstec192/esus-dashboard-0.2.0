import { prisma } from "../server/db";
import { Ocorrencia } from "./ocorrencias";
import { subHours } from "date-fns";

export async function ocorrenciasEmAndamento() {
  //tirando 3 horas para ficar com fuso compativel
  const date = subHours(new Date(), 3);

  const data = await prisma.$queryRaw<[]>`
    SELECT
      DISTINCT
      o.OcorrenciaID as id,
      o.DtHr as data,
      o.Bairro as bairro,
      o.RISCOCOD as risco,
      m.MotivoDS AS motivo,
       -- Seleciona o operador que enviou o primeiro veículo (VeiculoSEQ = 1) para cada ocorrência
      (
        SELECT TOP 1 od.OperadorNM as nome_operador
        FROM FORMEQUIPE_SolicitacaoVeiculo sv
        JOIN OperadoresDados od ON sv.OperadorID = od.OperadorID
        WHERE sv.OcorrenciaID = o.OcorrenciaID AND sv.VeiculoSEQ = 1
      ) AS operador,
      --Seleciona as vitimas de cada ocorrencia
      (
        SELECT v.VitimaNM as nome, v.VitimaId as id, v.Sexo as sexo, v.Idade as idade,
          --Seleciona as avaliacoes de cada vitima
          (
            SELECT oa.DTHR as data, oa.AVALICAO as descricao,
                  od.OperadorNM as operador
            FROM OCORRENCIA_AVALIACAO_INICIAL oa
            JOIN OperadoresDados od ON oa.OperadorID = od.OperadorID
            WHERE v.VitimaId = oa.VitimaId
            ORDER BY oa.DTHR DESC
            FOR JSON PATH
          ) AS avaliacoes
        FROM Vitimas v
        WHERE o.OcorrenciaID = v.OcorrenciaID
        FOR JSON PATH
      ) AS vitimas,
      --Seleciona os veiculos movimentados de cada ocorrencia
      (
        SELECT om.EnvioEquipeDT, om.ChegadaBaseDT, om.ChegadaDestinoDT,
              om.ChegadaLocalDT, om.SaidaBaseDT, om.RetornoDestinoDT,
              om.SaidaLocalDT, ve.VeiculoDS as nome
        FROM OcorrenciaMovimentacao om
        JOIN Veiculos ve ON om.VeiculoID = ve.VeiculoID
        WHERE o.OcorrenciaID = om.OcorrenciaID
        ORDER BY  om.EnvioEquipeDT ASC
        FOR JSON PATH
      ) AS veiculos
    FROM
      Ocorrencia o
    LEFT JOIN Motivo m ON o.MotivoID = m.MotivoID
	  JOIN OcorrenciaMovimentacao om ON o.OcorrenciaID = om.OcorrenciaID
	  JOIN Veiculos v ON om.VeiculoID = v.VeiculoID
    WHERE
      o.RISCOCOD NOT IN (0, 90)
      AND o.DtHr >= ${date}
      AND v.status = 'O'
      AND o.OcorrenciaFinalDT IS NULL
      AND om.RetornoDestinoDT IS NULL
    ORDER BY
      o.DtHr DESC
    `;

  //@ts-ignore Fazendo o parse apenas dos campos veiculos e vitimas que são JSON
  const parsedData: Ocorrencia[] = data.map((ocorrencia: any) => ({
    id: ocorrencia.id.toString(),
    data: ocorrencia.data,
    bairro: ocorrencia.bairro,
    risco: ocorrencia.risco,
    operador: ocorrencia.operador,
    motivo: ocorrencia.motivo?.replace(/\*/g, "") || "NÃO PREENCHIDO",
    veiculos: ocorrencia.veiculos ? JSON.parse(ocorrencia.veiculos) : [],
    pacientes: ocorrencia.vitimas ? JSON.parse(ocorrencia.vitimas) : [],
  }));

  return parsedData;
}
