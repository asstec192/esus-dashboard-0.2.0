import type { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import type { RouterOutputs } from "@/trpc/shared";
import type { HospitalItem } from "@/validators";
import { useRelatoriosDateStore } from "@/app/gerenciamento-rede/_useRelatoriosDateStore";
import { toast } from "@/components/ui/use-toast";
import { api } from "@/trpc/react";
import { formSchemaRelatorioHospital } from "@/validators";

export const useFormRelatorioUnidade = (
  relatorioEditavel?: RouterOutputs["hospitalManager"]["obterRelatorios"][0],
) => {
  //EQUIPAMENTOS E ESPECIALIDADES INICIAIS DO RELATORIO
  const equipamentosIniciais: HospitalItem[] | undefined =
    relatorioEditavel?.UnidadeRelatorioEquipamentos.map((eqp) => ({
      itemId: eqp.equipamentoId,
      itemCount: eqp.quantidade.toString(),
      itemDescription: eqp.equipamento.descricao,
    }));

  const especialidadesIniciais: HospitalItem[] | undefined =
    relatorioEditavel?.UnidadeRelatorioEspecialidades.map((esp) => ({
      itemId: esp.especialidadeId,
      itemCount: esp.quantidade.toString(),
      itemDescription: esp.especialidade.descricao,
    }));

  //obtem a data selecionada no date picker
  const date = useRelatoriosDateStore((state) => state.date);

  const form = useForm<z.infer<typeof formSchemaRelatorioHospital>>({
    resolver: zodResolver(formSchemaRelatorioHospital),
    defaultValues: {
      relatorioId: relatorioEditavel?.id ?? 0,
      hospitalId: relatorioEditavel?.unidadeId ?? 0,
      chefeEquipe: relatorioEditavel?.chefeEquipe ?? "",
      foneContato: relatorioEditavel?.contato ?? "",
      horaContato: relatorioEditavel?.horaContato ?? "",
      pessoaContactada: relatorioEditavel?.nomeContato ?? "",
      obervacao: relatorioEditavel?.observacao ?? "",
      turno: relatorioEditavel?.turno ?? "",
      equipamentos: equipamentosIniciais ?? [],
      especialidades: especialidadesIniciais ?? [],
      createdAt: relatorioEditavel?.createdAt ?? date,
    },
  });

  const utils = api.useUtils();

  const { mutate: criar } = api.hospitalManager.criarRelatorio.useMutation({
    onSuccess: async () => {
      toast({ description: "Relatório salvo com sucesso" });
      await utils.hospitalManager.obterRelatorios.invalidate(date);
      await utils.hospitalManager.obterRelatoriosAgrupadosPorHospitais.invalidate(
        date,
      );
      form.reset();
    },
    onError: (error) =>
      toast({ description: error.message, variant: "destructive" }),
  });

  const { mutate: editar } = api.hospitalManager.atualizarRelatorio.useMutation(
    {
      onSuccess: async () => {
        toast({ description: "Relatório salvo com sucesso" });
        await utils.hospitalManager.obterRelatorios.invalidate(date);
        await utils.hospitalManager.obterRelatoriosAgrupadosPorHospitais.invalidate(
          date,
        );
      },
      onError: (error) =>
        toast({ description: error.message, variant: "destructive" }),
    },
  );

  const onSubmit = form.handleSubmit((values) =>
    relatorioEditavel ? editar(values) : criar(values),
  );

  return { form, onSubmit };
};
