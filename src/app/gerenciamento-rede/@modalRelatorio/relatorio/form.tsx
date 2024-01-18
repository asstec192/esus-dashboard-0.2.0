"use client";

import { useMask } from "@react-input/mask";
import { api } from "@/trpc/react";
import { RouterOutputs } from "@/trpc/shared";
import { useSession } from "next-auth/react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Combobox } from "@/components/ui/combobox";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { SelectValue } from "@radix-ui/react-select";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useEncontraUltimoRegistroDeItemsDaUnidade } from "./useEncontraUltimoRegistroDeItemsDaUnidade";
import { useFormRelatorioUnidade } from "./useFormRelatorioUnidade";
import { GerenciamentoRedeTransferEquipamentos } from "./transferlist-equipamentos";
import { GerenciamentoRedeTransferEspecialidades } from "./transferlist-especialidades";

type FormRelatorioUnidadeProps = {
  initialData?: RouterOutputs["hospitalManager"]["obterRelatorio"];
};

export function GerenciamentoRedeFormRelatorioUnidade({
  initialData,
}: FormRelatorioUnidadeProps) {
  const session = useSession();
  const { form, onSubmit } = useFormRelatorioUnidade(initialData);

  const { buscaEquipamentosMutation, buscaEspecialidadesMutation } =
    useEncontraUltimoRegistroDeItemsDaUnidade(form);

  const foneRef = useMask({
    modify: (value) => ({
      mask: value[2] === "9" ? "(__) _____-____" : undefined, //se for celular acrescenta 1 digito à mascara
    }),
    mask: "(__) ____-____",
    replacement: { _: /\d/ },
  });

  const { data: hospitais } = api.destinations.getAll.useQuery();

  return (
    <Form {...form}>
      <form
        className="flex flex-col space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
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
                      disabled={!!initialData}
                      defaultValue={initialData?.unidadeId.toString()}
                      options={
                        hospitais?.map((h) => ({
                          value: h.UnidadeCOD.toString(),
                          label: h.UnidadeDS || "UNIDADE SEM DESCRIÇÃO",
                        })) || []
                      }
                      onValueChange={(value) => {
                        form.setValue("hospitalId", Number(value));
                        const unidadeId = Number(form.watch("hospitalId"));
                        if (!initialData && unidadeId > 0) {
                          buscaEquipamentosMutation.mutate({ unidadeId });
                          buscaEspecialidadesMutation.mutate({ unidadeId });
                        }
                      }}
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
                      placeholder="(85) 98888-8888"
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
          <div className="flex flex-[2] flex-col gap-4">
            <GerenciamentoRedeTransferEquipamentos form={form} />
            <GerenciamentoRedeTransferEspecialidades form={form} />
          </div>
        </div>
        <Button
          className="mt-4 w-[300px] self-end"
          type="submit"
          //desabilita ediçao se nao for o mesmo usuario criador
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
