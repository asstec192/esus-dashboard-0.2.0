import { MinusCircle, PlusCircle } from "lucide-react";
import { DestinationList, SourceList } from "../ui/transfer-list";
import { TransferlistProvider } from "../ui/transfer-list-provider";
import { Button } from "../ui/button";
import { FormControl, FormField, FormItem, FormLabel } from "../ui/form";
import { Input } from "../ui/input";
import { RouterOutputs, api } from "@/utils/api";
import { Label } from "../ui/label";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { FormSchemaGerenciadorHospital } from "@/hooks/useRelatorioUnidadeForm";
import { Badge } from "../ui/badge";
import { Card } from "../ui/card";
import { ScrollArea } from "../ui/scroll-area";

type SelectEquipamentosProps = {
  equipamentosAtuais?: NonNullable<
    RouterOutputs["hospitalManager"]["obterRelatorio"]
  >["UnidadeRelatorioEquipamentos"];
  form: UseFormReturn<z.infer<typeof FormSchemaGerenciadorHospital>>;
};

export const SelectEquipamentos = ({
  equipamentosAtuais,
  form,
}: SelectEquipamentosProps) => {
  const { data: equipamentos } = api.hospitalManager.getEquipamentos.useQuery();

  return (
    <TransferlistProvider
      sourceList={
        equipamentos?.map((opt) => ({
          label: opt.descricao,
          value: opt.id.toString(),
        })) || []
      }
      destinationList={equipamentosAtuais?.map((eqp) => ({
        label: eqp.equipamento.descricao,
        value: eqp.equipamentoId.toString(),
      }))}
    >
      <div className="flex flex-1 gap-2">
        <div className="flex flex-1 flex-col space-y-2">
          <Label>Equipamentos</Label>
          <SourceList
            withSearch
            className="h-[250px]"
            render={({ option, onTransfer }) => (
              <Button
                variant="outline"
                onClick={() => {
                  const currentItems = form.getValues("equipamentos");
                  const newItem = {
                    itemId: Number(option.value),
                    itemCount: "1",
                  };
                  form.setValue("equipamentos", [...currentItems, newItem]);
                  onTransfer();
                }}
                key={option.value + "source"}
              >
                <PlusCircle size={14} className="mr-2" />
                {option.label}
              </Button>
            )}
          />
        </div>
        <div className="flex flex-1 flex-col space-y-2">
          <Label>Equipamentos Cadastrados</Label>
          <FormField
            control={form.control}
            name="equipamentos"
            render={({ field }) => (
              <DestinationList
                render={({ option, onTransfer }) => (
                  <div className="flex gap-2" key={option.value}>
                    <Button
                      variant="outline"
                      className="flex-[4] border-primary"
                      onClick={() => {
                        const currentValue = form.getValues("equipamentos");
                        form.setValue(
                          "equipamentos",
                          currentValue.filter(
                            (esp) => esp.itemId.toString() !== option.value,
                          ),
                        );
                        onTransfer();
                      }}
                    >
                      <MinusCircle size={14} className="mr-2" />
                      {option.label}
                    </Button>
                    <Input
                      type="number"
                      placeholder="qtd"
                      className="flex-[1]"
                      value={
                        field.value.find(
                          (equipamento) =>
                            equipamento.itemId.toString() === option.value,
                        )?.itemCount
                      }
                      onChange={(e) => {
                        const currentItems = form.getValues("equipamentos");
                        form.setValue(
                          "equipamentos",
                          currentItems.map((item) =>
                            item.itemId.toString() === option.value
                              ? { ...item, itemCount: e.target.value }
                              : item,
                          ),
                        );
                      }}
                    />
                  </div>
                )}
              />
            )}
          />
        </div>
      </div>
    </TransferlistProvider>
  );
};

export const Equipamentos = ({
  form,
}: {
  form: UseFormReturn<z.infer<typeof FormSchemaGerenciadorHospital>>;
}) => {
  const { data: equipamentos } = api.hospitalManager.getEquipamentos.useQuery();

  return (
    <FormField
      control={form.control}
      name="equipamentos"
      render={({ field }) => (
        <FormItem className="flex-1">
          <FormLabel>Equipamentos</FormLabel>
          <FormControl>
            <Card className="p-4">
              <ScrollArea className="h-[500px]">
                <div className="space-y-2">
                  {equipamentos?.map((esp) => (
                    <FormItem className="flex gap-2 space-y-0">
                      <Badge
                        variant="outline"
                        className="h-10 w-max flex-[4] justify-center rounded-md"
                      >
                        {esp.descricao}
                      </Badge>
                      <FormControl>
                        <Input
                          className="flex-[1]"
                          type="number"
                          min={0}
                          value={
                            field.value.find((item) => item.itemId === esp.id)
                              ?.itemCount || "0"
                          }
                          onChange={(e) => {
                            const currentItems = form.getValues("equipamentos");
                            form.setValue(
                              "equipamentos",
                              currentItems.map((item) =>
                                item.itemId === esp.id
                                  ? { ...item, itemCount: e.target.value }
                                  : item,
                              ),
                            );
                          }}
                        />
                      </FormControl>
                    </FormItem>
                  ))}
                </div>
              </ScrollArea>
            </Card>
          </FormControl>
        </FormItem>
      )}
    />
  );
};
