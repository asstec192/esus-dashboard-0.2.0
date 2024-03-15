import { SchemaRelatorioHospital } from "@/validators";
import { api } from "@/trpc/react";
import { UseFormReturn } from "react-hook-form";

/**
 * Obtem os equipamentos e unidades mais recentes do hospital selecionado
 * @param form O formulario de  gerenciamento da rede
 * @returns
 */
export function useItensRecentesMutation(
  form: UseFormReturn<SchemaRelatorioHospital>,
) {
  const { mutate: buscaEquipamentosRecentes } =
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

  const { mutate: buscaEspecialidadesRecentes } =
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

  const buscarItensRecentes = (unidadeId: number) => {
    buscaEquipamentosRecentes({ unidadeId });
    buscaEspecialidadesRecentes({ unidadeId });
  };

  return buscarItensRecentes;
}
