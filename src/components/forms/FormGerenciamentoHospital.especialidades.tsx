import { MinusCircle, PlusCircle } from "lucide-react";
import { Button } from "../ui/button";
import { FormField } from "../ui/form";
import { DestinationList, SourceList } from "../ui/transfer-list";
import { TransferlistProvider } from "../ui/transfer-list-provider";
import { Input } from "../ui/input";
import { api } from "@/utils/api";
import { useHospitalManager } from "./FormGerenciamentoHospital.provider";

export const SelectEspecialidades = () => {
  const { manager } = useHospitalManager();
  const { data: especialidades } =
    api.hospitalManager.getSpecialties.useQuery();
  return (
    <TransferlistProvider
      sourceList={
        especialidades?.map((opt) => ({
          label: opt.descricao,
          value: opt.id.toString(),
        })) || []
      }
      destinationList={manager.especialidades.map((esp) => ({
        label: esp.especialidade.descricao,
        value: esp.especialidadeId.toString(),
      }))}
    >
      <SourceList
        withSearch
        className="w-1/2"
        render={({ option, onTransfer }) => (
          <Button
            variant="outline"
            onClick={() => {
              manager.onItemAdded(Number(option.value), "especialidades");
              onTransfer();
            }}
            key={option.value + "source"}
          >
            <PlusCircle size={14} className="mr-2" />
            {option.label}
          </Button>
        )}
      />
      <FormField
        control={manager.form.control}
        name="especialidades"
        render={({ field }) => (
          <DestinationList
            className="w-1/2"
            render={({ option, onTransfer }) => (
              <div className="flex gap-2" key={option.value}>
                <Button
                  className="flex-[4]"
                  onClick={() => {
                    manager.onItemRemoved(option.value, "especialidades");
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
                  min={1}
                  value={
                    field.value.find(
                      (especialidade) =>
                        especialidade.itemId.toString() === option.value,
                    )?.itemCount
                  }
                  onChange={(e) => {
                    manager.onItemCountChange(
                      Number(option.value),
                      e.target.value,
                      "especialidades",
                    );
                  }}
                />
              </div>
            )}
          />
        )}
      />
    </TransferlistProvider>
  );
};
