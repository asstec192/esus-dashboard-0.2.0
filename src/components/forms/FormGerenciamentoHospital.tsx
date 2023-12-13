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

export function GerenciamentoHospital() {
  const {
    manager: { form },
  } = useHospitalManager();
  const foneRef = useMask({
    mask: "(__) ____-____",
    replacement: { _: /\d/ },
  });
  const { mutate } = api.hospitalManager.criarOuAtualizarRelatorio.useMutation({
    onSuccess: () => toast({ description: "relatorio salvo com sucesso" }),
    onError: (error) => toast({ description: error.message }),
  });
  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-4"
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit((values) => mutate(values))();
        }}
      >
        <div className="grid w-1/2 grid-cols-2 gap-x-2 ">
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
            name="pessoaContactada"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Pessoa Contactada</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
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
            name="chefeEquipe"
            render={({ field }) => (
              <FormItem>
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
        <div className="flex gap-4">
          <div className="flex h-[300px] flex-1 gap-2">
            <SelectEspecialidades />
          </div>

          <div className="flex h-[300px] flex-1 gap-2">
            <SelectEquipamentos />
          </div>
        </div>

        <Button type="submit">Confirmar</Button>
      </form>
    </Form>
  );
}
