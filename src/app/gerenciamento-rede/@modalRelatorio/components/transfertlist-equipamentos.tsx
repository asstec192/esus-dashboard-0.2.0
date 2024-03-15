import { api } from "@/trpc/react";
import { ChevronsLeft, ChevronsRight } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formSchemaRelatorioHospital } from "@/validators";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState } from "react";
import { getStringScoreMatches } from "@/utils/getStringScoreMatch";

type TransferEquipamentosProps = {
  form: UseFormReturn<z.infer<typeof formSchemaRelatorioHospital>>;
};

export const TransferEquipamentos = ({ form }: TransferEquipamentosProps) => {
  const { data: equipamentos } = api.hospitalManager.getEquipamentos.useQuery();
  const [search, setSearch] = useState("");

  const sourceList = equipamentos?.filter(
    (eqp) =>
      getStringScoreMatches(eqp.descricao, search) > 0 &&
      !form.watch("equipamentos").some((item) => item.itemId === eqp.id),
  );

  return (
    <FormField
      control={form.control}
      name="equipamentos"
      render={({ field }) => (
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {/*  ------------ LISTA FONTE --------------- */}
          <Card className="flex h-[300px] flex-col space-y-2 p-2">
            <Label className="my-2">Selecione os equipamentos</Label>
            <Input
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar..."
            />
            <ScrollArea className="flex-grow">
              <div className="flex flex-col gap-1">
                {sourceList?.map((eqp) => (
                  <Button
                    type="button"
                    key={eqp.id}
                    variant="outline"
                    // Adiciona um equipamento
                    onClick={() =>
                      form.setValue("equipamentos", [
                        ...field.value,
                        {
                          itemCount: "1",
                          itemDescription: eqp.descricao,
                          itemId: eqp.id,
                        },
                      ])
                    }
                  >
                    {eqp.descricao}
                    <ChevronsRight className="ml-2 w-4" />
                  </Button>
                ))}
              </div>
            </ScrollArea>
          </Card>
          {/*  -------------- LISTA DE DESTINO --------------- */}
          <Card className="flex h-[300px] flex-col gap-2 p-2">
            <Label className="my-2">Equipamentos selecionados</Label>
            <ScrollArea className="flex-grow">
              <div className="flex flex-col gap-1">
                {form.watch("equipamentos").map((eqp) => (
                  <div key={eqp.itemId} className="grid grid-cols-5 gap-1">
                    <Button
                      type="button"
                      variant="outline"
                      className="col-span-4"
                      // Remove um equipamento
                      onClick={() =>
                        form.setValue(
                          "equipamentos",
                          field.value.filter(
                            (item) => item.itemId !== eqp.itemId,
                          ),
                        )
                      }
                    >
                      <ChevronsLeft className="mr-2 w-4" />
                      {eqp.itemDescription}
                    </Button>
                    <Input
                      type="number"
                      placeholder="qtd"
                      min={1}
                      value={
                        field.value.find((item) => item.itemId === eqp.itemId)
                          ?.itemCount
                      }
                      onChange={(e) => {
                        const newValue = e.target.value;
                        const updatedValues = field.value.map((item) =>
                          item.itemId === eqp.itemId
                            ? { ...item, itemCount: newValue }
                            : item,
                        );
                        form.setValue("equipamentos", updatedValues);
                      }}
                    />
                  </div>
                ))}
              </div>
            </ScrollArea>
          </Card>
        </div>
      )}
    ></FormField>
  );
};
