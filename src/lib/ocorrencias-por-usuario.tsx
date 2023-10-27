import { prisma } from "../server/db";

export async function ocorrenciasPorUsuario(esusUserId: number) {
  const data = await prisma.$queryRaw<[]>`
    SELECT 
      o.OcorrenciaID as id,
      o.DtHr as data,
      o.Bairro as bairro,
      o.RISCOCOD as risco,
      m.MotivoDS AS motivo,
      (
        SELECT TOP 1 od.OperadorNM as nome_operador
        FROM FORMEQUIPE_SolicitacaoVeiculo sv
        JOIN OperadoresDados od ON sv.OperadorID = od.OperadorID
        WHERE sv.OcorrenciaID = o.OcorrenciaID AND sv.VeiculoSEQ = 1
      ) AS operador,
      (
        SELECT v.VitimaNM as nome, v.Sexo as sexo, v.Idade as idade, i.IdadeTPDS as idadeTipo
        FROM Vitimas v
        JOIN IdadeTP i ON i.IdadeTP = v.IdadeTP
        WHERE o.OcorrenciaID = v.OcorrenciaID
        FOR JSON PATH
      ) AS vitimas,
      (
        SELECT om.EnvioEquipeDT, om.ChegadaBaseDT, om.ChegadaDestinoDT,
              om.ChegadaLocalDT, om.SaidaBaseDT, om.RetornoDestinoDT,
              om.SaidaLocalDT, ve.VeiculoDS as nome
        FROM OcorrenciaMovimentacao om
        JOIN Veiculos ve ON om.VeiculoID = ve.VeiculoID
        WHERE o.OcorrenciaID = om.OcorrenciaID
        ORDER BY om.EnvioEquipeDT ASC
        FOR JSON PATH
      ) AS veiculos
    FROM Ocorrencia o
    LEFT JOIN Motivo m ON o.MotivoID = m.MotivoID
    LEFT JOIN LigacaoTP lt ON lt.LigacaoTPID = o.LigacaoTPID
    WHERE 
      o.LigacaoTPID IN (9, 11, 15, 20)   
      AND EXISTS (
        SELECT 1
        FROM OCORRENCIA_AVALIACAO_INICIAL oa
        WHERE oa.OcorrenciaID = o.OcorrenciaID
        AND oa.OperadorID = ${esusUserId}
		  )
    ORDER BY
      o.OcorrenciaID DESC
    `;

  // Fazendo o parse apenas dos campos veiculos e vitimas que são JSON
  const parsedData: Ocorrencia[] = data.map((ocorrencia?: any) => ({
    id: ocorrencia.id.toString(),
    data: ocorrencia.data,
    bairro: ocorrencia.bairro || "",
    risco: ocorrencia.risco,
    desfecho: ocorrencia.desfecho,
    operador: ocorrencia.operador || "",
    motivo: ocorrencia.motivo?.replace(/\*/g, "") || "NÃO PREENCHIDO",
    veiculos: ocorrencia.veiculos ? JSON.parse(ocorrencia.veiculos) : [],
    pacientes: ocorrencia.vitimas ? JSON.parse(ocorrencia.vitimas) : [],
  }));

  return parsedData;
}
