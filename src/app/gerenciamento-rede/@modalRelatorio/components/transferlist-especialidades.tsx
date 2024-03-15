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

type TransferEspecialidadesProps = {
  form: UseFormReturn<z.infer<typeof formSchemaRelatorioHospital>>;
};

export const TransferEspecialidades = ({
  form,
}: TransferEspecialidadesProps) => {
  const { data: especialidades } =
    api.hospitalManager.getEspecialidades.useQuery();

  const [search, setSearch] = useState("");

  const sourceList = especialidades?.filter(
    (esp) =>
      getStringScoreMatches(esp.descricao, search) > 0 &&
      !form.watch("especialidades").some((item) => item.itemId === esp.id),
  );

  return (
    <FormField
      control={form.control}
      name="especialidades"
      render={({ field }) => (
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {/*  ------------ LISTA FONTE --------------- */}
          <Card className="flex h-[300px] flex-col space-y-2 p-2">
            <Label className="my-2">Selecione as especialidades</Label>
            <Input
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar..."
            />
            <ScrollArea className="flex-grow">
              <div className="flex flex-col gap-1">
                {sourceList?.map((esp) => (
                  <Button
                    type="button"
                    key={esp.id}
                    variant="outline"
                    // Adiciona uma especialidade
                    onClick={() =>
                      form.setValue("especialidades", [
                        ...field.value,
                        {
                          itemCount: "1",
                          itemDescription: esp.descricao,
                          itemId: esp.id,
                        },
                      ])
                    }
                  >
                    {esp.descricao}
                    <ChevronsRight className="ml-2 w-4" />
                  </Button>
                ))}
              </div>
            </ScrollArea>
          </Card>
          {/*  -------------- LISTA DE DESTINO --------------- */}
          <Card className="flex h-[300px] flex-col gap-2 p-2">
            <Label className="my-2">Especialidades selecionadas</Label>
            <ScrollArea className="flex-grow">
              <div className="flex flex-col gap-1">
                {form.watch("especialidades").map((esp) => (
                  <div key={esp.itemId} className="grid grid-cols-5 gap-1">
                    <Button
                      type="button"
                      variant="outline"
                      className="col-span-4"
                      // Remove uma especialidade
                      onClick={() =>
                        form.setValue(
                          "especialidades",
                          field.value.filter(
                            (item) => item.itemId !== esp.itemId,
                          ),
                        )
                      }
                    >
                      <ChevronsLeft className="mr-2 w-4" />
                      {esp.itemDescription}
                    </Button>
                    <Input
                      type="number"
                      placeholder="qtd"
                      min={1}
                      value={
                        field.value.find((item) => item.itemId === esp.itemId)
                          ?.itemCount
                      }
                      // Altera a quantidade de uma especialidade
                      onChange={(e) => {
                        const newValue = e.target.value;
                        const updatedValues = field.value.map((item) =>
                          item.itemId === esp.itemId
                            ? { ...item, itemCount: newValue }
                            : item,
                        );
                        form.setValue("especialidades", updatedValues);
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
