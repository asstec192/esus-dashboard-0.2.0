import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { TransferList } from "@/components/ui/transfer-list";
import { TransferlistProvider } from "@/components/ui/transfer-list-provider";
import { formSchemaRelatorioHospital } from "@/constants/zod-schemas";
import { api } from "@/trpc/react";
import { ChevronsLeft, ChevronsRight } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { Label } from "@/components/ui/label";
import { atualizarCampoDeEspecialidadesOuEquipamentos } from "@/app/gerenciamento-rede/@modalRelatorio/relatorio/helpers";

type SelectEspecialidadesProps = {
  form: UseFormReturn<z.infer<typeof formSchemaRelatorioHospital>>;
};

export const GerenciamentoRedeTransferEspecialidades = ({
  form,
}: SelectEspecialidadesProps) => {
  const { data: sourceList } = api.hospitalManager.getEspecialidades.useQuery();

  return (
    <TransferlistProvider
      sourceList={
        sourceList?.map((opt) => ({
          label: opt.descricao,
          value: opt.id.toString(),
        })) || []
      }
      destinationList={form.watch("especialidades").map((esp) => ({
        label: esp.itemDescription,
        value: esp.itemId.toString(),
      }))}
    >
      <div className="flex flex-1 gap-2">
        <div className="flex flex-1 flex-col space-y-2">
          <Label>Adicionar Especialidades</Label>
          <TransferList
            withSearch
            isSourceList
            className="h-[250px]"
            render={({ option, onTransfer }) => (
              <Button
                variant="outline"
                onClick={() => {
                  atualizarCampoDeEspecialidadesOuEquipamentos({
                    option,
                    form,
                    action: "add",
                    field: "especialidades",
                  });
                  onTransfer();
                }}
                key={option.value + "source"}
              >
                {option.label}
                <ChevronsRight size={14} className="ml-2" />
              </Button>
            )}
          />
        </div>
        <div className="flex flex-1 flex-col space-y-2">
          <Label>Especialidades</Label>
          <FormField
            control={form.control}
            name="especialidades"
            render={({ field }) => (
              <TransferList
                render={({ option, onTransfer }) => (
                  <div className="flex gap-2" key={option.value}>
                    {/* ---------------- BOTAO DE REMOVER ITEM ---------------*/}
                    <Button
                      variant="outline"
                      className="flex-[4]"
                      onClick={() => {
                        atualizarCampoDeEspecialidadesOuEquipamentos({
                          option,
                          form,
                          action: "remove",
                          field: "especialidades",
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
                          (especialidade) =>
                            especialidade.itemId.toString() === option.value,
                        )?.itemCount
                      }
                      onChange={(e) =>
                        atualizarCampoDeEspecialidadesOuEquipamentos({
                          action: "countChange",
                          field: "especialidades",
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
