import { SchemaRelatorioHospital } from "@/constants/zod-schemas";
import { api } from "@/trpc/react";
import { UseFormReturn } from "react-hook-form";

export function useEncontraUltimoRegistroDeItemsDaUnidade(
  form: UseFormReturn<SchemaRelatorioHospital>,
) {
  const buscaEquipamentosMutation =
    api.hospitalManager.obterUltimoRegistroDeEquipamentosDoHospital.useMutation(
      {
        onSuccess: (relatorio) =>
          form.setValue(
            "equipamentos",
            relatorio?.UnidadeRelatorioEquipamentos.map((eqp) => ({
              itemId: eqp.equipamentoId,
              itemCount: eqp.quantidade.toString(),
              itemDescription: eqp.equipamento.descricao,
            })) || [],
          ),
      },
    );

  const buscaEspecialidadesMutation =
    api.hospitalManager.obterUltimoRegistroDeEspecialidadesDoHospital.useMutation(
      {
        onSuccess: (relatorio) =>
          form.setValue(
            "especialidades",
            relatorio?.UnidadeRelatorioEspecialidades.map((esp) => ({
              itemId: esp.especialidadeId,
              itemCount: esp.quantidade.toString(),
              itemDescription: esp.especialidade.descricao,
            })) || [],
          ),
      },
    );

  return { buscaEquipamentosMutation, buscaEspecialidadesMutation };
}
