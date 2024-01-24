import { api } from "@/trpc/react";
import { ChevronsLeft, ChevronsRight } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TransferList } from "@/components/ui/transfer-list";
import { TransferlistProvider } from "@/components/ui/transfer-list-provider";
import { formSchemaRelatorioHospital } from "@/constants/zod-schemas";
import { atualizarCampoDeEspecialidadesOuEquipamentos } from "../helpers";

type SelectEquipamentosProps = {
  form: UseFormReturn<z.infer<typeof formSchemaRelatorioHospital>>;
};

export const GerenciamentoRedeTransferEquipamentos = ({
  form,
}: SelectEquipamentosProps) => {
  const { data: sourceList } = api.hospitalManager.getEquipamentos.useQuery();

  return (
    <TransferlistProvider
      sourceList={
        sourceList?.map((opt) => ({
          label: opt.descricao,
          value: opt.id.toString(),
        })) || []
      }
      destinationList={form.watch("equipamentos").map((eqp) => ({
        label: eqp.itemDescription,
        value: eqp.itemId.toString(),
      }))}
    >
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        <div className="flex flex-col space-y-2">
          <Label>Adicionar Equipamentos</Label>
          <TransferList
            withSearch
            isSourceList
            className="h-[265px]"
            render={({ option, onTransfer }) => (
              <Button
                variant="outline"
                className="w-full max-w-[370px]"
                onClick={() => {
                  atualizarCampoDeEspecialidadesOuEquipamentos({
                    action: "add",
                    field: "equipamentos",
                    form,
                    option,
                  });
                  onTransfer();
                }}
                key={option.value + "source"}
              >
                <span className="w-full truncate">{option.label}</span>
                <ChevronsRight size={14} className="ml-2" />
              </Button>
            )}
          />
        </div>
        <div className="flex flex-col space-y-2">
          <Label>Equipamentos</Label>
          <FormField
            control={form.control}
            name="equipamentos"
            render={({ field }) => (
              <TransferList
                className="h-[265px]"
                render={({ option, onTransfer }) => (
                  <div className="flex gap-2" key={option.value}>
                    {/* ---------------- BOTAO DE REMOVER ITEM ---------------*/}
                    <Button
                      variant="outline"
                      className="max-w-sm truncate"
                      onClick={() => {
                        atualizarCampoDeEspecialidadesOuEquipamentos({
                          action: "remove",
                          field: "equipamentos",
                          form,
                          option,
                        });
                        onTransfer();
                      }}
                    >
                      <ChevronsLeft size={14} className="mr-2" />
                      {option.label}
                    </Button>

                    {/* -----------------INPUT DE ALTERAR QUANTIDADE---------------- */}
                    <Input
                      type="number"
                      placeholder="qtd"
                      className="flex-[1]"
                      min={1}
                      value={
                        field.value.find(
                          (equipamento) =>
                            equipamento.itemId.toString() === option.value,
                        )?.itemCount
                      }
                      onChange={(e) =>
                        atualizarCampoDeEspecialidadesOuEquipamentos({
                          action: "countChange",
                          field: "equipamentos",
                          form,
                          option,
                          newCount: e.target.value,
                        })
                      }
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
