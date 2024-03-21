import type { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import type { RouterOutputs } from "@/trpc/shared";
import type { HospitalItem } from "@/validators";
import { useGerenciamentoRedeRelatorioStore } from "@/app/gerenciamento-rede/stores";
import { toast } from "@/components/ui/use-toast";
import { api } from "@/trpc/react";
import { formSchemaRelatorioHospital } from "@/validators";

export const useFormRelatorioUnidade = (
  /**Os dados iniciais que preencherão o form, caso de atualizacao de relatorio*/
  initialData?: RouterOutputs["hospitalManager"]["obterRelatorio"],
) => {
  //EQUIPAMENTOS E ESPECIALIDADES INICIAIS DO RELATORIO
  const equipamentosIniciais: HospitalItem[] | undefined =
    initialData?.UnidadeRelatorioEquipamentos.map((eqp) => ({
      itemId: eqp.equipamentoId,
      itemCount: eqp.quantidade.toString(),
      itemDescription: eqp.equipamento.descricao,
    }));

  const especialidadesIniciais: HospitalItem[] | undefined =
    initialData?.UnidadeRelatorioEspecialidades.map((esp) => ({
      itemId: esp.especialidadeId,
      itemCount: esp.quantidade.toString(),
      itemDescription: esp.especialidade.descricao,
    }));

  //obtem a data selecionada no date picker
  const date = useGerenciamentoRedeRelatorioStore((state) => state.date);

  const form = useForm<z.infer<typeof formSchemaRelatorioHospital>>({
    resolver: zodResolver(formSchemaRelatorioHospital),
    values: {
      relatorioId: initialData?.id ?? 0,
      hospitalId: initialData?.unidadeId ?? 0,
      chefeEquipe: initialData?.chefeEquipe ?? "",
      foneContato: initialData?.contato ?? "",
      horaContato: initialData?.horaContato ?? "",
      pessoaContactada: initialData?.nomeContato ?? "",
      obervacao: initialData?.observacao ?? "",
      turno: initialData?.turno ?? "",
      equipamentos: equipamentosIniciais ?? [],
      especialidades: especialidadesIniciais ?? [],
      createdAt: initialData?.createdAt ?? date,
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
      createdAt: date,
    },
  });

  const utils = api.useUtils();

  //requisicao de criacao do relatorio
  const { mutate: criar } = api.hospitalManager.criarRelatorio.useMutation({
    onSuccess: () => {
      toast({ description: "Relatório salvo com sucesso" });
      utils.hospitalManager.obterRelatorios.invalidate();
      utils.hospitalManager.obterRelatoriosAgrupadosPorHospitais.invalidate();
      form.reset();
    },
    onError: (error) =>
      toast({ description: error.message, variant: "destructive" }),
  });

  //requisicao de edicao de relatorio
  const { mutate: editar } = api.hospitalManager.atualizarRelatorio.useMutation(
    {
      onSuccess: (data) => {
        toast({ description: "Relatório salvo com sucesso" });
        utils.hospitalManager.obterRelatorios.invalidate();
        utils.hospitalManager.obterRelatoriosAgrupadosPorHospitais.invalidate();
        utils.hospitalManager.obterRelatorio.invalidate({
          relatorioId: data[0].id,
        });
      },
      onError: (error) =>
        toast({ description: error.message, variant: "destructive" }),
    },
  );

  //edita se quando ha dados iniciais, e cria quando não há
  const onSubmit = form.handleSubmit((values) =>
    initialData ? editar(values) : criar(values),
  );

  return { form, onSubmit };
};
