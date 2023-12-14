import { MinusCircle, PlusCircle } from "lucide-react";
import { DestinationList, SourceList } from "../ui/transfer-list";
import { TransferlistProvider } from "../ui/transfer-list-provider";
import { Button } from "../ui/button";
import { FormField } from "../ui/form";
import { Input } from "../ui/input";
import { api } from "@/utils/api";
import { useHospitalManager } from "./FormGerenciamentoHospital.provider";
import { Label } from "../ui/label";

export const SelectEquipamentos = () => {
  const { manager } = useHospitalManager();
  const { data: equipamentos } = api.hospitalManager.getEquipamentos.useQuery();
  return (
    <TransferlistProvider
      sourceList={
        equipamentos?.map((opt) => ({
          label: opt.descricao,
          value: opt.id.toString(),
        })) || []
      }
      destinationList={manager.equipamentos.map((eqp) => ({
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
                  manager.onItemAdded(Number(option.value), "equipamentos");
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
            control={manager.form.control}
            name="equipamentos"
            render={({ field }) => (
              <DestinationList
                render={({ option, onTransfer }) => (
                  <div className="flex gap-2" key={option.value}>
                    <Button
                      variant="outline"
                      className="flex-[4] border-primary"
                      onClick={() => {
                        manager.onItemRemoved(option.value, "equipamentos");
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
                        manager.onItemCountChange(
                          Number(option.value),
                          e.target.value,
                          "equipamentos",
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
