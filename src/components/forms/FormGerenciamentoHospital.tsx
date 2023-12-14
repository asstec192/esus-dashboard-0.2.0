import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { SelectEspecialidades } from "./FormGerenciamentoHospital.especialidades";
import { SelectEquipamentos } from "./FormGerenciamentoHospital.equipamentos";
import { useMask } from "@react-input/mask";
import { api } from "@/utils/api";
import { toast } from "../ui/use-toast";
import { useHospitalManager } from "./FormGerenciamentoHospital.provider";
import { Label } from "../ui/label";

export function GerenciamentoHospital() {
  const {
    manager: { form },
  } = useHospitalManager();
  const foneRef = useMask({
    mask: "(__) ____-____",
    replacement: { _: /\d/ },
  });
  const { mutate } = api.hospitalManager.criarOuAtualizarRelatorio.useMutation({
    onSuccess: () => toast({ description: "Relatório salvo com sucesso" }),
    onError: (error) =>
      toast({ description: error.message, variant: "destructive" }),
  });
  return (
    <Form {...form}>
      <form
        className="flex flex-col space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit((values) => mutate(values))();
        }}
      >
        <div className="flex flex-wrap space-x-4">
          <div className="grid flex-[1] auto-rows-max grid-cols-2 gap-2 ">
            <FormField
              control={form.control}
              name="foneContato"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fone de Contato</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      ref={foneRef}
                      placeholder="(88) 8888-8888"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="horaContato"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Hora do Contato</FormLabel>
                  <FormControl>
                    <Input type="time" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="pessoaContactada"
              render={({ field }) => (
                <FormItem className="col-span-full">
                  <FormLabel>Pessoa Contactada</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="chefeEquipe"
              render={({ field }) => (
                <FormItem className="col-span-full">
                  <FormLabel>Chefe de Equipe</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="obervacao"
              render={({ field }) => (
                <FormItem className="col-span-full">
                  <FormLabel>Observação</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
          <div className="flex flex-[2] flex-col gap-4">
            <SelectEspecialidades />
            <SelectEquipamentos />
          </div>
        </div>
        <Button className="mt-4 w-[300px] self-end" type="submit">
          Salvar
        </Button>
      </form>
    </Form>
  );
}
