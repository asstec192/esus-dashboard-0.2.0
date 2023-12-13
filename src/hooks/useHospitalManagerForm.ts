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
  hospitalId: z.number(),
  equipamentos: z.array(HospitalItemSchema),
  especialidades: z.array(HospitalItemSchema),
  foneContato: z.string().refine((data) => telefonePattern.test(data), {
    message: "Número de telefone inválido. Use o formato (XX) XXXX-XXXX.",
  }),
  horaContato: z.string(),
  pessoaContactada: z.string(),
  chefeEquipe: z.string(),
  obervacao: z.string().optional(),
});

export const useHospitlManagerForm = (
  hospitalId: number,
  ultimoRelatorio: RouterOutputs["hospitalManager"]["obterRelatorioHospitalar"],
) => {
  const equipamentos = ultimoRelatorio[0];
  const especialidades = ultimoRelatorio[1];
  const infosDeContanto = ultimoRelatorio[2];

  const form = useForm<z.infer<typeof FormSchemaGerenciadorHospital>>({
    resolver: zodResolver(FormSchemaGerenciadorHospital),
    values: {
      hospitalId: hospitalId,
      equipamentos: equipamentos.map((eqp) => ({
        itemId: eqp.equipamentoId,
        itemCount: eqp.quantidade.toString(),
      })),
      especialidades: especialidades.map((esp) => ({
        itemId: esp.especialidadeId,
        itemCount: esp.quantidade.toString(),
      })),
      chefeEquipe: infosDeContanto?.chefeEquipe || "",
      foneContato: infosDeContanto?.contato || "",
      horaContato: infosDeContanto?.horaContato || "",
      pessoaContactada: infosDeContanto?.nomeContato || "",
      obervacao: infosDeContanto?.observacao || "",
    },
    defaultValues: {
      hospitalId: hospitalId,
      equipamentos: [],
      especialidades: [],
      foneContato: "",
      horaContato: "",
      pessoaContactada: "",
      chefeEquipe: "",
      obervacao: "",
    },
  });

  /**
   * Altera o estado do form adicionando um item de hospital, seja uma especialidade ou equipamento
   * @param newItemId Id do item adicionado
   * @param fieldName Nome do campo do form
   */
  const onItemAdded = (
    newItemId: number,
    fieldName: "especialidades" | "equipamentos",
  ) => {
    const currentItems = form.getValues(fieldName);
    const newItem = {
      itemId: newItemId,
      itemCount: "1",
    };
    form.setValue(fieldName, [...currentItems, newItem]);
  };

  /**
   * Altera o estado do form removendo um item de hospital, seja uma especialidade ou equipamento
   * @param itemId Id do item a ser removido
   * @param fieldName Nome do campo do form
   */
  const onItemRemoved = (
    itemId: string,
    fieldName: "especialidades" | "equipamentos",
  ) => {
    const currentValue = form.getValues(fieldName);
    form.setValue(
      fieldName,
      currentValue.filter((esp) => esp.itemId.toString() !== itemId),
    );
  };

  /**
   * Altera o estado do form modificando a contagem dos items de hospital ja adicionados
   * @param itemId Id do item selecionado
   * @param newCount Nova quantidade do item
   * @param fieldName Nome do campo do form
   */
  const onItemCountChange = (
    itemId: number,
    newCount: string,
    fieldName: "especialidades" | "equipamentos",
  ) => {
    const currentItems = form.getValues(fieldName);
    form.setValue(
      fieldName,
      currentItems.map((item) =>
        item.itemId === itemId ? { ...item, itemCount: newCount } : item,
      ),
    );
  };

  return {
    form,
    equipamentos,
    especialidades,
    infosDeContanto,
    onItemAdded,
    onItemRemoved,
    onItemCountChange,
  };
};
