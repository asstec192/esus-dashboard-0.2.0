import {
  HospitalItem,
  formSchemaRelatorioHospital,
} from "@/constants/zod-schemas";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";

type UpdateEquipamentosParams = {
  option: Option;
  newCount?: string;
  action: "add" | "remove" | "countChange";
  form: UseFormReturn<z.infer<typeof formSchemaRelatorioHospital>>;
  field: "equipamentos" | "especialidades";
};

export function atualizarCampoDeEspecialidadesOuEquipamentos({
  option,
  action,
  newCount,
  form,
  field,
}: UpdateEquipamentosParams) {
  const currentItems = form.getValues(field);

  //ADICIONA O ITEM
  if (action === "add") {
    const newItem: HospitalItem = {
      itemId: Number(option.value),
      itemCount: "1",
      itemDescription: option.label,
    };
    form.setValue(field, [...currentItems, newItem]);
    return;
  }

  //REMOVE O ITEM
  if (action === "remove") {
    form.setValue(
      field,
      currentItems.filter((item) => item.itemId.toString() !== option.value),
    );
    return;
  }

  //ALTERA A QUANTIDADE DO ITEM
  form.setValue(
    field,
    currentItems.map((item) =>
      item.itemId.toString() === option.value
        ? { ...item, itemCount: newCount || "1" }
        : item,
    ),
  );
}
