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
import {
  Especialidades,
  SelectEspecialidades,
} from "./FormGerenciamentoHospital.especialidades";
import {
  Equipamentos,
  SelectEquipamentos,
} from "./FormGerenciamentoHospital.equipamentos";
import { useMask } from "@react-input/mask";
import { RouterOutputs, api } from "@/utils/api";
import { toast } from "../ui/use-toast";
import { useRelatorioUnidadeForm } from "@/hooks/useRelatorioUnidadeForm";
import { Combobox } from "../ui/combobox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useSession } from "next-auth/react";

type FormRelatorioUnidadeProps = {
  initialData: RouterOutputs["hospitalManager"]["obterRelatorio"];
};

export function FormRelatorioUnidade({
  initialData,
}: FormRelatorioUnidadeProps) {
  const utils = api.useContext();
  const session = useSession();
  const form = useRelatorioUnidadeForm(initialData);

  const foneRef = useMask({
    mask: "(__) ____-____",
    replacement: { _: /\d/ },
  });

  const { data: hospitais } = api.destinations.getAll.useQuery();

  const { mutate: criar } = api.hospitalManager.criarRelatorio.useMutation({
    onSuccess: () => {
      toast({ description: "Relatório salvo com sucesso" });
      utils.hospitalManager.obterRelatorios.invalidate();
    },
    onError: (error) =>
      toast({ description: error.message, variant: "destructive" }),
  });

  const { mutate: atualizar } =
    api.hospitalManager.atualizarRelatorio.useMutation({
      onSuccess: () => {
        toast({ description: "Relatório salvo com sucesso" });
        utils.hospitalManager.obterRelatorios.invalidate();
      },
      onError: (error) =>
        toast({ description: error.message, variant: "destructive" }),
    });

  return (
    <Form {...form}>
      <form
        className="flex flex-col space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit((values) =>
            initialData ? atualizar(values) : criar(values),
          )();
        }}
      >
        <div className="flex flex-1 flex-wrap space-x-4">
          <div className="grid flex-[1] auto-rows-max grid-cols-2 gap-2 ">
            <FormField
              control={form.control}
              name="hospitalId"
              render={() => (
                <FormItem className="col-span-full">
                  <FormLabel>Unidade*</FormLabel>
                  <FormControl>
                    <Combobox
                      defaultValue={initialData?.unidadeId.toString()}
                      options={
                        hospitais?.map((h) => ({
                          value: h.UnidadeCOD.toString(),
                          label: h.UnidadeDS || "UNIDADE SEM DESCRIÇÃO",
                        })) || []
                      }
                      onValueChange={(value) =>
                        form.setValue("hospitalId", Number(value))
                      }
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="foneContato"
              render={({ field }) => (
                <FormItem className="col-span-full">
                  <FormLabel>Fone de Contato*</FormLabel>
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
              name="turno"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Turno*</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={initialData?.turno || field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="T0">T0</SelectItem>
                      <SelectItem value="T1">T1</SelectItem>
                      <SelectItem value="T2">T2</SelectItem>
                      <SelectItem value="T3">T3</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="horaContato"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Hora do Contato*</FormLabel>
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
                  <FormLabel>Pessoa Contactada*</FormLabel>
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
                  <FormLabel>Chefe de Equipe*</FormLabel>
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
          <div className="flex flex-[2] gap-4">
            <Especialidades form={form} />
            <Equipamentos form={form} />
            {/*    <SelectEspecialidades
              especialidadesAtuais={initialData?.UnidadeRelatorioEspecialidades}
              form={form}
            />
            <SelectEquipamentos
              equipamentosAtuais={initialData?.UnidadeRelatorioEquipamentos}
              form={form}
            /> */}
          </div>
        </div>
        <Button
          className="mt-4 w-[300px] self-end"
          type="submit"
          //desabilita ediçao s enao for o memso usuario criador
          disabled={
            !!initialData &&
            initialData.criadoPorId.toString() !== session.data?.user.id
          }
        >
          Salvar
        </Button>
      </form>
    </Form>
  );
}
