import { prisma } from "../server/db";
import { Ocorrencia } from "./ocorrencias";

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
        SELECT v.VitimaNM as nome, v.VitimaId as id, v.Sexo as sexo, v.Idade as idade,
          (
            SELECT oa.DTHR as data, oa.AVALICAO as descricao,
                  od.OperadorNM as operador
            FROM OCORRENCIA_AVALIACAO_INICIAL oa
            JOIN OperadoresDados od ON oa.OperadorID = od.OperadorID
            WHERE v.VitimaId = oa.VitimaId
            ORDER BY oa.DTHR DESC
            FOR JSON PATH
          ) AS avaliacoes,
          (
            SELECT TOP 1 ud.UnidadeDS
            FROM HISTORICO_DECISAO_GESTORA HDG
			      LEFT JOIN UnidadesDestino ud ON ud.UnidadeCOD = HDG.DESTINOID
            WHERE HDG.OCORRENCIAID = o.OcorrenciaID
            ORDER BY HDG.DTHR_DECISAO_GESTORAID DESC
          ) AS ultima_decisao
        FROM Vitimas v
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
