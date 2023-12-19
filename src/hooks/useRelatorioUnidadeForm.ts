import { RouterOutputs, api } from "@/utils/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const HospitalItemSchema = z.object({
  itemId: z.number(),
  itemCount: z.string(),
});

const telefonePattern = /^\(\d{2}\) \d{4}-\d{4}$/;

export const FormSchemaGerenciadorHospital = z.object({
  relatorioId: z.number(),
  hospitalId: z.number().min(1),
  equipamentos: z.array(HospitalItemSchema),
  especialidades: z.array(HospitalItemSchema),
  foneContato: z.string().refine((data) => telefonePattern.test(data), {
    message: "Número de telefone inválido. Use o formato (XX) XXXX-XXXX.",
  }),
  horaContato: z.string().min(5),
  pessoaContactada: z.string().min(1),
  chefeEquipe: z.string().min(1),
  obervacao: z.string().optional(),
  turno: z.string().min(1),
});

export const useRelatorioUnidadeForm = (
  initialData: RouterOutputs["hospitalManager"]["obterRelatorio"],
) => {
  //EQUIPAMENTOS E ESPECIALIDADES INICIAIS DO RELATORIO
  const equipamentosIniciais = initialData?.UnidadeRelatorioEquipamentos.map(
    (eqp) => ({
      itemId: eqp.equipamentoId,
      itemCount: eqp.quantidade.toString(),
    }),
  );
  const especialidadesIniciais =
    initialData?.UnidadeRelatorioEspecialidades.map((esp) => ({
      itemId: esp.especialidadeId,
      itemCount: esp.quantidade.toString(),
    }));

  //OBTENDO O FORM DO HOOK
  const form = useForm<z.infer<typeof FormSchemaGerenciadorHospital>>({
    resolver: zodResolver(FormSchemaGerenciadorHospital),
    values: {
      relatorioId: initialData?.id || 0,
      hospitalId: initialData?.unidadeId || 0,
      chefeEquipe: initialData?.chefeEquipe || "",
      foneContato: initialData?.contato || "",
      horaContato: initialData?.horaContato || "",
      pessoaContactada: initialData?.nomeContato || "",
      obervacao: initialData?.observacao || "",
      turno: initialData?.turno || "",
      equipamentos: equipamentosIniciais || [],
      especialidades: especialidadesIniciais || [],
    },
    defaultValues: {
      relatorioId: 0,
      hospitalId: 0,
      equipamentos: [],
      especialidades: [],
      foneContato: "",
      horaContato: "",
      pessoaContactada: "",
      chefeEquipe: "",
      obervacao: "",
      turno: "",
    },
  });

  //BUSCANDO TODOS OS EQUIPAMENTOS DISPONIVEIS
  api.hospitalManager.getEquipamentos.useQuery(undefined, {
    cacheTime: Infinity,
    onSuccess: (equipamentos) => {
      const equipamentosIniciaisQuantidadesZero = equipamentos.map((eqp) => ({
        itemId: eqp.id,
        itemCount: "0",
      }));
      // SE NAO FOI PASSADO UM ESTADO INICIAL PARA O FORMULARIO ENTAO INICIAMOS COM TODOS OS EQUIPAMENTOS EM QUANTIDADE 0
      if (!initialData) {
        form.setValue("equipamentos", equipamentosIniciaisQuantidadesZero);
      }
      //se houver uma diferença entre o length dos equiapmentos disponiveis e dos equipamentos do relatorio,
      //significa que algum equipamento novo foi cadstrado, entao adicionamos este novo equipamento ao formulario com quantidade inicial de 0
      else if (equipamentosIniciais?.length !== equipamentos.length) {
        //SE FOI PASSADO UM ESTADO INICIAL ATUALIZAMOS OS EQUIPAMENTOS INCIAIS
        const equipamentosIniciaisComQuantidades =
          equipamentosIniciaisQuantidadesZero.map((eqp) => {
            const equipamentoInicial = equipamentosIniciais?.find(
              (ei) => ei.itemId === eqp.itemId,
            );
            return equipamentoInicial || eqp;
          });
        form.setValue("equipamentos", equipamentosIniciaisComQuantidades);
      }
    },
  });

  //MESMA LOGICA PARA ESPECIALIDADES
  api.hospitalManager.getEspecialidades.useQuery(undefined, {
    cacheTime: Infinity,
    onSuccess: (especialidades) => {
      const especialidadesIniciaisQuantidadesZero = especialidades.map(
        (eqp) => ({
          itemId: eqp.id,
          itemCount: "0",
        }),
      );
      0;

      if (!initialData) {
        form.setValue("especialidades", especialidadesIniciaisQuantidadesZero);
      } else if (especialidadesIniciais?.length !== especialidades.length) {
        const especialidadesIniciaisComQuantidades =
          especialidadesIniciaisQuantidadesZero.map((eqp) => {
            const especialidadeInicial = especialidadesIniciais?.find(
              (ei) => ei.itemId === eqp.itemId,
            );
            return especialidadeInicial || eqp;
          });
        form.setValue("especialidades", especialidadesIniciaisComQuantidades);
      }
    },
  });

  //POR FIM RETONAR O FORM
  return form;
};
