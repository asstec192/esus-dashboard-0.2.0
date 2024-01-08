import { toast } from "@/components/ui/use-toast";
import {
  HospitalItem,
  formSchemaRelatorioHospital,
} from "@/constants/zod-schemas";
import { api } from "@/trpc/react";
import { RouterOutputs } from "@/trpc/shared";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useGerenciamentoRedeRelatorioStore } from "../stores";
import { useEffect } from "react";

export const useRelatorioUnidadeForm = (
  initialData: RouterOutputs["hospitalManager"]["obterRelatorio"],
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

  const date = useGerenciamentoRedeRelatorioStore((state) => state.date);

  //OBTENDO O FORM DO HOOK
  const form = useForm<z.infer<typeof formSchemaRelatorioHospital>>({
    resolver: zodResolver(formSchemaRelatorioHospital),
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
      createdAt: initialData?.createdAt || date,
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

  //MUTACOES DO SUBMIT
  const { mutate: criar } = api.hospitalManager.criarRelatorio.useMutation({
    onSuccess: () => {
      toast({ description: "Relatório salvo com sucesso" });
      utils.hospitalManager.obterRelatorios.invalidate();
      form.reset();
    },
    onError: (error) =>
      toast({ description: error.message, variant: "destructive" }),
  });

  const { mutate: atualizar } =
    api.hospitalManager.atualizarRelatorio.useMutation({
      onSuccess: () => {
        toast({ description: "Relatório salvo com sucesso" });
        utils.hospitalManager.obterRelatorios.invalidate();
      },
      onError: (error) =>
        toast({ description: error.message, variant: "destructive" }),
    });

  const onSubmit = form.handleSubmit((values) =>
    initialData ? atualizar(values) : criar(values),
  );

  return { form, onSubmit };
};
