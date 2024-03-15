import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formSchemaRelatorioHospital } from "@/validators";
import { api } from "@/trpc/react";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";

export const GerenciamentoRedeFormFieldEquipamentos = ({
  form,
}: {
  form: UseFormReturn<z.infer<typeof formSchemaRelatorioHospital>>;
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
